'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function adminLogin(email: string, password: string) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Verify the email matches the admin email
  if (email !== adminEmail) {
    return {
      error: 'Invalid credentials',
      success: false,
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        error: 'Invalid credentials',
        success: false,
      }
    }

    if (data.user) {
      // Verify this is the admin user
      if (data.user.email === adminEmail) {
        redirect('/admin/dashboard')
      } else {
        // Sign out non-admin user
        await supabase.auth.signOut()
        return {
          error: 'Access denied',
          success: false,
        }
      }
    }
  } catch (err) {
    return {
      error: 'An error occurred. Please try again.',
      success: false,
    }
  }
}
