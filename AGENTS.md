# AI Coding Agent Instructions for ATL Travels

Welcome! This guide helps you quickly understand the ATL Travels codebase and be productive immediately.

## 🎯 Project Overview

**ATL Travels** is a modern, full-stack luxury travel booking platform built with:
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Backend**: Node.js/Express REST API
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS v4 + GSAP animations
- **Package Manager**: pnpm

The application features luxury villa/hotel bookings, admin dashboards, user accounts, flight management, and real-time messaging.

## 🚀 Quick Start Commands

### Running the Application

```bash
# Install dependencies (one-time)
pnpm install

# Development mode - Run both frontend and backend
pnpm dev:all

# Or run separately in two terminals:
# Terminal 1 - Frontend (port 3000)
pnpm dev

# Terminal 2 - Backend (port 3001)
pnpm dev:backend

# Production build
pnpm build
pnpm start
```

**URLs for testing:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Login page: `http://localhost:3000/login`
- Admin dashboard: `http://localhost:3000/admin/dashboard`
- User dashboard: `http://localhost:3000/user/dashboard`

### Initialize Sample Data

```bash
# Create admin user and sample flights
node setup.js

# Admin credentials: atltravels@hotmail.com / atltravels
```

## 📁 Key Project Structure

```
app/                    # Next.js app router pages
├── page.tsx           # Landing page
├── layout.tsx         # Root layout with fonts
├── login/             # Login/signup page (client component)
├── admin/dashboard/   # Admin-only dashboard
├── user/dashboard/    # User-only dashboard
├── auth/              # Auth routes (callback, error, success)
├── bookings/          # Bookings page
└── destinations/      # Destination detail pages

components/           # React components (mostly client)
├── header.tsx        # Navigation/sticky header
├── hero.tsx          # Hero section with booking form
├── destinations-carousel.tsx
├── flights.tsx       # Flight deals section
├── testimonials.tsx  # Customer reviews
├── contact.tsx       # Contact form
└── footer.tsx        # Footer with links

lib/                  # Utilities and helpers
├── supabase/         # Supabase client setup
│   ├── client.ts     # Client-side Supabase instance
│   ├── server.ts     # Server-side Supabase instance (for actions)
│   └── proxy.ts      # Auth refresh handling
└── actions/          # Server actions
    └── admin-auth.ts # Admin authentication logic

server.js            # Express backend entry point
proxy.ts             # Auth proxy configuration
db/
├── migrations/       # PostgreSQL migration files
└── README.md         # Database schema docs

public/              # Static assets
scripts/             # Utility scripts
└── create-admin.ts  # Admin user creation
```

## 🔌 Core Patterns & Conventions

### 1. **Client vs Server Components**
- Pages are `'use client'` for interactivity
- Supabase client code: `lib/supabase/client.ts` for client components
- Server actions in `lib/actions/` for secure server-side logic
- `lib/supabase/server.ts` for server-only Supabase calls

```typescript
// Client component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
await supabase.auth.signIn(...)

// Server action
'use server'
import { createClient } from '@/lib/supabase/server'
```

### 2. **Authentication & Protected Routes**
- Supabase Auth for email/password authentication
- Admin users have special role in database
- Check user role before rendering dashboards
- JWT token stored in Supabase session
- Auth callback route: `/auth/callback` handles OAuth/email confirmations

**Key files:**
- `app/login/page.tsx` - Login/signup UI
- `lib/actions/admin-auth.ts` - Admin login logic
- `app/admin/dashboard/page.tsx` - Admin-protected page
- `app/user/dashboard/page.tsx` - User-protected page

### 3. **API Endpoints (Backend)**
All backend API routes are Express endpoints at `http://localhost:3001/api/`:

**Authentication:**
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-signup` - Admin signup

**Flights (admin-only):**
- `GET /api/flights` - List all flights
- `POST /api/flights` - Create flight (admin)
- `PUT /api/flights/:id` - Update flight (admin)
- `DELETE /api/flights/:id` - Delete flight (admin)

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:userId` - Get user's bookings

**Media:**
- `POST /api/upload` - Upload media to Supabase Storage

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for complete API reference.

### 4. **Styling**
- Tailwind CSS v4 with custom CSS variables
- Color scheme in `app/globals.css`:
  - Primary: `#0B1E3D` (Dark Blue)
  - Accent: `#F3723B` (Orange)
- GSAP for scroll animations in page components
- Glass morphism effects for UI elements
- Mobile-first responsive design

### 5. **TypeScript**
- Strict mode enabled
- Full type safety throughout
- Path alias: `@/*` resolves to root directory
- All components and API responses should be properly typed

## 🗄️ Database Schema Basics

Key tables in Supabase PostgreSQL:
- `users` - User accounts (managed by Supabase Auth)
- `admin_users` - Admin role tracking
- `flights` - Flight listings with pricing/details
- `bookings` - User flight bookings
- `messages` - Messaging between users
- `user_preferences` - User profile preferences

See [db/README.md](./db/README.md) for complete schema and [db/migrations/](./db/migrations/) for migration files.

## 🔐 Environment Variables

Required `.env.local` (should already be set up):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## 📋 Development Workflow

### Adding a New Feature

1. **Database changes?** → Create migration in `db/migrations/`
2. **API endpoint?** → Add route to `server.js`
3. **Frontend page?** → Create in `app/` with proper auth check
4. **Reusable component?** → Add to `components/`
5. **Server action?** → Add to `lib/actions/`
6. **Test credentials:** Admin: atltravels@hotmail.com / atltravels

### Common Tasks

**Protect a page for authenticated users only:**
```typescript
// app/my-page/page.tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export default function MyPage() {
  const supabase = createClient()
  // Check if user is authenticated
}
```

**Query Supabase on the server:**
```typescript
// lib/actions/my-action.ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function myAction() {
  const supabase = createClient()
  const { data } = await supabase.from('users').select()
}
```

**Add a new API endpoint:**
- Edit `server.js`
- Add route: `app.post('/api/my-endpoint', ...)` or similar
- Test at `http://localhost:3001/api/my-endpoint`

## ⚠️ Important Conventions & Pitfalls

| Issue | Solution |
|-------|----------|
| Supabase client not initialized in server context | Use `lib/supabase/server.ts` for server actions, not `client.ts` |
| Auth not persisting after refresh | Auth proxy in `proxy.ts` handles token refresh - should work automatically |
| CORS errors between frontend/backend | Backend already configured with CORS, use `http://localhost:3001` from frontend |
| Styling not applying | Ensure Tailwind config is loading - check `tailwind.config.ts` exists |
| Admin routes accessible to non-admins | Always verify user role in dashboards - check `admin_users` table |
| TypeScript errors on Supabase types | Install `@supabase/supabase-js` types - already in dependencies |

## 🔍 Debugging Tips

**Backend logs:** Check `server.js` console output (Terminal running `npm run dev:backend`)

**Frontend logs:** Browser DevTools console or VS Code terminal running `pnpm dev`

**Supabase issues:** Check [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md)

**Database issues:** See [db/README.md](./db/README.md)

**Deployment:** See [DEPLOYMENT_TO_PRODUCTION.md](./DEPLOYMENT_TO_PRODUCTION.md)

## 📚 Documentation Index

- [README.md](./README.md) - High-level overview and design system
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Complete API endpoint reference
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick commands and test accounts
- [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) - Auth configuration details
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - System architecture
- [db/README.md](./db/README.md) - Database schema documentation
- [DEPLOYMENT_TO_PRODUCTION.md](./DEPLOYMENT_TO_PRODUCTION.md) - Production deployment guide

## 💡 Next Steps for AI Agents

When starting work on this project:
1. ✅ Run `pnpm install` if dependencies aren't installed
2. ✅ Run `pnpm dev:all` to start both frontend and backend
3. ✅ Test login at `http://localhost:3000/login`
4. ✅ Identify which part of the stack needs changes (frontend/backend/database)
5. ✅ Follow the patterns established in similar files

**Common entry points for modifications:**
- Frontend page logic: `app/*/page.tsx`
- Reusable components: `components/*.tsx`
- Backend API routes: `server.js`
- Database queries: `lib/actions/*.ts` or `lib/supabase/server.ts`

---

*Last updated: 2026-08-05*
