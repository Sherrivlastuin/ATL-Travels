# Admin Login System Setup

## Overview

The ATL Travels application now includes a secure admin login system with a hidden button in the footer. Admin users can access a dedicated admin dashboard to manage flights and bookings.

## Admin Credentials

- **Email**: `atltravels@hotmail.com`
- **Password**: `atltravels`

> ⚠️ **Important**: These credentials are NOT displayed anywhere on the website. They are only documented here for development purposes.

## Features

### 1. Hidden Admin Login Button
- Located in the footer of every page
- Visible only on hover to maintain a clean UI
- Discreet login icon (barely visible at 40% opacity)
- Clicking opens the admin login modal

### 2. Admin Login Modal
- Clean, professional modal dialog
- Email and password input fields
- Form validation
- Error messages for invalid credentials
- Cancel button to close without logging in

### 3. Admin Dashboard
- Accessible only to authenticated admin users
- Displays flight management interface
- Shows:
  - Total flights count
  - Total available seats
  - Flights table with: Airline, Route, Price, Seats, Actions
  - Delete button for each flight
  - Add flight functionality
  - Logout button

### 4. Access Control
- Non-admin users attempting to access `/admin/dashboard` are redirected to `/user/dashboard`
- Users must be authenticated via Supabase
- Admin email verification prevents unauthorized access

## How It Works

### User Flow

1. **Access Admin Modal**
   - Scroll to footer on any page
   - Hover over the footer to reveal the hidden login button
   - Click the login icon to open the admin modal

2. **Login**
   - Enter email: `atltravels@hotmail.com`
   - Enter password: `atltravels`
   - Click "Sign In"

3. **Access Admin Dashboard**
   - Automatically redirected to `/admin/dashboard`
   - Dashboard loads with all flights and statistics
   - Can manage flights (view, delete)

4. **Logout**
   - Click "Logout" button in top-right corner
   - Redirected to home page
   - Session ends

### Technical Implementation

**Files Involved:**
- `components/admin-login-modal.tsx` - Admin login modal UI
- `components/footer.tsx` - Footer with hidden admin button
- `lib/actions/admin-auth.ts` - Server action for admin authentication
- `app/admin/dashboard/page.tsx` - Admin dashboard page
- `lib/supabase/` - Supabase client setup files

**Authentication Flow:**
1. User submits credentials in modal
2. Server action validates email matches `NEXT_PUBLIC_ADMIN_EMAIL`
3. Supabase authenticates password
4. Session created
5. User redirected to `/admin/dashboard`

**Protection:**
- Supabase Auth handles password hashing and verification
- Session tokens stored in secure cookies
- Admin email is verified server-side
- Non-admin users are blocked from admin routes

## Environment Variables

The following environment variable is required:

- `NEXT_PUBLIC_ADMIN_EMAIL` - Set to `atltravels@hotmail.com`

This variable is automatically managed by Supabase integration.

## Security Considerations

✅ **Implemented:**
- Passwords never displayed or logged
- Credentials not hardcoded in UI
- Server-side authentication verification
- Secure session management via Supabase
- Email verification for admin role
- Clean session cookies

⚠️ **For Production:**
- Use strong, unique passwords
- Implement additional MFA (Multi-Factor Authentication)
- Enable audit logging for admin actions
- Consider IP whitelisting
- Regular password rotation policy

## Testing

To test the admin login:

1. Navigate to the homepage: `http://localhost:3000`
2. Scroll to the footer
3. Look for the faint login icon button (appears on hover)
4. Click to open modal
5. Enter credentials:
   - Email: `atltravels@hotmail.com`
   - Password: `atltravels`
6. Click Sign In
7. You should be redirected to `/admin/dashboard`

## Troubleshooting

**Issue**: Admin modal won't open
- Solution: Make sure JavaScript is enabled
- Check browser console for errors

**Issue**: "Invalid credentials" error
- Solution: Verify you're entering exact email and password
- Check that Supabase is properly configured

**Issue**: Admin dashboard shows "Loading..."
- Solution: Wait for page to fully load
- Refresh if it takes longer than 5 seconds
- Check network requests in DevTools

**Issue**: Redirected back to home after login
- Solution: Verify the email matches `NEXT_PUBLIC_ADMIN_EMAIL` env var
- Check Supabase database that user exists
- Verify user is marked as confirmed in Supabase Auth

## Future Enhancements

- [ ] Add two-factor authentication (2FA)
- [ ] Implement admin activity logging
- [ ] Add role-based access control (RBAC)
- [ ] Create multiple admin users
- [ ] Add flight editing capability
- [ ] Implement flight creation form
- [ ] Add analytics dashboard
- [ ] Create admin user management interface
