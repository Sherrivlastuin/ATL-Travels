# ATL Travels - Vercel Production Deployment Guide

## Quick Deployment Checklist

### Phase 1: Prepare for Deployment

- [ ] Commit any local changes: `git add . && git commit -m "Final production changes"`
- [ ] Push to GitHub main branch: `git push origin main`
- [ ] Verify all changes are on GitHub: https://github.com/Sherrivlastuin/ATL-Travels

### Phase 2: Frontend Deployment to Vercel

#### Option A: Automatic Deployment (Recommended)
1. The repository is already connected to Vercel
2. Simply push changes to `main` branch
3. Vercel automatically builds and deploys
4. View at: https://atl-travels.vercel.app

#### Option B: Manual Deployment from Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select "ATL-Travels" project
3. Click "Redeploy" button
4. Wait for build completion

### Phase 3: Configure Environment Variables in Vercel

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_API_URL=your_backend_api_url (e.g., https://atl-travels-api.herokuapp.com)
NODE_ENV=production
```

**Where to find Supabase variables:**
1. Go to https://app.supabase.com
2. Select your ATL-Travels project
3. Settings → API
4. Copy `Project URL` and `anon public key`

### Phase 4: Backend Deployment

Your Express backend needs separate hosting. Choose one:

#### A. Heroku (Simplest)
```bash
# 1. Create Heroku account at https://www.heroku.com
# 2. Install Heroku CLI
# 3. Login: heroku login
# 4. Create app: heroku create atl-travels-api
# 5. Add Supabase env vars: heroku config:set SUPABASE_URL=... etc
# 6. Deploy: git push heroku main
# 7. Get URL: heroku open (your production backend URL)
```

#### B. Railway.app
1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Configure environment variables
5. Auto-deploys on push to main

#### C. Render.com
1. Sign up at https://render.com
2. Create new "Web Service"
3. Connect GitHub repository
4. Set build command: `npm install` or `pnpm install`
5. Set start command: `node server.js`
6. Add environment variables
7. Deploy

### Phase 5: Update Backend URL in Frontend

After deploying backend, update API calls to use production URL.

**Files to update with your production API URL:**
- `app/login/page.tsx`
- `lib/actions/admin-auth.ts`
- `app/admin/dashboard/page.tsx`
- `app/user/dashboard/page.tsx`
- Any other files making API calls

Replace: `http://localhost:3001` → `https://your-backend-url.com`

### Phase 6: Testing Production Deployment

1. **Visit:** https://atl-travels.vercel.app
2. **Test Admin Login:**
   - Email: atltravels@hotmail.com
   - Password: atltravels
   - Should load admin dashboard
3. **Test User Signup:**
   - Create new account
   - Verify email works
   - Access user dashboard
4. **Check Vercel Analytics:**
   - https://vercel.com/dashboard/atl-travels/analytics

## Environment Variables Quick Reference

### Supabase Setup
- Project URL: From Supabase Dashboard → Settings → API
- Anon Key: From Supabase Dashboard → Settings → API
- Service Role Key: From Supabase Dashboard → Settings → API

### Backend Setup
- If using Heroku: `https://your-app-name.herokuapp.com`
- If using Railway: Check Railway dashboard for generated domain
- If using Render: Check Render dashboard for generated domain

## Troubleshooting

### Build Fails on Vercel
- Check build logs: https://vercel.com/dashboard/atl-travels/deployments
- Ensure Node version is compatible
- Check all environment variables are set

### API Calls Return 404
- Verify backend is deployed and running
- Check `NEXT_PUBLIC_API_URL` environment variable is correct
- Backend server must be accessible from Vercel

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify auth callback URL in Supabase matches production domain

## Deployment URLs

After deployment, these will be your production URLs:
- **Frontend:** https://atl-travels.vercel.app
- **Backend API:** Depends on hosting choice (Heroku/Railway/Render)
- **Admin Dashboard:** https://atl-travels.vercel.app/admin/dashboard
- **User Dashboard:** https://atl-travels.vercel.app/user/dashboard
- **Login Page:** https://atl-travels.vercel.app/login

## Next Steps

1. ✅ Commit all changes to main branch
2. ✅ Configure environment variables in Vercel
3. ✅ Deploy backend to chosen platform
4. ✅ Test production deployment
5. ✅ Monitor analytics and performance

---

**Need help?** Check these files for more details:
- [DEPLOYMENT_TO_PRODUCTION.md](./DEPLOYMENT_TO_PRODUCTION.md)
- [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md)
