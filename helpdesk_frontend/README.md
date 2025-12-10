# Helpdesk Frontend Application

RedDot Digital Ltd - Customer Care Ticketing System

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** React Context API
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** Sonner

## Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- Backend API running on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies

```powershell
npm install
```

Or using pnpm:

```powershell
pnpm install
```

### 2. Environment Setup

The `.env.local` file is already configured with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Update this if your backend API is running on a different URL.

### 3. Run Development Server

```powershell
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```powershell
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components (Sidebar, TopNav)
│   └── tickets/                  # Ticket-related components
├── contexts/
│   └── AuthContext.tsx           # Authentication state management
├── hooks/
│   └── useAuth.ts                # Auth hook
├── lib/
│   ├── api/                      # API services
│   │   ├── client.ts             # Axios instance with interceptors
│   │   └── auth.service.ts       # Auth API calls
│   ├── schemas/                  # Zod validation schemas
│   └── utils/                    # Utility functions
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Route protection middleware
```

## Features Implemented

### ✅ Authentication System
- Login page with form validation
- JWT token management
- Protected routes with middleware
- Auto-redirect to dashboard after login
- Session persistence with localStorage

### ✅ Dashboard Layout
- Basic dashboard layout with sidebar
- Top navigation bar
- Responsive design
- Loading states
- Auth-protected routes

### ✅ UI Components
- Button component with variants
- Input component with error states
- Label component
- Toast notifications
- Custom styling with Tailwind

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User visits the app → Redirected to `/login`
2. User enters credentials → API call to backend
3. On success → Token stored in localStorage
4. User redirected to `/dashboard`
5. All subsequent API calls include JWT token in headers

## API Integration

The app is configured to connect to the backend API at `http://localhost:8080/api`.

### Endpoints Used:
- `POST /auth/login` - User authentication

All API calls are handled through the Axios client in `src/lib/api/client.ts` which:
- Automatically adds JWT token to requests
- Handles 401 errors (session expiry)
- Displays error toasts for failed requests
- Redirects to login on authentication errors

## Next Steps

To continue development:

1. **Implement Sidebar Navigation** - Add role-based menu items
2. **Create Ticket Management** - List, create, view, edit tickets
3. **Add User Management** - Admin pages for users and roles
4. **Implement Entity Management** - Companies, projects, categories, etc.
5. **Add SLA Tracking** - Response/resolution time monitoring
6. **Build Escalation Matrix** - Ticket routing based on SLA

## Troubleshooting

### TypeScript Errors Before Installation
The TypeScript errors you see are expected before running `npm install`. They will be resolved once dependencies are installed.

### Backend Connection Issues
Make sure the Spring Boot backend is running on `http://localhost:8080` before starting the frontend.

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```powershell
npm run dev -- -p 3001
```

## Design System

### Colors
- **Primary:** #E63946 (RedDot brand red)
- **Primary Hover:** #d32f3c
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #6B7280 (gray-500)
- **Border:** #E5E7EB (gray-200)

### Typography
- **Font Family:** Poppins
- **Sizes:** text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### Spacing
- **Card Padding:** 24px (p-6)
- **Section Margin:** 32px (space-y-8)

## License

© 2024 RedDot Digital Ltd. All rights reserved.
