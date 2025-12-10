# Software Requirements Specification
## Helpdesk - Customer Care Ticketing System

**Version:** 1.0  
**Date:** November 20, 2024  
**Project:** Helpdesk Frontend Application

---

## System Design

### Overview
Helpdesk is a role-based customer care ticketing system that enables users to create, manage, and track support tickets with dynamic permission management and escalation routing.

### Core Features
- Role-based access control (Admin, Employee, User/Client)
- Ticket lifecycle management with status tracking
- Multi-entity relationship management (Companies → Projects → Categories → Subcategories)
- SLA tracking with response/resolution time monitoring
- Escalation matrix with PRE/POST resolution time alerts
- Real-time permission-based UI rendering
- Comprehensive entity management interfaces

### User Roles & Permissions

**System Administrator:**
- Full system access
- User, role, and permission management
- All entity CRUD operations (Companies, Projects, Departments, Categories, etc.)
- Escalation matrix configuration
- System settings management

**Employee:**
- View all tickets system-wide
- Create and manage tickets
- Access assigned tickets
- View companies, projects, categories
- Limited administrative functions

**User/Client:**
- View own tickets only
- Create new tickets
- Update own tickets (limited fields)
- No administrative access

---

## Architecture Pattern

### Pattern: Layered Architecture with Feature-Based Modules

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Next.js Pages/Components + shadcn/ui + Tailwind CSS) │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Application Layer                      │
│         (React Context + Custom Hooks + Utils)          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Service Layer                          │
│        (API Services + Axios Interceptors + DTOs)       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Integration Layer                      │
│              (Spring Boot REST API Backend)             │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth route group
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── roles/
│   │   ├── companies/
│   │   ├── projects/
│   │   ├── departments/
│   │   ├── categories/
│   │   ├── subcategories/
│   │   ├── statuses/
│   │   ├── priorities/
│   │   ├── service-types/
│   │   ├── escalation-matrix/
│   │   └── settings/
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   ├── FloatingActionButton.tsx
│   │   └── MobileNav.tsx
│   ├── tickets/
│   │   ├── TicketCard.tsx
│   │   ├── TicketList.tsx
│   │   ├── TicketDetailPanel.tsx
│   │   ├── TicketForm.tsx
│   │   └── TicketFilters.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   ├── UserForm.tsx
│   │   └── UserDetailPanel.tsx
│   ├── common/
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ConfirmationModal.tsx
│   └── forms/
│       ├── FormField.tsx
│       ├── FormSelect.tsx
│       ├── FormTextarea.tsx
│       └── FormCheckbox.tsx
├── contexts/
│   ├── AuthContext.tsx           # Authentication state
│   ├── UserContext.tsx           # Current user data
│   └── PermissionContext.tsx     # Role-based permissions
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   ├── useTickets.ts
│   ├── useUsers.ts
│   ├── usePagination.ts
│   ├── useDebounce.ts
│   └── useToast.ts
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios instance
│   │   ├── auth.service.ts
│   │   ├── ticket.service.ts
│   │   ├── user.service.ts
│   │   ├── company.service.ts
│   │   ├── project.service.ts
│   │   ├── category.service.ts
│   │   ├── subcategory.service.ts
│   │   ├── status.service.ts
│   │   ├── priority.service.ts
│   │   ├── service-type.service.ts
│   │   ├── escalation.service.ts
│   │   └── department.service.ts
│   ├── utils/
│   │   ├── cn.ts                 # Class name utility
│   │   ├── format.ts             # Date/time formatting
│   │   ├── validation.ts         # Validation helpers
│   │   └── constants.ts          # App constants
│   └── schemas/
│       ├── auth.schema.ts
│       ├── ticket.schema.ts
│       ├── user.schema.ts
│       └── ...
├── types/
│   ├── api.types.ts              # API response types
│   ├── ticket.types.ts
│   ├── user.types.ts
│   ├── role.types.ts
│   └── ...
└── middleware.ts                 # Next.js middleware for auth
```

### Design Principles

**1. Separation of Concerns**
- UI components are presentation-only
- Business logic in custom hooks
- API calls isolated in service layer
- Type definitions centralized

**2. Component Composition**
- Small, reusable components
- Feature-based organization
- Shared UI components in `/components/ui`
- Domain-specific components in feature folders

**3. Type Safety**
- TypeScript for all code
- Zod schemas for runtime validation
- API response types from backend models
- Strict type checking enabled

**4. Performance Optimization**
- Server Components by default
- Client Components only when needed (use "use client")
- Code splitting by route
- Image optimization with Next.js Image
- Debounced search and filters

---

## State Management

### React Context Architecture

**1. AuthContext**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
```

**Purpose:**
- Manage authentication state
- Store JWT token
- Handle login/logout
- Persist session to localStorage

**2. UserContext**
```typescript
interface UserContextType {
  currentUser: UserDetails | null;
  permissions: string[];
  role: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
}
```

**Purpose:**
- Store current user details
- Manage role-based permissions
- Provide permission checking utilities
- Control UI element visibility

**3. ThemeContext (Optional)**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Custom Hooks for Business Logic

**useAuth Hook**
```typescript
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**usePermissions Hook**
```typescript
const usePermissions = () => {
  const { permissions, hasPermission, hasAnyPermission } = useContext(UserContext);
  return { permissions, hasPermission, hasAnyPermission };
};
```

**useTickets Hook**
```typescript
const useTickets = (filters?: TicketFilters) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationState>();

  const fetchTickets = useCallback(async () => {
    // Fetch logic
  }, [filters]);

  return { tickets, loading, error, pagination, fetchTickets, refetch };
};
```

### State Management Strategy

**Local State:** useState for component-specific state
**Shared State:** React Context for auth, user, permissions
**Server State:** Custom hooks with useEffect for API data
**Form State:** React Hook Form for all forms
**Cache Strategy:** Context + localStorage for auth token

---

## Data Flow

### Authentication Flow

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ 1. User enters credentials
       ▼
┌─────────────────────┐
│ AuthContext.login() │
└──────┬──────────────┘
       │ 2. API call to /api/auth/login
       ▼
┌──────────────────┐
│ Backend API      │
└──────┬───────────┘
       │ 3. Returns JWT token + user data
       ▼
┌────────────────────────┐
│ Store in AuthContext   │
│ + localStorage         │
└──────┬─────────────────┘
       │ 4. Set user state
       ▼
┌────────────────────────┐
│ Redirect to /dashboard │
└────────────────────────┘
```

### Ticket Creation Flow

```
┌──────────────────┐
│ Create Ticket UI │
└────────┬─────────┘
         │ 1. User fills form
         ▼
┌─────────────────────────┐
│ React Hook Form         │
│ + Zod Validation        │
└────────┬────────────────┘
         │ 2. Validate on submit
         ▼
┌─────────────────────────┐
│ ticketService.create()  │
└────────┬────────────────┘
         │ 3. POST /api/tickets
         ▼
┌─────────────────────────┐
│ Backend processes       │
│ Creates ticket in DB    │
└────────┬────────────────┘
         │ 4. Returns created ticket
         ▼
┌─────────────────────────┐
│ Update local state      │
│ Show success toast      │
│ Redirect to ticket list │
└─────────────────────────┘
```

### Data Fetching Pattern

```
Component Mount
    │
    ▼
useEffect Hook
    │
    ▼
Custom Hook (e.g., useTickets)
    │
    ▼
API Service (e.g., ticketService.getAll)
    │
    ▼
Axios Instance (with interceptors)
    │
    ├── Add JWT token
    ├── Handle errors
    └── Transform response
    │
    ▼
Backend API
    │
    ▼
Response
    │
    ├── Success: Update state, render UI
    └── Error: Show error toast, handle accordingly
```

### Permission-Based Rendering Flow

```
Component Render
    │
    ▼
usePermissions() hook
    │
    ▼
Check: hasPermission('VIEW_USERS')
    │
    ├── TRUE: Render component
    └── FALSE: Render null or redirect
```

---

## Technical Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **UI Library** | React | 19.x | Component-based UI |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Component Library** | shadcn/ui | Latest | Accessible UI components |
| **Icons** | Lucide React | Latest | Icon library |
| **State Management** | React Context | Built-in | Global state management |
| **Form Handling** | React Hook Form | 7.x | Performant form management |
| **Validation** | Zod | 3.x | Schema validation |
| **HTTP Client** | Axios | 1.x | API requests |
| **Date Handling** | date-fns | 3.x | Date formatting and manipulation |
| **Notifications** | Sonner | Latest | Toast notifications |
| **Code Quality** | ESLint + Prettier | Latest | Linting and formatting |

### Development Tools

- **Package Manager:** npm or pnpm
- **Version Control:** Git
- **IDE:** VS Code (recommended)
- **Browser DevTools:** React DevTools, Redux DevTools (if needed)

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "latest",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "sonner": "^1.3.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## Authentication Process

### Implementation Steps

**1. JWT Token Storage**
```typescript
// Store token on login
localStorage.setItem('helpdesk_token', token);
localStorage.setItem('helpdesk_user', JSON.stringify(userData));

// Retrieve on app load
const token = localStorage.getItem('helpdesk_token');
const user = JSON.parse(localStorage.getItem('helpdesk_user') || 'null');
```

**2. Axios Interceptor Setup**
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('helpdesk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('helpdesk_token');
      localStorage.removeItem('helpdesk_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**3. AuthContext Implementation**
```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/api/auth.service';
import { User } from '@/types/user.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stored auth data on mount
    const storedToken = localStorage.getItem('helpdesk_token');
    const storedUser = localStorage.getItem('helpdesk_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    const { token, userId, username: userName, roleName } = response.data;
    
    localStorage.setItem('helpdesk_token', token);
    localStorage.setItem('helpdesk_user', JSON.stringify({ userId, userName, roleName }));
    
    setToken(token);
    setUser({ userId, userName, roleName });
  };

  const logout = () => {
    localStorage.removeItem('helpdesk_token');
    localStorage.removeItem('helpdesk_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token, 
        isLoading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**4. Protected Route Middleware**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('helpdesk_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**5. Login Flow**
```typescript
// app/(auth)/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      await login(data.username, data.password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Session Management

- **Token Expiry:** 1 hour (3600 seconds)
- **Refresh Strategy:** Redirect to login on 401 response
- **Logout:** Clear localStorage and redirect to login
- **Remember Me:** Optional extended session (implement if needed)

---

## Route Design

### App Router Structure

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home/landing page (redirect to login or dashboard)
│
├── (auth)/                       # Auth route group (no sidebar)
│   ├── layout.tsx                # Minimal layout
│   └── login/
│       └── page.tsx              # /login
│
├── (dashboard)/                  # Protected routes (with sidebar)
│   ├── layout.tsx                # Dashboard layout with Sidebar + TopNav
│   ├── dashboard/
│   │   └── page.tsx              # /dashboard
│   │
│   ├── tickets/
│   │   ├── page.tsx              # /tickets (list view)
│   │   ├── create/
│   │   │   └── page.tsx          # /tickets/create
│   │   ├── [id]/
│   │   │   └── page.tsx          # /tickets/[id] (detail view)
│   │   └── my-tickets/
│   │       └── page.tsx          # /tickets/my-tickets
│   │
│   ├── users/
│   │   ├── page.tsx              # /users (Admin only)
│   │   ├── create/
│   │   │   └── page.tsx          # /users/create
│   │   └── [id]/
│   │       └── page.tsx          # /users/[id]
│   │
│   ├── roles/
│   │   ├── page.tsx              # /roles (Admin only)
│   │   └── [id]/
│   │       └── page.tsx          # /roles/[id]
│   │
│   ├── companies/
│   │   ├── page.tsx              # /companies
│   │   ├── create/
│   │   │   └── page.tsx          # /companies/create
│   │   └── [id]/
│   │       └── page.tsx          # /companies/[id]
│   │
│   ├── projects/
│   │   ├── page.tsx              # /projects
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── departments/
│   │   ├── page.tsx              # /departments (Admin only)
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── categories/
│   │   ├── page.tsx              # /categories
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── subcategories/
│   │   ├── page.tsx              # /subcategories
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── statuses/
│   │   ├── page.tsx              # /statuses (Admin only)
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── priorities/
│   │   ├── page.tsx              # /priorities (Admin only)
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── service-types/
│   │   ├── page.tsx              # /service-types (Admin only)
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── escalation-matrix/
│   │   └── page.tsx              # /escalation-matrix (Admin/Employee)
│   │
│   └── settings/
│       └── page.tsx              # /settings (Admin only)
│
└── api/                          # API routes (optional, for server-side operations)
    └── ...
```

### Route Guards by Role

| Route | Admin | Employee | Client |
|-------|-------|----------|--------|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/tickets` | ✅ | ✅ | ❌ |
| `/tickets/my-tickets` | ✅ | ✅ | ✅ |
| `/tickets/create` | ✅ | ✅ | ✅ |
| `/tickets/[id]` | ✅ | ✅ | ✅ (own only) |
| `/users` | ✅ | ❌ | ❌ |
| `/roles` | ✅ | ❌ | ❌ |
| `/companies` | ✅ | ✅ | ❌ |
| `/projects` | ✅ | ✅ | ❌ |
| `/departments` | ✅ | ❌ | ❌ |
| `/categories` | ✅ | ✅ | ✅ |
| `/subcategories` | ✅ | ✅ | ✅ |
| `/statuses` | ✅ | ❌ | ❌ |
| `/priorities` | ✅ | ❌ | ❌ |
| `/service-types` | ✅ | ❌ | ❌ |
| `/escalation-matrix` | ✅ | ✅ | ❌ |
| `/settings` | ✅ | ❌ | ❌ |

### Navigation Implementation

**Sidebar Menu (Role-Based)**
```typescript
// components/layout/Sidebar.tsx
const menuItems = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: Home, 
    roles: ['Admin', 'Employee', 'Client'] 
  },
  { 
    label: 'All Tickets', 
    href: '/tickets', 
    icon: Ticket, 
    roles: ['Admin', 'Employee'] 
  },
  { 
    label: 'My Tickets', 
    href: '/tickets/my-tickets', 
    icon: UserCheck, 
    roles: ['Admin', 'Employee', 'Client'] 
  },
  { 
    label: 'Users', 
    href: '/users', 
    icon: Users, 
    roles: ['Admin'] 
  },
  // ... more items
];

// Filter based on user role
const visibleMenuItems = menuItems.filter(item => 
  item.roles.includes(currentUser.role)
);
```

---

## API Design

### Service Layer Architecture

Each entity has a dedicated service file with CRUD operations and specialized endpoints.

### Base API Client

```typescript
// lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('helpdesk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('helpdesk_token');
      localStorage.removeItem('helpdesk_user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Files Structure

**1. Auth Service**
```typescript
// lib/api/auth.service.ts
import apiClient from './client';
import { LoginRequest, LoginResponse } from '@/types/api.types';

export const authService = {
  login: (username: string, password: string) => 
    apiClient.post<LoginResponse>('/auth/login', { username, password }),
  
  logout: () => {
    localStorage.removeItem('helpdesk_token');
    localStorage.removeItem('helpdesk_user');
  },
};
```

**2. Ticket Service**
```typescript
// lib/api/ticket.service.ts
import apiClient from './client';
import { 
  Ticket, 
  TicketCreateDTO, 
  TicketUpdateDTO, 
  PaginatedResponse 
} from '@/types/api.types';

interface TicketFilters {
  name?: string;
  companyId?: number;
  categoryId?: number;
  subcategoryId?: number;
  currentStatusId?: number;
  priorityId?: number;
  serviceTypeId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const ticketService = {
  getAll: (filters?: TicketFilters) => 
    apiClient.get<PaginatedResponse<Ticket>>('/tickets', { params: filters }),
  
  getById: (id: number) => 
    apiClient.get<Ticket>(`/tickets/${id}`),
  
  getUserTickets: (userId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<Ticket>>(`/tickets/user/${userId}`, { params }),
  
  create: (data: TicketCreateDTO) => 
    apiClient.post<Ticket>('/tickets', data),
  
  update: (id: number, data: TicketUpdateDTO) => 
    apiClient.put<Ticket>(`/tickets/${id}`, data),
  
  activate: (id: number) => 
    apiClient.patch<Ticket>(`/tickets/${id}/activate`),
  
  deactivate: (id: number) => 
    apiClient.patch<Ticket>(`/tickets/${id}/deactivate`),
  
  delete: (id: number) => 
    apiClient.delete(`/tickets/${id}`),
};
```

**3. User Service**
```typescript
// lib/api/user.service.ts
import apiClient from './client';
import { User, UserCreateDTO, UserUpdateDTO, PaginatedResponse } from '@/types/api.types';

interface UserFilters {
  name?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const userService = {
  getAll: (filters?: UserFilters) => 
    apiClient.get<PaginatedResponse<User>>('/users', { params: filters }),
  
  getById: (id: number) => 
    apiClient.get<User>(`/users/${id}`),
  
  getByUsername: (username: string) => 
    apiClient.get<User>(`/users/username/${username}`),
  
  getByCompany: (companyId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<User>>(`/users/company/${companyId}`, { params }),
  
  getByProject: (projectId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<User>>(`/users/project/${projectId}`, { params }),
  
  getByDepartment: (departmentId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<User>>(`/users/department/${departmentId}`, { params }),
  
  getByRole: (roleId: number, params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<User>>(`/users/role/${roleId}`, { params }),
  
  create: (data: UserCreateDTO) => 
    apiClient.post<User>('/users', data),
  
  update: (id: number, data: UserUpdateDTO) => 
    apiClient.put<User>(`/users/${id}`, data),
  
  activate: (id: number) => 
    apiClient.patch<User>(`/users/${id}/activate`),
  
  deactivate: (id: number) => 
    apiClient.patch<User>(`/users/${id}/deactivate`),
  
  delete: (id: number) => 
    apiClient.delete(`/users/${id}`),
};
```

**4. Company Service**
```typescript
// lib/api/company.service.ts
import apiClient from './client';
import { Company, CompanyCreateDTO, PaginatedResponse } from '@/types/api.types';

export const companyService = {
  getAll: (params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<Company>>('/companies', { params }),
  
  getById: (id: number) => 
    apiClient.get<Company>(`/companies/${id}`),
  
  create: (data: CompanyCreateDTO) => 
    apiClient.post<Company>('/companies', data),
  
  update: (id: number, data: CompanyCreateDTO) => 
    apiClient.put<Company>(`/companies/${id}`, data),
  
  activate: (id: number) => 
    apiClient.patch<Company>(`/companies/${id}/activate`),
  
  deactivate: (id: number) => 
    apiClient.patch<Company>(`/companies/${id}/deactivate`),
  
  delete: (id: number) => 
    apiClient.delete(`/companies/${id}`),
};
```

**5. Category & Subcategory Services**
```typescript
// lib/api/category.service.ts
import apiClient from './client';
import { Category, CategoryCreateDTO, PaginatedResponse } from '@/types/api.types';

export const categoryService = {
  getAll: (params?: { projectId?: number; page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<Category>>('/categories', { params }),
  
  getById: (id: number) => 
    apiClient.get<Category>(`/categories/${id}`),
  
  create: (data: CategoryCreateDTO) => 
    apiClient.post<Category>('/categories', data),
  
  update: (id: number, data: CategoryCreateDTO) => 
    apiClient.put<Category>(`/categories/${id}`, data),
  
  activate: (id: number) => 
    apiClient.patch<Category>(`/categories/${id}/activate`),
  
  deactivate: (id: number) => 
    apiClient.patch<Category>(`/categories/${id}/deactivate`),
  
  delete: (id: number) => 
    apiClient.delete(`/categories/${id}`),
};

// lib/api/subcategory.service.ts
import apiClient from './client';
import { Subcategory, SubcategoryCreateDTO, PaginatedResponse } from '@/types/api.types';

export const subcategoryService = {
  getAll: (params?: { categoryId?: number; page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<Subcategory>>('/subcategories', { params }),
  
  getById: (id: number) => 
    apiClient.get<Subcategory>(`/subcategories/${id}`),
  
  create: (data: SubcategoryCreateDTO) => 
    apiClient.post<Subcategory>('/subcategories', data),
  
  update: (id: number, data: SubcategoryCreateDTO) => 
    apiClient.put<Subcategory>(`/subcategories/${id}`, data),
  
  activate: (id: number) => 
    apiClient.patch<Subcategory>(`/subcategories/${id}/activate`),
  
  deactivate: (id: number) => 
    apiClient.patch<Subcategory>(`/subcategories/${id}/deactivate`),
  
  requireCustomerResponse: (id: number) => 
    apiClient.patch<Subcategory>(`/subcategories/${id}/require-customer-response`),
  
  noCustomerResponse: (id: number) => 
    apiClient.patch<Subcategory>(`/subcategories/${id}/no-customer-response`),
  
  delete: (id: number) => 
    apiClient.delete(`/subcategories/${id}`),
};
```

**6. Escalation Matrix Service**
```typescript
// lib/api/escalation.service.ts
import apiClient from './client';
import { 
  EscalationMatrix, 
  EscalationMatrixCreateDTO, 
  PaginatedResponse 
} from '@/types/api.types';

export const escalationService = {
  getAll: (params?: { page?: number; size?: number }) => 
    apiClient.get<PaginatedResponse<EscalationMatrix>>('/escalation-matrices', { params }),
  
  getById: (id: number) => 
    apiClient.get<EscalationMatrix>(`/escalation-matrices/${id}`),
  
  getBySubcategoryAndType: (subcategoryId: number, type: 'PRE' | 'POST') => 
    apiClient.get<EscalationMatrix[]>(`/escalation-matrices/subcategory/${subcategoryId}/type/${type}`),
  
  create: (data: EscalationMatrixCreateDTO) => 
    apiClient.post<EscalationMatrix>('/escalation-matrices', data),
  
  update: (id: number, data: EscalationMatrixCreateDTO) => 
    apiClient.put<EscalationMatrix>(`/escalation-matrices/${id}`, data),
  
  delete: (id: number) => 
    apiClient.delete(`/escalation-matrices/${id}`),
};
```

### API Response Types

```typescript
// types/api.types.ts

// Common pagination response
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  roleName: string;
}

// User types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  companyId: number;
  companyName: string;
  projectId?: number;
  projectName?: string;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
  createdUserId: number;
  createdTime: string;
  updatedByUserId?: number;
  updatedTime?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface UserCreateDTO {
  name: string;
  username: string;
  password: string;
  email?: string;
  companyId: number;
  projectId?: number;
  departmentId: number;
  roleId: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UserUpdateDTO {
  name: string;
  username: string;
  password?: string; // Optional for updates
  email?: string;
  companyId: number;
  projectId?: number;
  departmentId: number;
  roleId: number;
  sortOrder?: number;
  isActive?: boolean;
}

// Ticket types
export interface Ticket {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  subcategoryId: number;
  subcategoryName: string;
  submittedStatusId: number;
  submittedStatusName: string;
  currentStatusId: number;
  currentStatusName: string;
  priorityId: number;
  priorityName: string;
  serviceTypeId: number;
  serviceTypeName: string;
  createdUserId: number;
  createdTime: string;
  updatedByUserId?: number;
  updatedTime?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TicketCreateDTO {
  name: string;
  description?: string;
  companyId: number;
  categoryId: number;
  subcategoryId: number;
  statusId: number; // Used for both submitted and current status
  priorityId: number;
  serviceTypeId: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface TicketUpdateDTO {
  name: string;
  description?: string;
  companyId: number;
  categoryId: number;
  subcategoryId: number;
  statusId: number;
  priorityId: number;
  serviceTypeId: number;
  sortOrder?: number;
  isActive?: boolean;
}

// Entity types (Company, Department, etc.)
export interface Company {
  id: number;
  name: string;
  createdUserId: number;
  createdTime: string;
  updatedByUserId?: number;
  updatedTime?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CompanyCreateDTO {
  name: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Similar interfaces for Department, Project, Category, Subcategory, Status, Priority, ServiceType, EscalationMatrix
// ... (follow the same pattern)
```

### Error Handling Pattern

```typescript
// Example usage in components
const handleCreateTicket = async (data: TicketCreateDTO) => {
  try {
    setLoading(true);
    const response = await ticketService.create(data);
    toast.success('Ticket created successfully!');
    router.push(`/tickets/${response.data.id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to create ticket';
      toast.error(message);
    } else {
      toast.error('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Database Design ERD

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│    COMPANIES     │
├──────────────────┤
│ PK id            │
│    name          │
│    createdUserId │
│    createdTime   │
│    updatedBy     │
│    updatedTime   │
│    sortOrder     │
│    isActive      │
└────────┬─────────┘
         │
         │ 1:N
         │
    ┌────▼─────────┐         ┌──────────────────┐
    │   PROJECTS   │         │      USERS       │
    ├──────────────┤         ├──────────────────┤
    │ PK id        │         │ PK id            │
    │    name      │         │    name          │
    │ FK companyId │◄────┐   │    username      │
    │    ...       │     │   │    password      │
    └────┬─────────┘     │   │    email         │
         │               │   │ FK companyId     │──┐
         │ 1:N           └───│ FK projectId     │  │
         │                   │ FK departmentId  │  │
    ┌────▼──────────┐        │ FK roleId        │  │
    │  CATEGORIES   │        │    ...           │  │
    ├───────────────┤        └──────────────────┘  │
    │ PK id         │                │              │
    │    name       │                │              │
    │ FK projectId  │                │ 1:N          │
    │    ...        │                │              │
    └────┬──────────┘           ┌────▼──────────┐  │
         │                      │    TICKETS    │  │
         │ 1:N                  ├───────────────┤  │
         │                      │ PK id         │  │
    ┌────▼─────────────────┐   │    name       │  │
    │   SUBCATEGORIES      │   │    description│  │
    ├──────────────────────┤   │ FK companyId  │◄─┘
    │ PK id                │   │ FK categoryId │◄──┐
    │    name              │   │ FK subcatId   │◄──┼─┐
    │ FK categoryId        │   │ FK submitStat │   │ │
    │    responseTime      │   │ FK currentStat│   │ │
    │    resolutionTime    │   │ FK priorityId │   │ │
    │    isCustomerResp    │   │ FK serviceType│   │ │
    │    ...               │   │ FK createdUser│   │ │
    └────┬─────────────────┘   │    ...        │   │ │
         │                     └───────────────┘   │ │
         │ 1:N                                     │ │
         │                                         │ │
    ┌────▼──────────────────┐                     │ │
    │ ESCALATION_MATRICES   │                     │ │
    ├───────────────────────┤                     │ │
    │ PK id                 │                     │ │
    │ FK subcategoryId      │─────────────────────┘ │
    │    type (PRE/POST)    │                       │
    │    from (minutes)     │                       │
    │    to (minutes)       │                       │
    │    email              │                       │
    │    ...                │                       │
    └───────────────────────┘                       │
                                                    │
┌──────────────────┐    ┌──────────────────┐      │
│   DEPARTMENTS    │    │      ROLES       │      │
├──────────────────┤    ├──────────────────┤      │
│ PK id            │    │ PK id            │      │
│    name          │    │    name          │      │
│    ...           │◄───│    description   │      │
└──────────────────┘    │    ...           │      │
         ▲              └─────┬────────────┘      │
         │                    │                    │
         │                    │ M:N                │
         │                    │                    │
         │              ┌─────▼────────────┐      │
         │              │   ROLE_MENUS     │      │
         │              ├──────────────────┤      │
         │              │ FK roleId        │      │
         │              │ FK menuId        │      │
         │              └──────────────────┘      │
         │                    │                    │
         │              ┌─────▼────────────┐      │
         │              │      MENUS       │      │
         │              ├──────────────────┤      │
         │              │ PK id            │      │
         │              │    name          │      │
         │              │    ...           │      │
         └──────────────┴──────────────────┘      │
                                                   │
┌──────────────────┐    ┌──────────────────┐     │
│     STATUSES     │    │   PRIORITY_LIST  │     │
├──────────────────┤    ├──────────────────┤     │
│ PK id            │    │ PK id            │     │
│    name          │◄───│    name          │◄────┤
│    sortOrder     │    │    sortOrder     │     │
│    ...           │    │    ...           │     │
└──────────────────┘    └──────────────────┘     │
                                                  │
┌──────────────────┐                             │
│  SERVICE_TYPES   │                             │
├──────────────────┤                             │
│ PK id            │                             │
│    name          │◄────────────────────────────┘
│    ...           │
└──────────────────┘
```

### Entity Descriptions

**COMPANIES**
- Root entity for organizational hierarchy
- Has many: Projects, Users, Tickets

**PROJECTS**
- Belongs to: Company (optional)
- Has many: Categories, Users

**CATEGORIES**
- Belongs to: Project
- Has many: Subcategories, Tickets

**SUBCATEGORIES**
- Belongs to: Category
- Has many: Tickets, Escalation Matrices
- Contains SLA configuration (responseTime, resolutionTime)

**USERS**
- Belongs to: Company, Department, Role
- Optionally belongs to: Project
- Has many: Tickets (as creator)

**TICKETS**
- Belongs to: Company, Category, Subcategory, Priority, ServiceType, Status (submitted and current), User (creator)
- Core entity tracking support requests

**DEPARTMENTS**
- Organizational units
- Has many: Users

**ROLES**
- Permission groups
- Has many: Users
- Many-to-many with: Menus (permissions)

**ESCALATION_MATRICES**
- Belongs to: Subcategory
- Defines email escalation rules based on time ranges
- Type: PRE (before resolution time) or POST (after resolution time)

**STATUSES**
- Workflow stages (New, Open, In Progress, Resolved, Closed, etc.)
- Used by: Tickets

**PRIORITY_LIST**
- Urgency levels (Low, Medium, High, Critical)
- Used by: Tickets

**SERVICE_TYPES**
- Request categories (Incident, Service Request, Change Request, Problem)
- Used by: Tickets

### Key Relationships

**1. Company → Projects → Categories → Subcategories**
- Hierarchical structure for ticket categorization

**2. User Associations**
- User must belong to: Company, Department, Role
- User may belong to: Project

**3. Ticket Relationships**
- Ticket has dual status: submittedStatus (immutable), currentStatus (mutable)
- Ticket belongs to complete categorization chain

**4. Escalation Rules**
- Subcategory has response/resolution time SLAs
- Escalation matrices define email alerts at specific time intervals

**5. Role-Based Permissions**
- Roles have many-to-many relationship with Menus
- Menus represent system permissions/features

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Setup & Configuration**
- Initialize Next.js 15 project with TypeScript
- Install dependencies (shadcn/ui, Tailwind, Axios, etc.)
- Configure ESLint and Prettier
- Setup folder structure
- Configure environment variables

**Authentication**
- Implement AuthContext
- Create login page with form validation
- Setup Axios interceptors
- Implement route protection middleware
- Create useAuth hook

**Layout Components**
- Build Sidebar component with role-based menu
- Create TopNav with breadcrumbs and user menu
- Implement responsive navigation
- Add FloatingActionButton

### Phase 2: Core Features (Week 3-4)

**Ticket Management**
- Ticket list view with filters
- Ticket detail panel
- Ticket creation form with cascading dropdowns
- Status change functionality
- My Tickets view

**Dashboard**
- Role-specific dashboard widgets
- Summary cards with metrics
- Recent activity list

### Phase 3: Entity Management (Week 5-6)

**Admin Interfaces**
- Users management (CRUD)
- Companies, Projects, Departments
- Categories and Subcategories
- Status, Priority, Service Type management

**Escalation Matrix**
- Subcategory selection
- PRE/POST escalation configuration
- Timeline visualization
- Email recipient management

### Phase 4: Polish & Optimization (Week 7-8)

**UI/UX Enhancements**
- Loading states and skeletons
- Error boundaries
- Toast notifications
- Empty states
- Confirmation modals

**Performance**
- Implement pagination
- Add search debouncing
- Optimize re-renders
- Code splitting

**Testing & Deployment**
- Unit tests for utilities
- Integration tests for API services
- End-to-end testing
- Production build optimization
- Deployment configuration

---

## Best Practices & Guidelines

### Code Quality

**1. TypeScript**
- Enable strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use type guards for runtime checks

**2. Component Structure**
```typescript
// Good component structure
'use client'; // Only if needed

import { useState, useEffect } from 'react';
import { SomeType } from '@/types';
import { someService } from '@/lib/api';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {
    // logic
  }, []);
  
  // 3. Event handlers
  const handleClick = () => {
    // logic
  };
  
  // 4. Render helpers
  const renderItem = () => {
    // logic
  };
  
  // 5. Return JSX
  return (
    <div>
      {/* content */}
    </div>
  );
}
```

**3. Naming Conventions**
- Components: PascalCase (e.g., `TicketCard`)
- Files: kebab-case for utils, PascalCase for components
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Interfaces: PascalCase with descriptive names (e.g., `UserCreateDTO`)

**4. File Organization**
- Group related files in feature folders
- Keep components small and focused
- Extract reusable logic into hooks
- Centralize API calls in service files

### Performance Optimization

**1. React Best Practices**
- Use Server Components by default
- Add 'use client' only when necessary (interactivity, hooks, browser APIs)
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for expensive components

**2. Next.js Optimization**
- Use Next.js Image component for images
- Implement dynamic imports for heavy components
- Leverage route-based code splitting
- Use loading.tsx and error.tsx files

**3. API Optimization**
- Implement debouncing for search inputs
- Cache API responses when appropriate
- Use pagination for large datasets
- Implement optimistic updates for better UX

### Security Considerations

**1. Authentication**
- Store JWT tokens securely (httpOnly cookies preferred over localStorage)
- Implement token refresh mechanism
- Clear sensitive data on logout
- Validate token on protected routes

**2. Authorization**
- Check permissions on both frontend and backend
- Hide UI elements based on permissions
- Validate user roles before API calls
- Never trust client-side validation alone

**3. Data Validation**
- Validate all user inputs with Zod schemas
- Sanitize data before display
- Use parameterized queries (backend)
- Implement CSRF protection

### Accessibility

**1. Semantic HTML**
- Use proper heading hierarchy
- Use semantic tags (nav, main, article, etc.)
- Add ARIA labels where needed

**2. Keyboard Navigation**
- Ensure all interactive elements are keyboard accessible
- Implement focus management
- Add skip navigation links

**3. Screen Reader Support**
- Add alt text to images
- Use descriptive link text
- Provide form labels
- Announce dynamic content changes

### Testing Strategy

**1. Unit Tests**
- Test utility functions
- Test custom hooks
- Test data transformations

**2. Integration Tests**
- Test API service functions
- Test form submissions
- Test data flows

**3. E2E Tests**
- Test critical user flows
- Test authentication flow
- Test ticket creation process

---

## Environment Configuration

### Environment Variables

Create `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Application
NEXT_PUBLIC_APP_NAME=Helpdesk
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_DARK_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Configuration Files

**tailwind.config.ts**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#E63946', // RedDot brand red
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#2196F3', // Blue
          foreground: '#FFFFFF',
        },
        // Add more custom colors from UI design doc
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Summary

This Software Requirements Specification provides a comprehensive blueprint for building the Helpdesk frontend application with Next.js 15, TypeScript, and modern React practices. The architecture emphasizes:

- **Type Safety:** Full TypeScript coverage with Zod validation
- **Modularity:** Feature-based organization with reusable components
- **Performance:** Server Components, code splitting, and optimization
- **Maintainability:** Clear separation of concerns and consistent patterns
- **Scalability:** Structured to handle growth in features and users
- **User Experience:** Role-based UI, responsive design, and accessibility

**Key Technologies:**
- Next.js 15 (App Router)
- TypeScript
- shadcn/ui + Tailwind CSS
- Lucide React (icons)
- React Context (state management)
- React Hook Form + Zod (forms)
- Axios (API client)
- date-fns (date handling)
- Sonner (notifications)
  