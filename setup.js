import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdminAndSampleData() {
  try {
    console.log('[v0] Setting up admin user and sample data...')

    // 1. Create admin user
    const adminEmail = 'atltravels@hotmail.com'
    const adminPassword = 'atltravels'

    console.log(`[v0] Creating admin user: ${adminEmail}`)

    const { data: existingAdmin, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .single()

    if (!checkError && existingAdmin) {
      console.log('[v0] Admin user already exists, skipping creation')
    } else {
      const { data: userData, error: signupError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { is_admin: true },
      })

      if (signupError) {
        console.error('[v0] Error creating admin user:', signupError)
      } else {
        console.log('[v0] Admin user created successfully:', userData.user.id)

        // Update profile to mark as admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', userData.user.id)

        if (profileError) {
          console.error('[v0] Error updating profile:', profileError)
        } else {
          console.log('[v0] Admin profile updated successfully')
        }
      }
    }

    // 2. Get admin user ID
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .single()

    if (!adminProfile) {
      console.error('[v0] Could not find admin profile')
      return
    }

    // 3. Add sample flights
    console.log('[v0] Adding sample flights...')

    const sampleFlights = [
      {
        airline: 'Emirates',
        departure_city: 'Miami',
        arrival_city: 'Turks & Caicos',
        departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        price: 450.0,
        available_seats: 120,
        duration: '3h 00m',
        stops: 'Non-stop',
        created_by: adminProfile.id,
      },
      {
        airline: 'British Airways',
        departure_city: 'Miami',
        arrival_city: 'Bali',
        departure_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
        price: 850.0,
        available_seats: 150,
        duration: '20h 30m',
        stops: '1 stop',
        created_by: adminProfile.id,
      },
      {
        airline: 'Delta Airlines',
        departure_city: 'Miami',
        arrival_city: 'Bahamas',
        departure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
        price: 280.0,
        available_seats: 180,
        duration: '1h 30m',
        stops: 'Non-stop',
        created_by: adminProfile.id,
      },
      {
        airline: 'Lufthansa',
        departure_city: 'Miami',
        arrival_city: 'Maldives',
        departure_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
        price: 950.0,
        available_seats: 100,
        duration: '18h 45m',
        stops: '1 stop',
        created_by: adminProfile.id,
      },
      {
        airline: 'Turkish Airlines',
        departure_city: 'Miami',
        arrival_city: 'Cancun',
        departure_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        price: 320.0,
        available_seats: 200,
        duration: '2h 00m',
        stops: 'Non-stop',
        created_by: adminProfile.id,
      },
      {
        airline: 'Singapore Airlines',
        departure_city: 'Miami',
        arrival_city: 'Thailand',
        departure_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        arrival_date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
        price: 1200.0,
        available_seats: 90,
        duration: '22h 00m',
        stops: '1 stop',
        created_by: adminProfile.id,
      },
    ]

    // Check if flights already exist
    const { data: existingFlights } = await supabase
      .from('flights')
      .select('id')
      .limit(1)

    if (existingFlights && existingFlights.length > 0) {
      console.log('[v0] Sample flights already exist, skipping...')
    } else {
      const { data: insertedFlights, error: flightError } = await supabase
        .from('flights')
        .insert(sampleFlights)

      if (flightError) {
        console.error('[v0] Error inserting flights:', flightError)
      } else {
        console.log(`[v0] Successfully created ${sampleFlights.length} sample flights`)
      }
    }

    console.log('[v0] Setup completed successfully!')
    console.log('[v0] Admin credentials:')
    console.log(`    Email: ${adminEmail}`)
    console.log(`    Password: ${adminPassword}`)
  } catch (error) {
    console.error('[v0] Setup error:', error)
  }
}

setupAdminAndSampleData()
