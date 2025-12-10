# JWT Authentication - Quick Reference

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Application
```bash
./mvnw spring-boot:run
```

The application will automatically create:
- 4 default roles (SYSTEM, ADMIN, USER, VIEWER)
- 4 test users
- 1 default company
- 1 default department

### Step 2: Login to Get JWT Token

**Request:**
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
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJ0eXAiOiJKV1QiLCJpc3MiOiJoZWxwZGVzay1hcGkiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTczMTkwMDAwMCwiZXhwIjoxNzMxOTAzNjAwLCJ1aWQiOjIsInJvbGVzIjpbIkFETUlOIl19.xyz",
  "tokenType": "Bearer",
  "issuedAt": "2025-11-18T04:30:00Z",
  "userId": 2,
  "roles": ["ADMIN"]
}
```

### Step 3: Use Token for Protected Endpoints

**Copy the `accessToken` from login response and add to Authorization header:**

```http
GET http://localhost:8080/api/companies
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJ0eXAiOiJKV1QiLCJpc3MiOiJoZWxwZGVzay1hcGkiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTczMTkwMDAwMCwiZXhwIjoxNzMxOTAzNjAwLCJ1aWQiOjIsInJvbGVzIjpbIkFETUlOIl19.xyz
```

---

## 📋 Test Users

| Username | Password    | Role   | Access Level          |
|----------|-------------|--------|-----------------------|
| system   | system123   | SYSTEM | Full access           |
| admin    | admin123    | ADMIN  | Full access           |
| user     | user123     | USER   | Tickets only          |
| viewer   | viewer123   | VIEWER | Read-only             |

---

## 🔐 Role-Based Access

### ADMIN & SYSTEM Roles
✅ Full access to all endpoints:
- Companies, Projects, Categories, Subcategories
- Statuses, Priorities, Service Types
- Escalation Matrices, Departments, Roles, Menus
- Users, Tickets

### USER Role
✅ Access to:
- Tickets (create, read, update)

❌ No access to:
- Admin endpoints (companies, users, etc.)

### VIEWER Role
✅ Access to:
- Read-only operations (if implemented)

❌ No access to:
- Create, Update, Delete operations

---

## 📂 Key Files Created

### 1. **JwtTokenProvider.java**
Location: `config/security/JwtTokenProvider.java`
Purpose: Creates and validates JWT tokens

### 2. **JwtAuthenticationFilter.java**
Location: `config/security/JwtAuthenticationFilter.java`
Purpose: Intercepts requests and validates tokens

### 3. **SecurityConfig.java**
Location: `config/SecurityConfig.java`
Purpose: Defines access rules and role permissions

### 4. **AuthController.java**
Location: `controller/AuthController.java`
Purpose: Handles login endpoint

### 5. **SecurityUtil.java** (Helper Class)
Location: `util/SecurityUtil.java`
Purpose: Get current user info in controllers

**Usage Example:**
```java
@Autowired
private SecurityUtil securityUtil;

@GetMapping("/my-info")
public String getMyInfo() {
    Long userId = securityUtil.getCurrentUserId();
    String username = securityUtil.getCurrentUsername();
    boolean isAdmin = securityUtil.hasRole("ADMIN");
    
    return "User: " + username + ", ID: " + userId + ", Admin: " + isAdmin;
}
```

### 6. **DataInitializer.java**
Location: `config/DataInitializer.java`
Purpose: Creates test users on application startup

---

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Select file: `Helpdesk_JWT_Postman_Collection.json`
4. Collection will be imported with all test cases

### Test Flow
1. **Login** (choose role: admin/user/system)
2. **Copy token** from response
3. **Update variable** `{{admin_token}}` or `{{user_token}}` in Postman
4. **Test protected endpoints** with Authorization header

---

## 🛠️ Configuration

**File:** `application.properties`

```properties
# JWT Settings
app.jwt.secret=change-this-dev-secret-please-make-32-bytes-min
app.jwt.issuer=helpdesk-api
app.jwt.access-ttl-seconds=3600  # 1 hour
```

**For Production:**
- Change `app.jwt.secret` to a strong random string (min 32 characters)
- Consider shorter TTL for better security
- Use environment variables instead of hardcoding

---

## 🔍 Common Use Cases

### Get Current User in Controller
```java
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final SecurityUtil securityUtil;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Long userId = securityUtil.getCurrentUserId();
        String username = securityUtil.getCurrentUsername();
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("username", username);
        
        return ResponseEntity.ok(response);
    }
}
```

### Check Role in Service
```java
@Service
@RequiredArgsConstructor
public class TicketService {
    
    private final SecurityUtil securityUtil;
    
    public void deleteTicket(Long ticketId) {
        if (!securityUtil.hasAnyRole("ADMIN", "SYSTEM")) {
            throw new ForbiddenException("Only admins can delete tickets");
        }
        // Delete logic...
    }
}
```

---

## 📊 Token Expiration

Default: **1 hour** (3600 seconds)

**What happens when token expires:**
- Server returns 401 Unauthorized
- User needs to login again
- Can implement refresh token for better UX (optional)

---

## 🐛 Troubleshooting

### Problem: 401 Unauthorized with valid token
**Solution:**
1. Check if token expired
2. Verify `Authorization: Bearer <token>` format (space after Bearer)
3. Ensure app.jwt.secret matches the one used to create token

### Problem: 403 Forbidden
**Solution:**
1. User doesn't have required role
2. Check SecurityConfig rules
3. Verify user's role in database

### Problem: No test users created
**Solution:**
1. Check console logs on startup
2. Verify database connection
3. DataInitializer runs only if no roles exist (delete roles table to re-run)

---

## 📖 Documentation Files

1. **JWT_AUTHENTICATION_GUIDE.md** - Complete guide with detailed explanations
2. **JWT_QUICK_REFERENCE.md** - This file (quick start)
3. **Helpdesk_JWT_Postman_Collection.json** - Postman test collection

---

## 🎯 Next Steps

1. ✅ Test login with all 4 users
2. ✅ Test protected endpoints with different roles
3. ✅ Try accessing admin endpoints with USER token (should fail)
4. ✅ Implement custom logic using SecurityUtil
5. ⬜ Add refresh token (optional)
6. ⬜ Implement token blacklist for logout (optional)
7. ⬜ Add rate limiting (optional)

---

## 💡 Pro Tips

1. **Store tokens securely**: Use HttpOnly cookies or secure storage in frontend
2. **Never log tokens**: They contain sensitive user data
3. **Decode tokens**: Use jwt.io to inspect token contents (dev only)
4. **Environment-specific secrets**: Different secrets for dev/staging/prod
5. **Monitor token usage**: Track invalid token attempts

---

**Need Help?** Check `JWT_AUTHENTICATION_GUIDE.md` for detailed explanations.

