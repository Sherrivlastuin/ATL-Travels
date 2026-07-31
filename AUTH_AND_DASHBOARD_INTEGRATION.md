# Authentication and Dashboard Integration Guide

## Overview
The ATL Travels application now has a fully integrated authentication system with unified login/signup and role-based dashboards for users and admins.

## Architecture

### Database Schema
The application uses Supabase with the following key table:

**profiles table:**
- `id` (UUID) - Primary key, references auth.users(id)
- `email` (text) - User email
- `is_admin` (boolean) - Admin flag (false = regular user, true = admin)
- `first_name` (text) - User's first name
- `last_name` (text) - User's last name
- `created_at` (timestamp) - Account creation time
- `updated_at` (timestamp) - Last update time

### Authentication Flow

#### Login/Sign Up Page (`/app/login/page.tsx`)
1. **Single login/signup page** - Users and admins use the same page
2. **Toggle between modes** - Switch between "Sign In" and "Create Account"
3. **Backend determines role** - Admin status comes from the `profiles.is_admin` database field
4. **Automatic redirect** - After login, redirects to:
   - `/admin/dashboard` if `is_admin === true`
   - `/user/dashboard` if `is_admin === false`

#### Backend Endpoints

**Login Endpoint:** `POST /api/auth/login`
- Accepts: `{ email, password }`
- Returns: `{ token, user: { id, email, is_admin } }`
- The backend queries the profiles table to check `is_admin` status
- JWT token is issued with 24h expiration

**Signup Endpoint:** `POST /api/auth/signup`
- Accepts: `{ email, password, first_name, last_name }`
- Creates new user in Supabase auth
- Creates profile with `is_admin: false` by default
- Returns: `{ message, user }`

**Implementation:** `/vercel/share/v0-project/server.js` (lines 140-187)

### Dashboard Routes

#### User Dashboard (`/app/user/dashboard/page.tsx`)
**Route:** `/user/dashboard`

**Protections:**
- Requires authentication (redirects to `/login` if not authenticated)
- Only accessible to users with `is_admin === false`
- Admins are automatically redirected to `/admin/dashboard`

**Features:**
- Welcome message with user email
- Total bookings count
- Total spending tracker
- Browse bookings with status indicators
- "Book New Flight" quick action
- Logout functionality

**Data Fetching:**
- Fetches user bookings from `/api/bookings`
- Uses JWT token from localStorage for authentication

#### Admin Dashboard (`/app/admin/dashboard/page.tsx`)
**Route:** `/admin/dashboard`

**Protections:**
- Requires authentication (redirects to `/login` if not authenticated)
- Only accessible to users with `is_admin === true`
- Non-admin users are automatically redirected to `/user/dashboard`

**Features:**
- Admin dashboard header
- Total flights count
- Total available seats tracker
- Add new flight form (toggle visibility)
- Flight management table with delete functionality
- Logout functionality

**Data Fetching:**
- Fetches all flights from `/api/flights`
- Uses JWT token from localStorage for authentication
- Can add/delete flights via API

## Implementation Details

### Frontend Authentication Flow

1. **User enters credentials on `/login`**
2. **Frontend sends to `POST /api/auth/login`**
3. **Backend verifies password and retrieves `is_admin` from profiles**
4. **Backend returns JWT token + user object with `is_admin` flag**
5. **Frontend stores:**
   - `authToken` in localStorage
   - `user` object (including `is_admin`) in localStorage
6. **Frontend redirects based on `is_admin` flag**
7. **Dashboard loads and verifies role again (in useEffect)**
8. **If role mismatch, redirects to correct dashboard**

### Security Features

- **JWT tokens** expire in 24 hours
- **Role-based access control** - Each dashboard verifies the user's role
- **Database-driven role determination** - `is_admin` is stored in database, not just tokens
- **Protected API endpoints** - Flights endpoints check admin status server-side
- **RLS Policies** - Supabase Row Level Security ensures users can only access their own data

### Demo Credentials

**Admin Account:**
- Email: `atltravels@hotmail.com`
- Password: `atltravels`
- Has `is_admin: true` in database

**Regular User:**
- Can sign up with any email/password
- Automatically gets `is_admin: false`

## Testing Checklist

### Authentication Flow
- [ ] Test login with admin credentials → redirects to `/admin/dashboard`
- [ ] Test login with regular user → redirects to `/user/dashboard`
- [ ] Test sign up as new user → redirects to `/user/dashboard`
- [ ] Test logout clears localStorage and redirects to `/`
- [ ] Test accessing `/user/dashboard` as admin → redirects to `/admin/dashboard`
- [ ] Test accessing `/admin/dashboard` as regular user → redirects to `/user/dashboard`
- [ ] Test accessing dashboards without authentication → redirects to `/login`

### User Dashboard
- [ ] Displays welcome message with user email
- [ ] Shows total bookings count
- [ ] Shows total amount spent
- [ ] Lists all user bookings
- [ ] Shows booking status correctly
- [ ] "Book New Flight" button links to home
- [ ] Logout button works

### Admin Dashboard
- [ ] Displays admin dashboard header
- [ ] Shows total flights count
- [ ] Shows total available seats
- [ ] Can toggle "Add New Flight" form
- [ ] Can add a new flight
- [ ] Can delete a flight
- [ ] Flights table displays all flights
- [ ] Logout button works

### Backend Integration
- [ ] Backend running on `http://localhost:3001`
- [ ] `/api/auth/login` returns token and user with `is_admin`
- [ ] `/api/auth/signup` creates user correctly
- [ ] Protected endpoints require JWT token
- [ ] Admin-only endpoints reject non-admin users

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login (for both users and admins)
- `POST /api/auth/admin-signup` - Create admin user

### Flights
- `GET /api/flights` - Get all flights (public)
- `GET /api/flights/:id` - Get flight details (public)
- `POST /api/flights` - Create flight (admin only, requires JWT)
- `PUT /api/flights/:id` - Update flight (admin only, requires JWT)
- `DELETE /api/flights/:id` - Delete flight (admin only, requires JWT)

### Bookings
- `GET /api/bookings` - Get user's bookings (requires JWT)
- `POST /api/bookings` - Create booking (requires JWT)
- `PUT /api/bookings/:id` - Update booking (requires JWT)
- `DELETE /api/bookings/:id` - Cancel booking (requires JWT)

## Files Modified

1. **`app/login/page.tsx`**
   - Unified single endpoint login for users and admins
   - Removed separate admin-login endpoint usage
   - Removed admin toggle (role determined by database)
   - Proper redirect based on `is_admin` field

2. **`app/user/dashboard/page.tsx`**
   - Added role verification in useEffect
   - Redirects admins to `/admin/dashboard`
   - Only accessible to regular users

3. **`app/admin/dashboard/page.tsx`**
   - Added role verification in useEffect
   - Redirects non-admins to `/user/dashboard`
   - Only accessible to admin users

4. **`server.js`** (Backend)
   - `/api/auth/login` endpoint returns user with `is_admin` flag
   - Queries profiles table to determine admin status
   - Both users and admins login via same endpoint

## Environment Variables Required

Make sure these are set in your environment:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for JWT signing (optional, has default)

## Troubleshooting

### Users redirecting to wrong dashboard
- Check that `is_admin` field is correctly set in profiles table
- Verify backend login endpoint returns correct `is_admin` value
- Check localStorage has correct user object

### Cannot access dashboards
- Verify authToken and user are in localStorage
- Check backend is running on `http://localhost:3001`
- Check JWT token is valid (24h expiration)

### Admin cannot add/delete flights
- Verify user has `is_admin: true` in profiles table
- Check JWT token is being sent in Authorization header
- Backend endpoint checks admin status via profiles table

## Next Steps

1. Test the complete authentication flow
2. Monitor for any role mismatch issues
3. Add email verification for sign ups (optional)
4. Add password reset functionality (optional)
5. Add user profile editing (optional)
6. Add flight booking from user dashboard (optional)
