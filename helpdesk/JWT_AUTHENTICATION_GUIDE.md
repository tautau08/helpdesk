# JWT Authentication Guide - Best Practice

## 📚 Overview

This project implements **JWT (JSON Web Token) authentication** with **role-based access control**. The implementation follows industry best practices and is production-ready.

---

## 🏗️ Architecture - 4 Core Components

### 1. **JwtTokenProvider** (Token Factory)
**Location:** `config/security/JwtTokenProvider.java`

**Purpose:** Creates and validates JWT tokens

**Methods:**
- `generateToken(userId, username, roles)` - Creates JWT token after login
- `parseClaims(token)` - Validates and extracts data from token
- `getUserId(claims)` - Gets user ID from token
- `getRoles(claims)` - Gets user roles from token

**Configuration (application.properties):**
```properties
app.jwt.secret=change-this-dev-secret-please-make-32-bytes-min
app.jwt.issuer=helpdesk-api
app.jwt.access-ttl-seconds=3600  # 1 hour
```

---

### 2. **JwtAuthenticationFilter** (Security Guard)
**Location:** `config/security/JwtAuthenticationFilter.java`

**Purpose:** Intercepts every HTTP request and validates JWT tokens

**Flow:**
```
Request → Filter extracts "Authorization: Bearer <token>" 
       → Validates token 
       → Extracts username & roles 
       → Sets authentication in SecurityContext 
       → Continues to controller
```

**What it does:**
1. Reads `Authorization` header
2. Extracts token (removes "Bearer " prefix)
3. Validates token signature and expiration
4. Extracts user details (username, userId, roles)
5. Creates Spring Security authentication object
6. Sets authentication in SecurityContext (so controllers can access it)

---

### 3. **SecurityConfig** (Rule Book)
**Location:** `config/SecurityConfig.java`

**Purpose:** Defines which endpoints need authentication and what roles can access them

**Access Rules:**
```java
Public (No Auth):
- POST /api/auth/login

ADMIN & SYSTEM Only:
- /api/companies/**
- /api/projects/**
- /api/categories/**
- /api/subcategories/**
- /api/statuses/**
- /api/priorities/**
- /api/service-types/**
- /api/escalation-matrices/**
- /api/departments/**
- /api/roles/**
- /api/menus/**
- /api/users/**

ADMIN, SYSTEM, USER:
- /api/tickets/**

Everything else: Authenticated users only
```

**Key Settings:**
- **Session Policy:** `STATELESS` (no cookies, no sessions)
- **Password Encoding:** `BCrypt` (secure password hashing)
- **JWT Filter:** Runs before Spring's default authentication

---

### 4. **AuthController** (Login Handler)
**Location:** `controller/AuthController.java`

**Purpose:** Handles user login and returns JWT tokens

**Endpoint:** `POST /api/auth/login`

**Request Example:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response Example:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJ0eXAiOiJKV1QiLCJpc3MiOiJoZWxwZGVzay1hcGkiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTczMTkwMDAwMCwiZXhwIjoxNzMxOTAzNjAwLCJ1aWQiOjEsInJvbGVzIjpbIkFETUlOIl19.signature",
  "tokenType": "Bearer",
  "issuedAt": "2025-11-18T04:30:00Z",
  "userId": 1,
  "roles": ["ADMIN"]
}
```

---

## 🔐 How JWT Authentication Works

### Step-by-Step Flow

#### **1. Login (Get Token)**
```
User → POST /api/auth/login {username, password}
     → AuthController validates credentials
     → JwtTokenProvider creates token
     → Token returned to user
     → User stores token (localStorage/sessionStorage)
```

#### **2. Making Authenticated Requests**
```
User → GET /api/companies (with Authorization header)
     → JwtAuthenticationFilter intercepts request
     → Validates token
     → Extracts username & role
     → Sets authentication in SecurityContext
     → SecurityConfig checks if role has access
     → If allowed, request reaches controller
     → Controller processes request
     → Response sent back to user
```

#### **3. Token Validation**
```
JwtAuthenticationFilter:
  ↓
  Extract "Authorization: Bearer <token>"
  ↓
  JwtTokenProvider.parseClaims(token)
  ↓
  Validates:
    - Signature (ensures token not tampered)
    - Expiration (token still valid?)
    - Issuer (token created by our app?)
  ↓
  If valid: Extract user details
  If invalid: Reject request (401 Unauthorized)
```

---

## 🎯 Token Structure (JWT)

A JWT token has **3 parts** separated by dots:

```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIl19.signature
     HEADER            PAYLOAD (Claims)                SIGNATURE
```

### **Header**
```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

### **Payload (Claims)**
```json
{
  "iss": "helpdesk-api",      // Issuer
  "sub": "admin",              // Subject (username)
  "iat": 1731900000,           // Issued at
  "exp": 1731903600,           // Expiration
  "uid": 1,                    // User ID (custom claim)
  "roles": ["ADMIN"]           // Roles (custom claim)
}
```

### **Signature**
```
HMACSHA512(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

---

## 👥 Role-Based Access Control (RBAC)

### Roles in System
1. **ADMIN** - Full access to everything
2. **SYSTEM** - Full access (for system operations)
3. **USER** - Limited access (tickets only)
4. **VIEWER** - Read-only access

### How Roles Work

**In Database:**
```sql
users table → role_id → roles table
```

**In JWT Token:**
```json
{
  "roles": ["ADMIN"]
}
```

**In Spring Security:**
```java
// Automatically prefixed with "ROLE_"
.hasAnyRole("ADMIN", "SYSTEM")
// Becomes: ROLE_ADMIN, ROLE_SYSTEM
```

**In Controller (Optional):**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin-only")
public String adminOnly() {
    return "Admin access granted";
}
```

---

## 🧪 Testing the Authentication

### 1. **Login to Get Token**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "roles": ["ADMIN"]
}
```

### 2. **Use Token for Protected Endpoints**
```http
GET http://localhost:8080/api/companies
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

### 3. **Test Without Token (Should Fail)**
```http
GET http://localhost:8080/api/companies
# No Authorization header

Response: 401 Unauthorized
```

### 4. **Test Wrong Role (Should Fail)**
```http
# USER role tries to access admin endpoint
GET http://localhost:8080/api/companies
Authorization: Bearer <USER_ROLE_TOKEN>

Response: 403 Forbidden
```

---

## 📝 Postman Test Cases

### Test Case 1: Successful Login
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}

Expected: 200 OK with token
```

### Test Case 2: Invalid Credentials
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "username": "admin",
  "password": "wrongpassword"
}

Expected: 401 Unauthorized
```

### Test Case 3: Access Protected Endpoint (Authorized)
```
GET http://localhost:8080/api/companies
Headers:
Authorization: Bearer <VALID_TOKEN>

Expected: 200 OK with data
```

### Test Case 4: Access Protected Endpoint (Unauthorized)
```
GET http://localhost:8080/api/companies
Headers: (none)

Expected: 401 Unauthorized
```

### Test Case 5: Role-Based Access (Admin)
```
GET http://localhost:8080/api/users
Headers:
Authorization: Bearer <ADMIN_TOKEN>

Expected: 200 OK
```

### Test Case 6: Role-Based Access (USER trying Admin endpoint)
```
GET http://localhost:8080/api/users
Headers:
Authorization: Bearer <USER_TOKEN>

Expected: 403 Forbidden
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "401 Unauthorized" even with valid token
**Cause:** Token expired or invalid secret key

**Solution:**
1. Check token expiration time
2. Verify `app.jwt.secret` is same as when token was created
3. Generate new token by logging in again

### Issue 2: "403 Forbidden" with valid token
**Cause:** User role doesn't have permission

**Solution:**
1. Check user's role in database
2. Verify SecurityConfig allows that role for the endpoint
3. Check token's roles claim: `jwt.io` to decode token

### Issue 3: Filter not executing
**Cause:** Filter not registered properly

**Solution:**
1. Ensure `@Component` annotation on JwtAuthenticationFilter
2. Verify filter is added in SecurityConfig:
   `.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`

### Issue 4: Password doesn't match
**Cause:** Password not encoded when saving user

**Solution:**
```java
user.setPassword(passwordEncoder.encode(plainPassword));
```

---

## 🎓 Best Practices Implemented

✅ **Stateless Authentication** - No server-side sessions  
✅ **Secure Password Storage** - BCrypt hashing  
✅ **Token Expiration** - Configurable TTL  
✅ **Role-Based Access** - Granular permissions  
✅ **Filter Chain** - Runs before Spring Security  
✅ **Clean Architecture** - Separation of concerns  
✅ **Error Handling** - Clear error messages  
✅ **Production-Ready** - Industry standards  

---

## 📚 Key Takeaways

1. **JwtTokenProvider** = Creates and validates tokens
2. **JwtAuthenticationFilter** = Intercepts requests and checks tokens
3. **SecurityConfig** = Defines access rules
4. **AuthController** = Handles login

**Simple Flow:**
```
Login → Get Token → Send Token in Header → Filter Validates → Controller Processes
```

**Remember:**
- Always send token in `Authorization: Bearer <token>` header
- Token expires after configured time (default: 1 hour)
- Roles are case-sensitive
- Store tokens securely (never in URL or cookies without HttpOnly flag)

---

## 🚀 Next Steps

1. Test all endpoints with Postman
2. Create initial users with different roles
3. Implement refresh token (optional)
4. Add token blacklist for logout (optional)
5. Configure CORS if using frontend

---

**Need Help?** Refer to the code comments in each class for detailed explanations.

