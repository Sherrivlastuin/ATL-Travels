# Quick Start Guide - ATL Travels Backend

## 🚀 Get Started in 2 Minutes

### 1. Start the Backend Server

```bash
# Option A: Backend only
npm run dev:backend

# Option B: Frontend + Backend (recommended)
npm run dev:all
```

**Backend URL:** `http://localhost:3001`  
**Frontend URL:** `http://localhost:3000`

### 2. Login as Admin

Use these credentials:
- **Email:** `atltravels@hotmail.com`
- **Password:** `atltravels`

### 3. Get Your API Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "atltravels@hotmail.com",
    "password": "atltravels"
  }'
```

Copy the `token` from the response.

---

## 📋 Essential Commands

### View All Flights
```bash
curl http://localhost:3001/api/flights
```

### Create a New Flight (Admin)
```bash
curl -X POST http://localhost:3001/api/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "airline": "Air France",
    "departure_city": "Miami",
    "arrival_city": "Paris",
    "departure_date": "2024-03-15T10:00:00Z",
    "arrival_date": "2024-03-15T22:00:00Z",
    "price": 750,
    "available_seats": 200,
    "duration": "12h 00m",
    "stops": "Non-stop"
  }'
```

### Create a User Account
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Book a Flight
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -d '{
    "flight_id": "FLIGHT_ID_HERE",
    "passengers": 2,
    "total_price": 900
  }'
```

### Get Your Bookings
```bash
curl -H "Authorization: Bearer USER_TOKEN_HERE" \
  http://localhost:3001/api/bookings
```

### Upload a File
```bash
curl -X POST http://localhost:3001/api/media/upload \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -F "file=@/path/to/your/file.pdf"
```

### Send a Message
```bash
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recipient_id": "RECIPIENT_USER_ID",
    "subject": "Flight Inquiry",
    "body": "I would like to book a flight to Paris."
  }'
```

---

## 📚 Documentation

- **Full API Reference:** See `API_REFERENCE.md`
- **Setup Guide:** See `BACKEND_SETUP.md`
- **Implementation Summary:** See `BACKEND_IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Sample Flights Available

The backend comes with 6 pre-loaded flights:

1. **Emirates** - Miami → Turks & Caicos ($450, 3h)
2. **British Airways** - Miami → Bali ($850, 20h 30m)
3. **Delta** - Miami → Bahamas ($280, 1h 30m)
4. **Lufthansa** - Miami → Maldives ($950, 18h 45m)
5. **Turkish Airlines** - Miami → Cancun ($320, 2h)
6. **Singapore Airlines** - Miami → Thailand ($1200, 22h)

View them with:
```bash
curl http://localhost:3001/api/flights
```

---

## 🔑 Key Features

- ✅ User authentication with JWT
- ✅ Admin flight management
- ✅ Flight booking system
- ✅ User messaging
- ✅ File uploads to cloud storage
- ✅ Row-level security (RLS)
- ✅ Complete REST API

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 3001 is in use
lsof -ti:3001 | xargs kill -9

# Then start again
npm run dev:backend
```

### Supabase connection error?
- Verify environment variables are set
- Check internet connection
- Ensure Supabase project is active

### Token expired?
- Get a new token by logging in again
- Tokens expire after 24 hours

### Admin user not working?
- Run: `node setup.js` to recreate
- Verify email: `atltravels@hotmail.com`
- Verify password: `atltravels`

---

## ✨ What's Next?

1. **Integrate with Frontend** - Connect React components to these API endpoints
2. **Add Payment Processing** - Integrate Stripe for flight payments
3. **Setup Email Notifications** - Send booking confirmations
4. **Deploy to Production** - Deploy backend to production server

---

## 📞 Need Help?

All endpoints return standard HTTP status codes:
- **200** - Success
- **201** - Created
- **400** - Bad Request (check your data)
- **401** - Unauthorized (check your token)
- **403** - Forbidden (admin only)
- **500** - Server Error (check logs)

Check the logs in your terminal for detailed error messages.

---

## 🎉 Ready to Go!

Your backend is ready to:
- Accept bookings
- Manage flights
- Handle user authentication
- Process media uploads
- Enable user communication

Start building amazing features on top of this!
