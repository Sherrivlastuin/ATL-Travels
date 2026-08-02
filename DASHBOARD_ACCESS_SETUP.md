# Dashboard Access Setup Guide

## Overview
This guide ensures that both admin and user accounts can successfully login and access their respective dashboards after authentication.

## System Architecture

### Authentication Flow
```
User/Admin clicks Login
  ↓
Enters credentials at /login page
  ↓
Frontend sends to Backend: /api/auth/login
  ↓
Backend verifies credentials via Supabase Auth
  ↓
Backend queries profiles table for is_admin field
  ↓
Backend returns JWT token + user object with is_admin flag
  ↓
Frontend stores:
  - authToken (JWT) in localStorage
  - user (JSON with is_admin) in localStorage
  ↓
Frontend checks is_admin field
  ↓
Routes to dashboard:
  - is_admin === true  → /admin/dashboard
  - is_admin === false → /user/dashboard
  ↓
Dashboard loads and verifies authentication again
  - Checks localStorage for token and user
  - Verifies role matches dashboard type
  - If mismatch: redirects to correct dashboard
  - If no auth: redirects to /login
  ↓
User sees their dashboard with role-specific features
```

## Database Schema

### Profiles Table (in Supabase)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

The `is_admin` field is the key field that determines dashboard access:
- `true` = Admin user → redirected to /admin/dashboard
- `false` = Regular user → redirected to /user/dashboard

## Setup Instructions

### Step 1: Verify Backend Dependencies

All required packages should already be installed. Verify with:
```bash
cd /vercel/share/v0-project
cat package.json | grep -A 20 '"dependencies"'
```

Required packages for backend:
- express
- cors
- @supabase/supabase-js
- jsonwebtoken
- bcryptjs
- dotenv
- multer

### Step 2: Verify Environment Variables

Check that Supabase environment variables are set:
```bash
cat /vercel/share/.env.project | grep -i supabase
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - JWT signing secret (optional, backend has default)

### Step 3: Start Backend Server

In a terminal, start the backend on port 3001:
```bash
cd /vercel/share/v0-project
npm run dev:backend
```

Or in separate terminal:
```bash
cd /vercel/share/v0-project
node server.js
```

Expected output:
```
Server running on http://localhost:3001
```

### Step 4: Start Frontend Server

In another terminal, start the frontend on port 3000:
```bash
cd /vercel/share/v0-project
npm run dev
```

Expected output:
```
▲ Next.js 16.x
  ○ Localhost:3000
```

### Step 5: Verify Database Setup

Check that the profiles table exists in Supabase with the admin account:

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run this query to verify the admin user exists:

```sql
SELECT id, email, is_admin FROM profiles WHERE email = 'atltravels@hotmail.com';
```

Expected result:
```
id         | email                   | is_admin
------     | atltravels@hotmail.com | true
```

If the admin user doesn't exist, run the setup script:
```bash
node setup.js
```

## Testing Dashboard Access

### Test 1: Admin Login

1. Open browser to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `atltravels@hotmail.com`
   - Password: `atltravels`
3. Click "Sign In"

Expected result:
- ✓ Login successful
- ✓ Redirected to `/admin/dashboard`
- ✓ See "Flights Management" interface
- ✓ See flights list with add/delete options
- ✓ See total flights count
- ✓ See total available seats count

### Test 2: Regular User Signup & Login

1. Open browser to `http://localhost:3000/login`
2. Click "Create Account"
3. Enter details:
   - Full Name: `John Doe` (or any name)
   - Email: `john@example.com` (any email)
   - Password: `password123` (any password)
4. Click "Create Account"

Expected result:
- ✓ Account created successfully
- ✓ Automatically logged in
- ✓ Redirected to `/user/dashboard`
- ✓ See "Bookings Management" interface
- ✓ See user email in welcome message
- ✓ See bookings list (empty for new user)
- ✓ See "Book New Flight" button

### Test 3: Role-Based Access Protection

#### Admin accessing user dashboard URL
1. Login as admin
2. Try to manually navigate to: `http://localhost:3000/user/dashboard`
3. Or open browser console and navigate:

Expected result:
- ✓ Automatically redirected to `/admin/dashboard`
- ✓ User dashboard content does not load

#### User accessing admin dashboard URL
1. Login as regular user
2. Try to manually navigate to: `http://localhost:3000/admin/dashboard`

Expected result:
- ✓ Automatically redirected to `/user/dashboard`
- ✓ Admin dashboard content does not load

### Test 4: Authentication Protection

#### Access dashboard without login
1. In browser, open incognito/private window
2. Navigate to: `http://localhost:3000/admin/dashboard`

Expected result:
- ✓ Redirected to `/login`
- ✓ Cannot access admin dashboard
- ✓ Same for `/user/dashboard`

#### Logout functionality
1. Login to any dashboard
2. Click "Logout" button
3. Try to access the dashboard again

Expected result:
- ✓ localStorage cleared
- ✓ Redirected to home page
- ✓ Cannot access dashboard anymore

### Test 5: API Integration

Test that the backend API endpoints work correctly:

#### Admin can fetch flights
```bash
# Get auth token first by logging in through UI
# Then test the API:

curl -X GET http://localhost:3001/api/flights \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected result:
- ✓ Returns flights array with data
- ✓ Status 200 OK

#### Admin can create flight
```bash
curl -X POST http://localhost:3001/api/flights \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "airline": "Delta",
    "departure_city": "New York",
    "arrival_city": "Miami",
    "price": 250,
    "available_seats": 100
  }'
```

Expected result:
- ✓ Flight created successfully
- ✓ Status 201 Created
- ✓ Returns flight object with id

## Troubleshooting

### Issue: "Cannot GET /login" error
**Solution**: Frontend dev server not running
```bash
npm run dev
```

### Issue: "Failed to fetch" when clicking login
**Solution**: Backend server not running
```bash
npm run dev:backend
```

### Issue: Login succeeds but no redirect to dashboard
**Solution**: Check browser console for errors
- Open DevTools (F12)
- Check Console tab for JavaScript errors
- Look for API errors in Network tab

### Issue: "Redirected to /login" when accessing dashboard
**Solution**: Authentication token expired or invalid
- Clear browser localStorage: `localStorage.clear()`
- Login again at `/login`
- Wait for automatic redirect to dashboard

### Issue: User redirected to admin dashboard when should be user
**Solution**: Check is_admin flag in profiles table
```sql
SELECT email, is_admin FROM profiles WHERE email = 'user@example.com';
```

If is_admin is true, update it:
```sql
UPDATE profiles SET is_admin = false WHERE email = 'user@example.com';
```

### Issue: Admin redirected to user dashboard when should be admin
**Solution**: Check is_admin flag in profiles table
```sql
SELECT email, is_admin FROM profiles WHERE email = 'admin@example.com';
```

If is_admin is false, update it:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';
```

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── login/
│   │   └── page.tsx                    # Login/Signup form
│   ├── user/
│   │   └── dashboard/
│   │       └── page.tsx                # User dashboard
│   └── admin/
│       └── dashboard/
│           └── page.tsx                # Admin dashboard
├── server.js                           # Backend Express server
├── setup.js                            # Database initialization script
├── package.json                        # Dependencies
└── .env.local                          # Environment variables
```

## Key Components

### Login Page (`app/login/page.tsx`)
- Unified login/signup page
- Sends credentials to `/api/auth/login` endpoint
- Stores JWT token and user data in localStorage
- Redirects based on `is_admin` field

### User Dashboard (`app/user/dashboard/page.tsx`)
- Checks authentication token
- Verifies `is_admin === false`
- Shows bookings and user-specific features
- Redirects admins to admin dashboard

### Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Checks authentication token
- Verifies `is_admin === true`
- Shows flight management interface
- Redirects non-admins to user dashboard

### Backend Server (`server.js`)
- Authentication endpoints: `/api/auth/login`, `/api/auth/signup`
- Queries `is_admin` from profiles table
- Issues JWT tokens
- Protects routes with JWT verification

## Features

### Authentication
- ✓ Email/password login
- ✓ User registration
- ✓ JWT token-based sessions (24h expiration)
- ✓ Secure password hashing with bcrypt

### User Dashboard
- ✓ View personal bookings
- ✓ View total spending
- ✓ Book new flights
- ✓ Logout functionality

### Admin Dashboard
- ✓ View all flights
- ✓ Add new flights
- ✓ Delete flights
- ✓ View total seats available
- ✓ Logout functionality

### Security
- ✓ Role-based access control
- ✓ JWT token verification
- ✓ Automatic role-based redirects
- ✓ Protected API endpoints
- ✓ localStorage for client-side session management

## Next Steps

1. **Test the complete flow**
   - Login as admin
   - Create new user account
   - Verify correct dashboards appear

2. **Monitor logs**
   - Watch backend logs for API calls
   - Watch frontend console for errors

3. **Deploy to production**
   - Set JWT_SECRET in production environment
   - Update API URLs for production backend
   - Enable HTTPS for secure token transmission

## Support

For detailed information, see:
- `AUTH_AND_DASHBOARD_INTEGRATION.md` - Architecture overview
- `QUICKSTART_LOGIN_DASHBOARD.md` - Quick start guide
- `ARCHITECTURE_DIAGRAM.md` - System diagrams
