'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, BookOpen, ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  user_metadata?: {
    first_name?: string
  }
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [router])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        user_metadata: authUser.user_metadata,
      })
    } catch (err) {
      console.error('[v0] Auth check error:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('[v0] Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-blue-600/30 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-800 font-bold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome, {user.user_metadata?.first_name || user.email}!
            </h1>
            <p className="text-slate-700 font-semibold">Manage your bookings and profile</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-900">0</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-slate-900">$0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                $
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center justify-between hover:shadow-xl transition group"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Explore Destinations</p>
              <p className="text-lg font-bold text-blue-600">Browse Now</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </Link>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Bookings</h2>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-700 font-semibold mb-6">No bookings yet</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              Start Exploring
            </Link>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Email:</span>
              <span className="text-slate-900 font-bold">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-semibold">User ID:</span>
              <span className="text-slate-900 font-bold text-sm">{user.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
