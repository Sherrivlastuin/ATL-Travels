# Supabase Email/Password Authentication Setup

## Overview
The ATL Travels application now uses **Supabase Authentication** with email and password login. The old admin and user login tables have been removed and replaced with Supabase's built-in auth system.

## Key Changes

### 1. Database Changes
- **Deleted Tables**: `public.admin_logins`, `public.user_logins`
- **New Auth System**: Supabase native `auth.users` table
- Email confirmation is enabled by default

### 2. New Files Created

#### Supabase Client Setup
- `lib/supabase/client.ts` - Browser-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/proxy.ts` - Proxy for session management

#### Authentication Pages
- `app/login/page.tsx` - Updated login/signup page
- `app/auth/callback/route.ts` - Email confirmation callback handler
- `app/auth/sign-up-success/page.tsx` - Signup success page
- `app/auth/error/page.tsx` - Auth error page

#### Middleware & Config
- `middleware.ts` - Session handling middleware

### 3. Dependencies
- Added `@supabase/ssr` package for server-side auth support

## How It Works

### User Signup Flow
1. User enters email and password on signup form
2. Supabase creates account in `auth.users` table
3. Confirmation email is sent to user's email address
4. User clicks email link to confirm account
5. User is redirected to `/auth/callback` which exchanges code for session
6. User can now log in

### User Login Flow
1. User enters email and password
2. `signInWithPassword()` authenticates with Supabase
3. Session is stored in browser cookies
4. User is redirected to `/user/dashboard`

### User Dashboard
- Protected with auth check
- Displays user info from Supabase session
- Shows booking data (when available)
- Logout button clears session

## Environment Variables

The following environment variables are required (already set up):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Email Confirmation

By default, email confirmation is **enabled**. This means:
- New users must confirm their email before they can log in
- A confirmation link is sent to their email
- The link redirects to `/auth/callback` which validates the code

### To Skip Email Confirmation (Development Only)
If you need to test without email confirmation, you can:
1. Use the Supabase dashboard to manually confirm users
2. Or modify the Supabase settings to disable email confirmation

## Testing

### To Test Signup:
1. Go to `/login?mode=signup`
2. Enter email and password
3. Check email for confirmation link (if using real email)
4. Click link to confirm account

### To Test Login:
1. Go to `/login`
2. Enter confirmed email and password
3. Should redirect to `/user/dashboard`

### Demo Credentials:
- If you have a confirmed email, use it to test
- All test accounts should be created through the signup form

## Database User Profiles

To extend user information, a `public.profiles` table can be created:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Troubleshooting

### "Email not confirmed" Error
- Check that the user confirmed their email via the confirmation link
- Check the email address in `auth.users` table in Supabase dashboard

### Session Not Persisting
- Ensure middleware.ts is running
- Check that cookies are being set in browser
- Verify environment variables are correct

### Redirect Not Working
- Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
- Ensure `/auth/callback` route exists

## Security Notes

1. **Row Level Security (RLS)**: When creating tables that store user data, always enable RLS
2. **Service Role Key**: Keep this secret - it bypasses RLS and should only be used server-side
3. **Anon Key**: Safe to expose in frontend, limited to public access
4. **Email Confirmation**: Adds security layer but requires email service

## Next Steps

To enhance the authentication system:
1. Create user profile table with additional user info
2. Add profile picture upload functionality
3. Implement password reset flow
4. Add social login (Google, GitHub, etc.)
5. Implement two-factor authentication
