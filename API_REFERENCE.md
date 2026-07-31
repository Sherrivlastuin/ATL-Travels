# ATL Travels API Reference

## Base URL
```
http://localhost:3001
```

## Authentication

Most endpoints require a JWT token obtained from the login endpoint. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

#### GET /api/health
Check if the backend is running.

**Response:**
```json
{
  "status": "Backend is running"
}
```

---

## Authentication Endpoints

### POST /api/auth/admin-signup
Create an admin user account. This is typically only used for initial setup.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": "user-uuid",
    "email": "admin@example.com"
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/auth/admin-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

---

### POST /api/auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

---

### POST /api/auth/login
Log in a user and get an authentication token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "is_admin": false
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "atltravels@hotmail.com",
    "password": "atltravels"
  }'
```

---

## Flights Endpoints

### GET /api/flights
Get all available flights.

**Response (200):**
```json
[
  {
    "id": "flight-uuid",
    "airline": "Emirates",
    "departure_city": "Miami",
    "arrival_city": "Turks & Caicos",
    "departure_date": "2024-02-15T10:00:00Z",
    "arrival_date": "2024-02-15T13:00:00Z",
    "price": "450.00",
    "available_seats": 120,
    "duration": "3h 00m",
    "stops": "Non-stop",
    "created_at": "2024-01-20T12:00:00Z"
  }
]
```

**curl Example:**
```bash
curl http://localhost:3001/api/flights
```

---

### GET /api/flights/:id
Get details of a specific flight.

**Response (200):**
```json
{
  "id": "flight-uuid",
  "airline": "Emirates",
  "departure_city": "Miami",
  "arrival_city": "Turks & Caicos",
  "departure_date": "2024-02-15T10:00:00Z",
  "arrival_date": "2024-02-15T13:00:00Z",
  "price": "450.00",
  "available_seats": 120,
  "duration": "3h 00m",
  "stops": "Non-stop"
}
```

**curl Example:**
```bash
curl http://localhost:3001/api/flights/flight-uuid
```

---

### POST /api/flights
Create a new flight. **Admin only.**

**Required Headers:**
```
Authorization: Bearer <admin-token>
```

**Request:**
```json
{
  "airline": "Air France",
  "departure_city": "Miami",
  "arrival_city": "Paris",
  "departure_date": "2024-03-15T10:00:00Z",
  "arrival_date": "2024-03-15T22:00:00Z",
  "price": 750,
  "available_seats": 200,
  "duration": "12h 00m",
  "stops": "Non-stop"
}
```

**Response (201):**
```json
{
  "message": "Flight created successfully",
  "flight": {
    "id": "new-flight-uuid",
    "airline": "Air France",
    ...
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
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

---

### PUT /api/flights/:id
Update flight details. **Admin only.**

**Required Headers:**
```
Authorization: Bearer <admin-token>
```

**Request:**
```json
{
  "available_seats": 150,
  "price": 700
}
```

**Response (200):**
```json
{
  "message": "Flight updated successfully",
  "flight": {...}
}
```

**curl Example:**
```bash
curl -X PUT http://localhost:3001/api/flights/flight-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "available_seats": 150,
    "price": 700
  }'
```

---

### DELETE /api/flights/:id
Delete a flight. **Admin only.**

**Required Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "Flight deleted successfully"
}
```

**curl Example:**
```bash
curl -X DELETE http://localhost:3001/api/flights/flight-uuid \
  -H "Authorization: Bearer <token>"
```

---

## Bookings Endpoints

### GET /api/bookings
Get all bookings for the current user.

**Required Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "booking-uuid",
    "user_id": "user-uuid",
    "flight_id": "flight-uuid",
    "booking_date": "2024-01-20T12:00:00Z",
    "passengers": 2,
    "status": "confirmed",
    "total_price": "900.00",
    "flights": {
      "id": "flight-uuid",
      "airline": "Emirates",
      ...
    }
  }
]
```

**curl Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/bookings
```

---

### POST /api/bookings
Create a new flight booking.

**Required Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "flight_id": "flight-uuid",
  "passengers": 2,
  "total_price": 900
}
```

**Response (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-uuid",
    "user_id": "user-uuid",
    "flight_id": "flight-uuid",
    "passengers": 2,
    "status": "confirmed",
    "total_price": "900.00"
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "flight_id": "flight-uuid",
    "passengers": 2,
    "total_price": 900
  }'
```

---

## Messages Endpoints

### GET /api/messages
Get all messages for the current user (sent and received).

**Required Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "message-uuid",
    "sender_id": "sender-uuid",
    "recipient_id": "recipient-uuid",
    "subject": "Flight Booking Confirmation",
    "body": "Your booking has been confirmed...",
    "read": false,
    "created_at": "2024-01-20T12:00:00Z"
  }
]
```

**curl Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/messages
```

---

### POST /api/messages
Send a message to another user.

**Required Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "recipient_id": "recipient-uuid",
  "subject": "Flight Inquiry",
  "body": "I'm interested in the Miami to Turks & Caicos flight."
}
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "message-uuid",
    "sender_id": "user-uuid",
    "recipient_id": "recipient-uuid",
    "subject": "Flight Inquiry",
    "body": "I'm interested in the Miami to Turks & Caicos flight.",
    "read": false
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "recipient_id": "recipient-uuid",
    "subject": "Flight Inquiry",
    "body": "I am interested in booking a flight."
  }'
```

---

### PUT /api/messages/:id/read
Mark a message as read.

**Required Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Message marked as read",
  "data": {
    "id": "message-uuid",
    "read": true,
    ...
  }
}
```

**curl Example:**
```bash
curl -X PUT http://localhost:3001/api/messages/message-uuid/read \
  -H "Authorization: Bearer <token>"
```

---

## Media Upload Endpoints

### POST /api/media/upload
Upload a media file.

**Required Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: The file to upload (multipart file)

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "media": {
    "id": "media-uuid",
    "user_id": "user-uuid",
    "file_url": "https://...",
    "file_name": "document.pdf",
    "file_type": "application/pdf",
    "file_size": 1024000
  },
  "url": "https://..."
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.pdf"
```

---

### GET /api/media
Get all media files uploaded by the current user.

**Required Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "media-uuid",
    "user_id": "user-uuid",
    "file_url": "https://...",
    "file_name": "document.pdf",
    "file_type": "application/pdf",
    "file_size": 1024000,
    "created_at": "2024-01-20T12:00:00Z"
  }
]
```

**curl Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/media
```

---

## Error Handling

All endpoints return standard HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized:**
```json
{
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Only admins can create flights"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Testing Workflow

1. **Sign up a user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"user@test.com","password":"test123","first_name":"John","last_name":"Doe"}'
   ```

2. **Login as admin:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"atltravels@hotmail.com","password":"atltravels"}'
   ```
   Save the token from the response.

3. **Get all flights:**
   ```bash
   curl http://localhost:3001/api/flights
   ```

4. **Book a flight:**
   ```bash
   curl -X POST http://localhost:3001/api/bookings \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"flight_id":"<flight-id>","passengers":2,"total_price":900}'
   ```

5. **Send a message:**
   ```bash
   curl -X POST http://localhost:3001/api/messages \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"recipient_id":"<admin-uuid>","subject":"Booking Confirmed","body":"Thank you!"}'
   ```

6. **Upload media:**
   ```bash
   curl -X POST http://localhost:3001/api/media/upload \
     -H "Authorization: Bearer <token>" \
     -F "file=@passport.pdf"
   ```
