'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, BookOpen, MessageSquare, User, ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  flight_id: string
  passengers: number
  status: string
  total_price: number
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Redirect admins to admin dashboard
    if (parsedUser.is_admin === true) {
      router.push('/admin/dashboard')
      return
    }

    setUser(parsedUser)
    fetchBookings(token)
  }, [router])

  const fetchBookings = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setBookings(data.data || [])
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-accent/30 animate-spin mx-auto mb-4"></div>
          <p className="text-primary font-bold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Welcome, {user?.email}!</h1>
            <p className="text-primary font-semibold">Manage your bookings and profile</p>
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
                <p className="text-sm font-semibold text-primary mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-primary">{bookings.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-accent/20" />
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-primary">
                  ${bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toFixed(0)}
                </p>
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
              <p className="text-sm font-semibold text-primary mb-1">Book New Flight</p>
              <p className="text-lg font-bold text-accent">Browse Flights</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </Link>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
          <h2 className="text-2xl font-bold text-primary mb-6">Your Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-primary font-semibold mb-6">No bookings yet</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-white font-bold hover:bg-accent-hover transition"
              >
                Browse Flights
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-slate-200 rounded-2xl hover:border-accent transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary font-bold mb-1">Booking ID: {booking.id.slice(0, 8)}...</p>
                      <p className="text-sm text-primary font-semibold">
                        {booking.passengers} {booking.passengers === 1 ? 'Passenger' : 'Passengers'} • ${booking.total_price}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
