import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// ============================================
// AUTH ROUTES
// ============================================

// Admin Sign Up (Create admin user)
app.post('/api/auth/admin-signup', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create auth user with Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { is_admin: true },
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Update profile to mark as admin
    await supabaseAdmin
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', data.user.id)

    res.status(201).json({
      message: 'Admin user created successfully',
      user: data.user,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// User Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: first_name || '',
          last_name: last_name || '',
          is_admin: false,
        },
      },
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Confirm email for testing
    if (data.user) {
      await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        email_confirm: true,
      })
    }

    res.status(201).json({
      message: 'User created successfully',
      user: data.user,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Get user profile to check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // Create JWT token
    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        is_admin: profile?.is_admin || false,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        is_admin: profile?.is_admin || false,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// FLIGHTS ROUTES (Admin Only)
// ============================================

// Get all flights
app.get('/api/flights', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .order('departure_date', { ascending: true })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single flight
app.get('/api/flights/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create flight (Admin only)
app.post('/api/flights', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.user.id)
      .single()

    if (!profile?.is_admin) {
      return res.status(403).json({ error: 'Only admins can create flights' })
    }

    const {
      airline,
      departure_city,
      arrival_city,
      departure_date,
      arrival_date,
      price,
      available_seats,
      duration,
      stops,
    } = req.body

    if (
      !airline ||
      !departure_city ||
      !arrival_city ||
      !departure_date ||
      !arrival_date ||
      !price
    ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('flights').insert({
      airline,
      departure_city,
      arrival_city,
      departure_date,
      arrival_date,
      price: parseFloat(price),
      available_seats: parseInt(available_seats) || 100,
      duration,
      stops,
      created_by: req.user.id,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Flight created successfully',
      flight: data,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update flight (Admin only)
app.put('/api/flights/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.user.id)
      .single()

    if (!profile?.is_admin) {
      return res.status(403).json({ error: 'Only admins can update flights' })
    }

    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('flights')
      .update(updates)
      .eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      message: 'Flight updated successfully',
      flight: data,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete flight (Admin only)
app.delete('/api/flights/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.user.id)
      .single()

    if (!profile?.is_admin) {
      return res.status(403).json({ error: 'Only admins can delete flights' })
    }

    const { id } = req.params

    const { error } = await supabase.from('flights').delete().eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Flight deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// BOOKINGS ROUTES
// ============================================

// Get user bookings
app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create booking
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const { flight_id, passengers, total_price } = req.body

    if (!flight_id || !passengers || !total_price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('bookings').insert({
      user_id: req.user.id,
      flight_id,
      passengers: parseInt(passengers),
      total_price: parseFloat(total_price),
      status: 'confirmed',
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: data,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// MESSAGES ROUTES
// ============================================

// Get user messages
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Send message
app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const { recipient_id, subject, body } = req.body

    if (!recipient_id || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('messages').insert({
      sender_id: req.user.id,
      recipient_id,
      subject,
      body,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: data,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark message as read
app.put('/api/messages/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Message marked as read', data: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// MEDIA ROUTES
// ============================================

// Upload media
app.post('/api/media/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const fileName = `${req.user.id}/${Date.now()}-${req.file.originalname}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      })

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(fileName)

    // Save media record to database
    const { data, error } = await supabase.from('media').insert({
      user_id: req.user.id,
      file_url: publicUrl,
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      media: data,
      url: publicUrl,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user media
app.get('/api/media', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Backend Error]', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[v0] Backend server running on http://localhost:${PORT}`)
  console.log(`[v0] Supabase connected: ${supabaseUrl}`)
})

export default app
