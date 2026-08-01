# ATL Travels - Authentication & Dashboard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                             │
│                                                                         │
│  ┌──────────────────┐    ┌────────────────┐    ┌──────────────────┐  │
│  │  Home Page       │    │  Login/Signup  │    │  Dashboards      │  │
│  │  (/)             │───→│  (/login)      │    │  (/user, /admin) │  │
│  │                  │    │                │    │                  │  │
│  │  Login Button    │    │ • Sign In      │    │ • User: Bookings │  │
│  │  Sign Up Button  │    │ • Create Acct  │───→│ • Admin: Flights │  │
│  └──────────────────┘    └────────────────┘    └──────────────────┘  │
│                                 ↓                                        │
│                        ┌────────────────┐                              │
│                        │ Verification   │                              │
│                        │ Check is_admin │                              │
│                        │ Redirect route │                              │
│                        └────────────────┘                              │
│                                                                         │
│  localStorage:                                                         │
│  • authToken (JWT)                                                     │
│  • user {id, email, is_admin}                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │ HTTP Requests             │
                     │ (Authorization: Bearer)   │
                     ↓                           ↓
        ┌──────────────────────┐    ┌──────────────────────┐
        │  /api/auth/login     │    │  /api/auth/signup    │
        │  /api/auth/logout    │    │  /api/flights        │
        │  /api/bookings       │    │  /api/bookings       │
        └──────────────────────┘    └──────────────────────┘
                     │                           │
                     └─────────────┬─────────────┘
                                   ↓
        ┌────────────────────────────────────────────────────┐
        │         BACKEND (Node.js/Express)                  │
        │         (Running on http://localhost:3001)         │
        │                                                    │
        │  ┌─────────────────────────────────────────┐      │
        │  │  Routes                                 │      │
        │  │                                         │      │
        │  │  POST /api/auth/login                  │      │
        │  │  POST /api/auth/signup                 │      │
        │  │  GET  /api/flights                     │      │
        │  │  POST /api/flights (admin)             │      │
        │  │  DELETE /api/flights/:id (admin)       │      │
        │  │  GET  /api/bookings                    │      │
        │  │  POST /api/bookings                    │      │
        │  └─────────────────────────────────────────┘      │
        │                     ↓                              │
        │  ┌─────────────────────────────────────────┐      │
        │  │  Middleware                             │      │
        │  │  • Verify JWT Token                    │      │
        │  │  • Extract user info                   │      │
        │  │  • Check is_admin                      │      │
        │  └─────────────────────────────────────────┘      │
        │                     ↓                              │
        │  ┌─────────────────────────────────────────┐      │
        │  │  Database Queries                       │      │
        │  │  • Query profiles table                │      │
        │  │  • Read is_admin field                 │      │
        │  │  • Query flights table                 │      │
        │  │  • Query bookings table                │      │
        │  └─────────────────────────────────────────┘      │
        └────────────────────────────────────────────────────┘
                                   ↓
        ┌────────────────────────────────────────────────────┐
        │      DATABASE (Supabase PostgreSQL)                │
        │                                                    │
        │  ┌─────────────┐                                   │
        │  │  profiles   │  ← User roles stored here        │
        │  ├─────────────┤                                   │
        │  │ id          │  (UUID)                          │
        │  │ email       │  (text)                          │
        │  │ is_admin    │  (boolean) ✓ ROLE DETERMINER    │
        │  │ first_name  │  (text)                          │
        │  │ last_name   │  (text)                          │
        │  └─────────────┘                                   │
        │                                                    │
        │  ┌─────────────┐     ┌──────────────┐             │
        │  │  flights    │     │   bookings   │             │
        │  ├─────────────┤     ├──────────────┤             │
        │  │ id          │     │ id           │             │
        │  │ airline     │     │ user_id (FK) │             │
        │  │ route       │     │ flight_id    │             │
        │  │ price       │     │ status       │             │
        │  │ seats       │     │ passengers   │             │
        │  └─────────────┘     │ total_price  │             │
        │                      └──────────────┘             │
        │                                                    │
        │  RLS Policies:                                    │
        │  • Users only see own bookings                    │
        │  • Admins can manage flights                      │
        │  • All users can view flights                     │
        └────────────────────────────────────────────────────┘
```

## Authentication Flow - Detailed

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER OPENS LOGIN PAGE                             │
│                         (GET /login)                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               ↓
        ┌──────────────────────────────────────────┐
        │ User sees two options:                    │
        │ • "Sign In" (existing user)              │
        │ • "Create Account" (new user)            │
        └──────────────────────────────────────────┘
                               ↓
                ┌──────────────┴──────────────┐
                ↓                             ↓
         SIGN IN PATH              CREATE ACCOUNT PATH
         (Existing User)           (New User)
                ↓                             ↓
         ┌─────────────────┐         ┌──────────────────┐
         │ User enters:    │         │ User enters:     │
         │ • Email         │         │ • Full Name      │
         │ • Password      │         │ • Email          │
         │                 │         │ • Password       │
         │ Click "Sign In" │         │                  │
         │                 │         │ Click "Create"   │
         └────────┬────────┘         └────────┬─────────┘
                  ↓                           ↓
        Frontend calls:            Frontend calls:
        POST /api/auth/login       POST /api/auth/signup
          {email, password}          {email, password,
                  ↓                   first_name, name}
                  ↓                           ↓
        ┌─────────────────────────────────────────┐
        │         BACKEND PROCESSING              │
        │                                         │
        │ 1. Verify password against auth table   │
        │ 2. Query profiles table                 │
        │ 3. Read is_admin field                  │
        │ 4. Create JWT token                     │
        │ 5. Return: {token, user:{               │
        │     id, email, is_admin              │
        │   }}                                    │
        └────────────────┬────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────┐
        │    FRONTEND RECEIVES RESPONSE            │
        │                                         │
        │ 1. Store authToken in localStorage      │
        │ 2. Store user object in localStorage    │
        │ 3. Check is_admin field                 │
        └────────────────┬────────────────────────┘
                         ↓
            ┌────────────────────────┐
            │ Read is_admin flag     │
            └────────────┬───────────┘
                         ↓
          ┌──────────────┴──────────────┐
          ↓                             ↓
   is_admin === true          is_admin === false
          ↓                             ↓
   Redirect to:               Redirect to:
   /admin/dashboard           /user/dashboard
          ↓                             ↓
   ┌─────────────────┐         ┌─────────────────┐
   │ Admin Dashboard │         │ User Dashboard  │
   │                 │         │                 │
   │ • Flights: 6    │         │ • Bookings: 0   │
   │ • Add Flight    │         │ • Spent: $0     │
   │ • Manage        │         │ • Browse        │
   │ • Delete        │         │ • Book New      │
   │ • Logout        │         │ • Logout        │
   └─────────────────┘         └─────────────────┘
```

## Role-Based Access Control

```
Request to Protected Page
        ↓
Is user authenticated?
  ├─ NO → Redirect to /login
  └─ YES ↓
      Read is_admin from localStorage
        ↓
      Check requested page:
        ├─ /user/dashboard
        │   ├─ is_admin? → YES → Redirect to /admin/dashboard
        │   └─ is_admin? → NO  → Allow access
        │
        └─ /admin/dashboard
            ├─ is_admin? → YES → Allow access
            └─ is_admin? → NO  → Redirect to /user/dashboard
```

## Database Role Determination

```
Login Process - Role Discovery:

POST /api/auth/login
├─ Check Supabase Auth table
│  └─ Verify password
│
├─ Query profiles table
│  WHERE id = user_id
│
├─ Read is_admin field
│  ├─ Value: true  → Is Administrator
│  └─ Value: false → Is Regular User
│
└─ Return in response:
   {
     token: "jwt...",
     user: {
       id: "uuid",
       email: "user@example.com",
       is_admin: true/false  ← Role determined from database
     }
   }
```

## Dashboard Data Flow

```
USER DASHBOARD (/user/dashboard)
        ↓
1. Load page → Check localStorage
2. Verify authenticated & not admin
3. Fetch /api/bookings with JWT token
4. Backend verifies JWT and returns user's bookings
5. Display booking count, spending, list
6. Show "Book New Flight" action

ADMIN DASHBOARD (/admin/dashboard)
        ↓
1. Load page → Check localStorage
2. Verify authenticated & is admin
3. Fetch /api/flights with JWT token
4. Backend verifies JWT and admin status
5. Display flights, seats, add/delete options
6. Allow flight management operations
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1: Frontend Route Protection                      │
│ • Check localStorage for authToken                      │
│ • Verify is_admin matches route requirement             │
│ • Redirect if mismatch                                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ LAYER 2: JWT Token Verification                         │
│ • Verify JWT signature                                  │
│ • Check expiration (24h)                                │
│ • Extract user ID and is_admin                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ LAYER 3: Database Role Verification                     │
│ • Query profiles table again                            │
│ • Double-check is_admin status                          │
│ • Verify user hasn't been modified                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ LAYER 4: Row Level Security (RLS)                       │
│ • Database enforces policies at query level             │
│ • Users only see own data                               │
│ • Admins see all data                                   │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
www.atltra vels.com
        ↓
┌────────────────────┐
│ Frontend Vercel    │ (Next.js app)
│ http://localhost   │
│ :3000              │
└─────────┬──────────┘
          │ HTTP/HTTPS
          ↓
┌────────────────────┐
│ Backend Server     │ (Express.js)
│ localhost:3001     │ (or production URL)
│                    │
│ API Endpoints:     │
│ • /api/auth/*      │
│ • /api/flights/*   │
│ • /api/bookings/*  │
└─────────┬──────────┘
          │ Database Queries
          ↓
┌────────────────────┐
│ Supabase           │ (PostgreSQL + Auth)
│ Cloud Database     │
│                    │
│ Tables:            │
│ • profiles         │
│ • flights          │
│ • bookings         │
│ • messages         │
│ • media            │
└────────────────────┘
```

## Complete User Journey

```
1. USER LANDS ON SITE
   ↓ Clicks "Login" button in header
   ↓
2. ROUTED TO /login
   ↓ Page loads with Sign In / Create Account options
   ↓
3a. EXISTING USER FLOW:
    ↓ Enters email + password
    ↓ Clicks "Sign In"
    ↓ Frontend sends to POST /api/auth/login
    ↓ Backend verifies + queries is_admin
    ↓ Returns JWT + user object
    ↓ Frontend stores in localStorage
    ↓ Frontend checks is_admin
    ↓ Redirects to /admin or /user dashboard
    ↓
3b. NEW USER FLOW:
    ↓ Clicks "Create Account"
    ↓ Fills in name, email, password
    ↓ Clicks "Create Account"
    ↓ Frontend sends to POST /api/auth/signup
    ↓ Backend creates user in Supabase Auth
    ↓ Backend creates profile with is_admin: false
    ↓ Returns user object
    ↓ Frontend stores in localStorage
    ↓ Frontend redirects to /user/dashboard
    ↓
4. DASHBOARD LOADS
   ↓ Page verifies authentication
   ↓ Page verifies role matches route
   ↓ Fetches dashboard data (flights or bookings)
   ↓ Displays role-appropriate interface
   ↓
5. USER INTERACTS
   ↓ Browsing, booking, or managing flights
   ↓ All API calls include JWT token
   ↓ Backend verifies role for each operation
   ↓
6. USER LOGS OUT
   ↓ Clicks logout button
   ↓ localStorage cleared
   ↓ Redirects to home page
   ↓ Must login again to access dashboard
```
