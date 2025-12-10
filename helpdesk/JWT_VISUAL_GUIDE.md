# JWT Authentication Visual Guide

## 🎨 Complete Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JWT AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: USER LOGIN
═══════════════════
┌──────────┐                                    ┌────────────────┐
│          │  POST /api/auth/login              │                │
│  Client  │  { username, password }            │ AuthController │
│          │ ─────────────────────────────────> │                │
└──────────┘                                    └────────┬───────┘
                                                         │
                                                         ▼
                                                ┌────────────────┐
                                                │ 1. Find User   │
                                                │ 2. Check Active│
                                                │ 3. Verify Pass │
                                                └────────┬───────┘
                                                         │
                                                         ▼
                                                ┌────────────────┐
                                                │ JwtTokenProvider│
                                                │ generateToken() │
                                                └────────┬───────┘
                                                         │
                   ┌─────────────────────────────────────┘
                   │ Token Created: eyJhbGciOiJIUzUxMiJ9...
                   │ Contains: userId, username, roles
                   ▼
┌──────────┐  { accessToken, userId, roles }    ┌────────────────┐
│          │  <───────────────────────────────  │                │
│  Client  │                                    │ AuthController │
│  STORES  │                                    │                │
│  TOKEN   │                                    └────────────────┘
└──────────┘


STEP 2: ACCESSING PROTECTED ENDPOINT
═══════════════════════════════════
┌──────────┐                                    ┌────────────────────┐
│          │  GET /api/companies                │                    │
│  Client  │  Authorization: Bearer <token>     │ JwtAuthFilter      │
│          │ ─────────────────────────────────> │ (Intercepts All)   │
└──────────┘                                    └──────┬─────────────┘
                                                       │
                                                       ▼
                                              ┌────────────────────┐
                                              │ Extract Token      │
                                              │ from Authorization │
                                              │ header             │
                                              └──────┬─────────────┘
                                                     │
                                                     ▼
                                              ┌────────────────────┐
                                              │ JwtTokenProvider   │
                                              │ parseClaims()      │
                                              │ - Validates        │
                                              │ - Checks expiry    │
                                              │ - Verifies signature│
                                              └──────┬─────────────┘
                                                     │
                                   ┌─────────────────┴──────────────────┐
                                   │                                    │
                               ✅ VALID                            ❌ INVALID
                                   │                                    │
                                   ▼                                    ▼
                         ┌──────────────────┐              ┌─────────────────┐
                         │ Extract:         │              │ Clear Context   │
                         │ - username       │              │ Continue filter │
                         │ - userId         │              │ (401 returned)  │
                         │ - roles          │              └─────────────────┘
                         └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │ Create Auth      │
                         │ Set in Security  │
                         │ Context          │
                         └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │ Continue Filter  │
                         │ Chain            │
                         └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │ SecurityConfig   │
                         │ Check Role Rules │
                         └────┬─────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
          ✅ ALLOWED                    ❌ FORBIDDEN
                │                            │
                ▼                            ▼
       ┌─────────────────┐         ┌──────────────────┐
       │ Controller      │         │ Return 403       │
       │ Process Request │         │ Access Denied    │
       └────┬────────────┘         └──────────────────┘
            │
            ▼
       ┌─────────────────┐
       │ Service Layer   │
       │ Business Logic  │
       └────┬────────────┘
            │
            ▼
       ┌─────────────────┐
       │ Repository      │
       │ Database Query  │
       └────┬────────────┘
            │
            ▼
┌──────────┐                       
│          │  Response with Data   
│  Client  │  <──────────────────  
│          │                       
└──────────┘                       


STEP 3: USING SECURITYUTIL IN CODE
═══════════════════════════════════
┌──────────────────────────────────────────────────────────────────┐
│                         Controller/Service                       │
│                                                                  │
│  @Autowired                                                      │
│  private SecurityUtil securityUtil;                              │
│                                                                  │
│  public void createTicket() {                                    │
│      Long userId = securityUtil.getCurrentUserId();  ◄───┐      │
│      String username = securityUtil.getCurrentUsername();│      │
│      boolean isAdmin = securityUtil.hasRole("ADMIN");    │      │
│                                                          │      │
│      // Use the data...                                  │      │
│  }                                                       │      │
└──────────────────────────────────────────────────────────┼──────┘
                                                           │
                                    ┌──────────────────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │ SecurityContext│
                            │ (Set by Filter)│
                            └────────────────┘


TOKEN STRUCTURE
═══════════════
┌────────────────────────────────────────────────────────────────┐
│  JWT Token: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG...signature   │
│             └─────┬──────┘ └──────┬──────┘ └────┬────┘        │
│                HEADER         PAYLOAD        SIGNATURE         │
└────────────────────────────────────────────────────────────────┘

┌─────────────┐   ┌──────────────────────────┐   ┌──────────────┐
│   HEADER    │   │        PAYLOAD           │   │  SIGNATURE   │
├─────────────┤   ├──────────────────────────┤   ├──────────────┤
│ {           │   │ {                        │   │ HMACSHA512(  │
│  "alg":     │   │  "iss": "helpdesk-api",  │   │   header +   │
│   "HS512",  │   │  "sub": "admin",         │   │   payload,   │
│  "typ":     │   │  "iat": 1731900000,      │   │   secret     │
│   "JWT"     │   │  "exp": 1731903600,      │   │ )            │
│ }           │   │  "uid": 2,               │   │              │
│             │   │  "roles": ["ADMIN"]      │   │              │
│             │   │ }                        │   │              │
└─────────────┘   └──────────────────────────┘   └──────────────┘
     │                      │                           │
     │                      │                           │
     └──────────────────────┴───────────────────────────┘
                            │
                   Base64 URL Encoded
                            │
                            ▼
            Final JWT Token sent to client


ROLE-BASED ACCESS MATRIX
═════════════════════════
┌──────────────────────────────────────────────────────────────────┐
│                    Endpoint Access Rules                         │
├──────────────────────────┬───────┬────────┬──────┬────────────┤
│ Endpoint                 │ ADMIN │ SYSTEM │ USER │ VIEWER     │
├──────────────────────────┼───────┼────────┼──────┼────────────┤
│ /api/auth/login          │  ✅   │   ✅   │  ✅  │    ✅      │
│ /api/companies/**        │  ✅   │   ✅   │  ❌  │    ❌      │
│ /api/projects/**         │  ✅   │   ✅   │  ❌  │    ❌      │
│ /api/users/**            │  ✅   │   ✅   │  ❌  │    ❌      │
│ /api/tickets/**          │  ✅   │   ✅   │  ✅  │    ❌      │
└──────────────────────────┴───────┴────────┴──────┴────────────┘


ERROR SCENARIOS
═══════════════
┌─────────────────────────────────────────────────────────────────┐
│ Scenario 1: No Token Provided                                  │
│ ───────────────────────────────────────────────────────────────│
│ Request: GET /api/companies (no Authorization header)          │
│ Filter: ❌ No token found → SecurityContext empty              │
│ SecurityConfig: ❌ Not authenticated                           │
│ Response: 401 Unauthorized                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Scenario 2: Invalid/Expired Token                              │
│ ───────────────────────────────────────────────────────────────│
│ Request: GET /api/companies (with expired token)               │
│ Filter: ❌ Token validation fails → Clear context              │
│ SecurityConfig: ❌ Not authenticated                           │
│ Response: 401 Unauthorized                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Scenario 3: Valid Token, Wrong Role                            │
│ ───────────────────────────────────────────────────────────────│
│ Request: GET /api/companies (USER role token)                  │
│ Filter: ✅ Token valid → Set authentication (ROLE_USER)        │
│ SecurityConfig: ❌ USER role not allowed for /api/companies    │
│ Response: 403 Forbidden                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Scenario 4: Valid Token, Correct Role                          │
│ ───────────────────────────────────────────────────────────────│
│ Request: GET /api/companies (ADMIN role token)                 │
│ Filter: ✅ Token valid → Set authentication (ROLE_ADMIN)       │
│ SecurityConfig: ✅ ADMIN role allowed for /api/companies       │
│ Controller: ✅ Process request                                 │
│ Response: 200 OK with data                                     │
└─────────────────────────────────────────────────────────────────┘


KEY CLASSES RESPONSIBILITY
═══════════════════════════
┌────────────────────────────────────────────────────────────────┐
│ JwtTokenProvider                                               │
│ ├─ generateToken() → Creates JWT with user info & roles       │
│ ├─ parseClaims() → Validates and decodes JWT                  │
│ ├─ getUserId() → Extracts user ID from token                  │
│ └─ getRoles() → Extracts roles from token                     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ JwtAuthenticationFilter                                        │
│ ├─ Intercepts every request                                   │
│ ├─ Extracts Bearer token from Authorization header            │
│ ├─ Validates token using JwtTokenProvider                     │
│ ├─ Sets authentication in SecurityContext                     │
│ └─ Continues filter chain                                     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SecurityConfig                                                 │
│ ├─ Defines public endpoints (no auth needed)                  │
│ ├─ Defines protected endpoints (role-based)                   │
│ ├─ Configures stateless session                              │
│ ├─ Adds JWT filter to security chain                         │
│ └─ Provides BCrypt password encoder                          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ AuthController                                                 │
│ ├─ Handles POST /api/auth/login                              │
│ ├─ Validates credentials                                      │
│ ├─ Generates JWT token                                        │
│ └─ Returns token with user info                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SecurityUtil (Helper)                                          │
│ ├─ getCurrentUserId() → Get authenticated user's ID           │
│ ├─ getCurrentUsername() → Get authenticated username          │
│ ├─ hasRole() → Check if user has specific role               │
│ ├─ hasAnyRole() → Check if user has any of given roles       │
│ └─ isAuthenticated() → Check if user is logged in            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ DataInitializer                                                │
│ ├─ Runs on application startup                                │
│ ├─ Creates default roles (ADMIN, SYSTEM, USER, VIEWER)        │
│ ├─ Creates test users for each role                           │
│ └─ Creates default company and department                     │
└────────────────────────────────────────────────────────────────┘


REMEMBER:
═════════
✅ Token is stateless - server doesn't store it
✅ Token expires after 1 hour (configurable)
✅ Always send token in "Authorization: Bearer <token>" header
✅ Roles are checked on every request
✅ Use SecurityUtil to get current user in your code
✅ Test with different roles to verify access control
```

