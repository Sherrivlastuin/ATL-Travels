import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    const adminEmail = 'atltravels@hotmail.com'
    const adminPassword = 'atltravels'

    console.log(`Creating admin user with email: ${adminEmail}...`)

    // Create the user with admin privileges
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        is_admin: true,
      },
    })

    if (error) {
      console.error('Error creating admin user:', error.message)
      process.exit(1)
    }

    console.log('✓ Admin user created successfully!')
    console.log(`  Email: ${adminEmail}`)
    console.log(`  User ID: ${data.user.id}`)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createAdminUser()
