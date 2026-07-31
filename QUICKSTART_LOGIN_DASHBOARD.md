# Quick Start: Login & Dashboard Integration

## 30-Second Overview

- **Single login page** for users and admins
- **Backend reads `is_admin` from database** to determine role
- **Automatic redirect** to correct dashboard
- **User dashboard** - view bookings and spending
- **Admin dashboard** - manage flights and create new ones

## Quick Test (5 minutes)

### Start Servers (2 terminals)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Test Admin Login
1. Go to http://localhost:3000/login
2. Enter: `atltravels@hotmail.com` / `atltravels`
3. Click "Sign In"
4. **Expected:** Redirects to `/admin/dashboard`
5. **See:** Flights management interface

### Test User Signup
1. Go to http://localhost:3000/login
2. Click "Create Account"
3. Fill in name, email, password
4. Click "Create Account"
5. **Expected:** Redirects to `/user/dashboard`
6. **See:** Bookings management interface

### Test Role Protection
1. While logged in as admin, go to `/user/dashboard`
2. **Expected:** Redirects back to `/admin/dashboard`
3. Logout, signup as new user
4. Go to `/admin/dashboard`
5. **Expected:** Redirects to `/user/dashboard`

## Login Flow (How It Works)

```
User/Admin clicks "Sign In"
    ↓
Sends email + password to /api/auth/login
    ↓
Backend verifies in Supabase Auth
    ↓
Backend queries profiles table → reads is_admin
    ↓
Backend returns JWT + user {id, email, is_admin}
    ↓
Frontend stores: authToken + user in localStorage
    ↓
Frontend checks is_admin and redirects:
    is_admin = true  → /admin/dashboard
    is_admin = false → /user/dashboard
    ↓
Dashboard loads, verifies role, shows appropriate UI
```

## Demo Accounts

### Admin Account
```
Email:    atltravels@hotmail.com
Password: atltravels
Role:     Admin (is_admin: true)
```

### Create New User Account
- Use signup page
- Any email + password
- Role: User (is_admin: false)

## Database Schema (Key Table)

**profiles table:**
```
id         UUID (primary key)
email      text
is_admin   boolean ← DETERMINES ROLE
first_name text
last_name  text
```

The `is_admin` field in the database determines whether user is redirected to:
- Admin dashboard (if `is_admin = true`)
- User dashboard (if `is_admin = false`)

## Files Modified

1. **app/login/page.tsx** - Unified login endpoint
2. **app/user/dashboard/page.tsx** - Added role check
3. **app/admin/dashboard/page.tsx** - Added role check
4. **server.js** - Backend queries is_admin from database

## Security

- JWT tokens expire in 24 hours
- Passwords hashed by Supabase
- Role verified on every page load
- Backend also verifies admin status on API calls
- Row Level Security (RLS) on database tables

## Troubleshooting

**Q: User stuck on login page after signup?**
A: Check browser console. Make sure backend is running on :3001

**Q: Wrong dashboard showing up?**
A: Check profiles table - is_admin field should be true for admins

**Q: "Cannot access /admin/dashboard"?**
A: Make sure is_admin: true in profiles table for that user

**Q: Backend connection error?**
A: Make sure backend running: `npm run dev:backend`

## Next Steps

1. Test complete flow (admin & user logins)
2. Create additional admin accounts if needed
3. Test role-switching
4. Deploy to production
5. Monitor authentication logs

## Related Documentation

- See `AUTH_AND_DASHBOARD_INTEGRATION.md` for full details
- See `API_REFERENCE.md` for all API endpoints
- Check `server.js` for backend implementation
