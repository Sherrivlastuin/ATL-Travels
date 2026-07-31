# ATL Travels Backend Setup Guide

## Overview

This backend is a Node.js/Express server that provides REST API endpoints for user authentication, flight management, bookings, messaging, and media uploads using Supabase.

## Features

- **Authentication**: User sign-up, login with JWT tokens
- **Admin Management**: Admin user creation and flight management
- **Flights**: CRUD operations for flight data (admin-only)
- **Bookings**: Users can book flights
- **Messaging**: Real-time messaging between users
- **Media Upload**: Upload media files to Supabase Storage

## Environment Variables

The backend uses the following environment variables (already configured):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
JWT_SECRET=your-secret-key-change-in-production
```

## Installation & Setup

### 1. Start the Backend Server

```bash
# Start backend in development mode
npm run dev:backend

# Or start both frontend and backend concurrently
npm run dev:all
```

The backend will run on `http://localhost:3001`

### 2. Initialize Admin User and Sample Data

```bash
# Run the setup script to create admin user and sample flights
node setup.js
```

This will:
- Create admin user with email: `atltravels@hotmail.com` and password: `atltravels`
- Add 6 sample flights with realistic travel data

## API Endpoints

### Authentication

#### Admin Sign Up
```
POST /api/auth/admin-signup
Body: { email, password }
```

#### User Sign Up
```
POST /api/auth/signup
Body: { email, password, first_name, last_name }
```

#### User Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### Flights (Admin Only)

#### Get All Flights
```
GET /api/flights
```

#### Get Single Flight
```
GET /api/flights/:id
```

#### Create Flight
```
POST /api/flights
Headers: Authorization: Bearer <token>
Body: {
  airline,
  departure_city,
  arrival_city,
  departure_date,
  arrival_date,
  price,
  available_seats,
  duration,
  stops
}
```

#### Update Flight
```
PUT /api/flights/:id
Headers: Authorization: Bearer <token>
Body: { ...update fields }
```

#### Delete Flight
```
DELETE /api/flights/:id
Headers: Authorization: Bearer <token>
```

### Bookings

#### Get User Bookings
```
GET /api/bookings
Headers: Authorization: Bearer <token>
```

#### Create Booking
```
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: {
  flight_id,
  passengers,
  total_price
}
```

### Messages

#### Get Messages
```
GET /api/messages
Headers: Authorization: Bearer <token>
```

#### Send Message
```
POST /api/messages
Headers: Authorization: Bearer <token>
Body: {
  recipient_id,
  subject,
  body
}
```

#### Mark Message as Read
```
PUT /api/messages/:id/read
Headers: Authorization: Bearer <token>
```

### Media Upload

#### Upload File
```
POST /api/media/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: { file }
```

#### Get User Media
```
GET /api/media
Headers: Authorization: Bearer <token>
```

## Database Schema

### tables
- **profiles**: User profiles with admin flag
- **flights**: Flight information
- **bookings**: User flight bookings
- **messages**: User messaging system
- **media**: Media file records

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **profiles**: Users can only view/update their own
- **flights**: Anyone can view, only admins can create/update/delete
- **bookings**: Users see their own, admins see all
- **messages**: Users see their sent/received messages
- **media**: Users see their own, admins see all

## Testing the API

### 1. Login as Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "atltravels@hotmail.com",
    "password": "atltravels"
  }'
```

### 2. Get All Flights
```bash
curl http://localhost:3001/api/flights
```

### 3. Create a New Flight (Admin)
```bash
curl -X POST http://localhost:3001/api/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "airline": "Air France",
    "departure_city": "Miami",
    "arrival_city": "Paris",
    "departure_date": "2024-02-15T10:00:00Z",
    "arrival_date": "2024-02-15T22:00:00Z",
    "price": 750,
    "available_seats": 200,
    "duration": "12h 00m",
    "stops": "Non-stop"
  }'
```

## File Structure

```
/vercel/share/v0-project/
├── server.js           # Main Express server with all API routes
├── setup.js            # Script to initialize admin and sample data
├── BACKEND_SETUP.md    # This documentation
├── package.json        # Updated with backend scripts
└── app/                # Next.js frontend
```

## Troubleshooting

### Port Already in Use
If port 3001 is already in use:
```bash
# Kill process on port 3001 (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 node server.js
```

### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Check that service role key has proper permissions
- Ensure RLS policies are enabled on all tables

### Admin User Not Created
- Check that the admin user email doesn't already exist
- Verify Supabase service role key has auth.admin permissions
- Run `node setup.js` again

## Production Deployment

Before deploying:

1. Change `JWT_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Enable HTTPS and set proper CORS origins
4. Use environment-specific database credentials
5. Set up proper error logging and monitoring

## Security Notes

- All protected routes require JWT token authentication
- Admin endpoints verify admin status via RLS policies
- Passwords are handled by Supabase Auth (never stored plaintext)
- File uploads are validated by file type and size
- CORS is configured for development; restrict in production

## Support

For issues or questions:
1. Check the Supabase dashboard for data consistency
2. Review server logs for error details
3. Verify JWT tokens are valid and not expired
4. Ensure all environment variables are properly set
