# Quick Verification Checklist

## Pre-Flight Checks (Before Starting Servers)

### Step 1: Dependencies Installed
```bash
npm list express cors @supabase/supabase-js jsonwebtoken bcryptjs
```
Expected: All packages listed with versions ✓

### Step 2: Environment Variables Set
```bash
cat /vercel/share/.env.project | grep SUPABASE
```
Expected: See SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY ✓

### Step 3: Backend File Exists
```bash
ls -la /vercel/share/v0-project/server.js
```
Expected: File exists, ~14KB size ✓

### Step 4: Dashboard Files Exist
```bash
ls -la /vercel/share/v0-project/app/*/dashboard/page.tsx
```
Expected: See admin and user dashboard files ✓

---

## Startup Sequence

### Terminal 1: Start Backend
```bash
cd /vercel/share/v0-project
npm run dev:backend
```

Wait for message:
```
Server running on http://localhost:3001
```

Check output:
- ✓ No error messages
- ✓ Port 3001 available
- ✓ Supabase connection initialized

### Terminal 2: Start Frontend
```bash
cd /vercel/share/v0-project
npm run dev
```

Wait for message:
```
▲ Next.js
○ Localhost:3000
```

Check output:
- ✓ No compilation errors
- ✓ Port 3000 available
- ✓ Build successful

---

## Functional Tests

### Test 1: Admin Dashboard Access (5 minutes)

**Step 1:** Open `http://localhost:3000/login` in browser

**Step 2:** Enter admin credentials:
- Email: `atltravels@hotmail.com`
- Password: `atltravels`

**Step 3:** Click "Sign In"

**Verification Points:**
- [ ] No error message appears
- [ ] Page redirects (watch URL change)
- [ ] URL becomes `http://localhost:3000/admin/dashboard`
- [ ] Page loads completely
- [ ] Can see "Flights Management" heading
- [ ] Can see flights list/table
- [ ] Can see "Add Flight" button
- [ ] Can see logout button

**If any fail:** Check browser console (F12) for errors

### Test 2: User Signup & Dashboard (5 minutes)

**Step 1:** Open `http://localhost:3000/login`

**Step 2:** Click "Create Account" link/button

**Step 3:** Fill signup form:
- Full Name: `Test User`
- Email: `testuser@example.com` (use unique email)
- Password: `TestPassword123!`

**Step 4:** Click "Create Account"

**Verification Points:**
- [ ] No error message appears
- [ ] Account created message or auto-login happens
- [ ] URL becomes `http://localhost:3000/user/dashboard`
- [ ] Page loads completely
- [ ] See welcome message with email
- [ ] Can see "Bookings" section
- [ ] Can see "Book New Flight" button
- [ ] Can see logout button

**If any fail:** Check backend logs for signup endpoint errors

### Test 3: Role-Based Access Control (3 minutes)

**Test 3A: Admin trying to access user dashboard**
1. Login as admin (from Test 1)
2. In browser URL bar, change URL to: `http://localhost:3000/user/dashboard`
3. Press Enter

**Expected:** 
- [ ] Redirects back to `/admin/dashboard`
- [ ] User dashboard never loads
- [ ] No error messages

**Test 3B: User trying to access admin dashboard**
1. Logout from admin account
2. Login as regular user (from Test 2)
3. In browser URL bar, change URL to: `http://localhost:3000/admin/dashboard`
4. Press Enter

**Expected:**
- [ ] Redirects back to `/user/dashboard`
- [ ] Admin dashboard never loads
- [ ] No error messages

### Test 4: Logout Functionality (2 minutes)

**Step 1:** While logged in to any dashboard, click "Logout" button

**Verification Points:**
- [ ] Logout button visible
- [ ] After clicking, redirects to home page
- [ ] localStorage cleared (check DevTools → Application → Storage)
- [ ] Can no longer access dashboard
- [ ] Trying to access dashboard redirects to login

### Test 5: Protected Route (2 minutes)

**Step 1:** Logout from all accounts

**Step 2:** Try to directly access `http://localhost:3000/admin/dashboard`

**Expected:**
- [ ] Immediately redirects to `/login`
- [ ] Cannot see any dashboard content

**Step 3:** Try to directly access `http://localhost:3000/user/dashboard`

**Expected:**
- [ ] Immediately redirects to `/login`
- [ ] Cannot see any dashboard content

---

## API Endpoint Tests

### Test 6: Login API Endpoint (2 minutes)

Open terminal and run:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "atltravels@hotmail.com",
    "password": "atltravels"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "some-uuid",
    "email": "atltravels@hotmail.com",
    "is_admin": true,
    "first_name": "Admin"
  }
}
```

**Verification Points:**
- [ ] Status 200 OK
- [ ] token field present
- [ ] user.is_admin is `true`
- [ ] user.email matches login email

### Test 7: Get Flights API Endpoint (2 minutes)

First, get a valid token from Test 6 above. Then run:
```bash
curl -X GET http://localhost:3001/api/flights \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

Replace `<YOUR_TOKEN_HERE>` with the token from Test 6.

**Expected Response:**
```json
{
  "data": [
    {
      "id": "flight-uuid",
      "airline": "Emirates",
      "departure_city": "Miami",
      "arrival_city": "Turks & Caicos",
      "price": 450,
      "available_seats": 50
    },
    ...
  ]
}
```

**Verification Points:**
- [ ] Status 200 OK
- [ ] data array contains flights
- [ ] Each flight has required fields
- [ ] flights list not empty (should have sample data)

---

## Dashboard Feature Tests

### Test 8: User Dashboard Features (3 minutes)

**While logged in as regular user:**

1. **View Bookings Section**
   - [ ] "My Bookings" section visible
   - [ ] Shows bookings list or "No bookings yet" message
   - [ ] Each booking shows date, status, price

2. **View Statistics**
   - [ ] Total bookings count displayed
   - [ ] Total spending amount displayed
   - [ ] Both numbers correct (0 for new user)

3. **Book New Flight Button**
   - [ ] Button visible
   - [ ] Clicking takes to booking page or shows booking interface

### Test 9: Admin Dashboard Features (3 minutes)

**While logged in as admin:**

1. **View Flights Section**
   - [ ] Flights list/table visible
   - [ ] Shows airline, routes, price, seats
   - [ ] At least 6 sample flights shown

2. **View Statistics**
   - [ ] Total flights count displayed
   - [ ] Total available seats count displayed
   - [ ] Numbers match flight data

3. **Add Flight Form**
   - [ ] "Add Flight" button visible
   - [ ] Form opens with input fields
   - [ ] Can enter flight data
   - [ ] Form validates inputs

4. **Delete Flight**
   - [ ] Delete button visible on each flight
   - [ ] Can click to remove flight
   - [ ] Flight disappears from list

---

## Troubleshooting Guide

### Backend Won't Start
**Error:** Port 3001 already in use
**Solution:** 
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
# Try again
npm run dev:backend
```

### Frontend Won't Start
**Error:** Port 3000 already in use
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
# Try again
npm run dev
```

### Login Fails with "Cannot fetch"
**Cause:** Backend not running
**Solution:** Make sure `npm run dev:backend` is running in first terminal

### Login Fails with "Invalid credentials"
**Cause:** Wrong email/password or admin user not in database
**Solution:** 
```bash
# Run setup to create admin user
node setup.js
```

### Redirects to Wrong Dashboard
**Cause:** is_admin field incorrect in database
**Solution:** Check database value:
```bash
# Via Supabase UI or:
psql -d postgres -h <host> -U postgres
SELECT email, is_admin FROM profiles;
```

### Console Shows "Cannot find module"
**Cause:** Dependencies not installed
**Solution:**
```bash
npm install
# Then restart servers
```

---

## Success Criteria

All tests pass when you can:

✅ **Login as Admin**
- Admin account logs in successfully
- Redirected to admin dashboard
- Can see flights management interface

✅ **Create User Account**
- Signup creates new user
- User automatically logged in
- Redirected to user dashboard
- Can see bookings interface

✅ **Access Control Works**
- Admins cannot access user dashboard
- Users cannot access admin dashboard
- Both redirected to correct dashboard

✅ **Logout Works**
- Logout clears session
- Cannot access dashboard after logout
- Must login again to access

✅ **Protected Routes**
- Cannot access dashboards without login
- Automatically redirected to login page
- JWT token properly validated

---

## Final Verification

Run this complete checklist:

- [ ] Backend running on :3001
- [ ] Frontend running on :3000
- [ ] Admin login works → admin dashboard
- [ ] User signup works → user dashboard
- [ ] Admin cannot access user dashboard
- [ ] User cannot access admin dashboard
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] API endpoints return correct data
- [ ] Dashboard features work correctly

**If all checks pass: ✅ Dashboard Access Fully Working!**

---

## Next Steps

Once everything is working:

1. **Deploy to production** - Set JWT_SECRET env var
2. **Test on deployed URL** - Verify endpoints point to production backend
3. **Set up monitoring** - Monitor login/logout and API calls
4. **Create more users** - Populate database with test accounts
5. **Test edge cases** - Expired tokens, invalid requests, etc.

---

## Support Resources

- `DASHBOARD_ACCESS_SETUP.md` - Detailed setup guide
- `AUTH_AND_DASHBOARD_INTEGRATION.md` - Architecture details
- `ARCHITECTURE_DIAGRAM.md` - System diagrams
- Backend logs - Check terminal output for errors
- Browser console - Check for frontend errors (F12)
