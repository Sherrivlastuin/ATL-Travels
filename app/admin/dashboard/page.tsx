'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Plus, Edit2, Trash2, Plane } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Flight {
  id: string
  airline: string
  departure_city: string
  arrival_city: string
  price: number
  available_seats: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    airline: '',
    departure_city: '',
    arrival_city: '',
    departure_date: '',
    arrival_date: '',
    price: '',
    available_seats: '',
    duration: '',
    stops: '',
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchFlights(token)
  }, [router])

  const fetchFlights = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/flights', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setFlights(data.data || [])
    } catch (err) {
      console.error('Failed to fetch flights:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')

    try {
      const response = await fetch('http://localhost:3001/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          airline: '',
          departure_city: '',
          arrival_city: '',
          departure_date: '',
          arrival_date: '',
          price: '',
          available_seats: '',
          duration: '',
          stops: '',
        })
        setShowAddForm(false)
        fetchFlights(token || '')
      }
    } catch (err) {
      console.error('Failed to add flight:', err)
    }
  }

  const handleDeleteFlight = async (flightId: string) => {
    const token = localStorage.getItem('authToken')
    if (!window.confirm('Are you sure you want to delete this flight?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/flights/${flightId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchFlights(token || '')
      }
    } catch (err) {
      console.error('Failed to delete flight:', err)
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
          <p className="text-primary font-bold">Loading admin dashboard...</p>
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
            <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-primary font-semibold">Manage flights and bookings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Total Flights</p>
                <p className="text-3xl font-bold text-primary">{flights.length}</p>
              </div>
              <Plane className="w-12 h-12 text-accent/20" />
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Total Seats Available</p>
                <p className="text-3xl font-bold text-primary">
                  {flights.reduce((sum, f) => sum + (f.available_seats || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                🎫
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-accent rounded-3xl p-6 border border-accent text-white font-bold flex items-center justify-between hover:bg-accent-hover transition"
          >
            <span>Add New Flight</span>
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Add Flight Form */}
        {showAddForm && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Add New Flight</h2>
            <form onSubmit={handleAddFlight} className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Airline"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Departure City"
                value={formData.departure_city}
                onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Arrival City"
                value={formData.arrival_city}
                onChange={(e) => setFormData({ ...formData, arrival_city: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="datetime-local"
                placeholder="Departure Date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="datetime-local"
                placeholder="Arrival Date"
                value={formData.arrival_date}
                onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="number"
                placeholder="Available Seats"
                value={formData.available_seats}
                onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2h 30m)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
              />
              <input
                type="text"
                placeholder="Stops (e.g., Direct, 1 stop)"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition"
                >
                  Add Flight
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-primary font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Flights Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Flights</h2>
            {flights.length === 0 ? (
              <p className="text-primary font-semibold text-center py-8">No flights found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-bold text-primary">Airline</th>
                      <th className="text-left py-4 px-4 font-bold text-primary">Route</th>
                      <th className="text-left py-4 px-4 font-bold text-primary">Price</th>
                      <th className="text-left py-4 px-4 font-bold text-primary">Seats</th>
                      <th className="text-left py-4 px-4 font-bold text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-4 px-4 font-semibold text-primary">{flight.airline}</td>
                        <td className="py-4 px-4 font-semibold text-primary">
                          {flight.departure_city} → {flight.arrival_city}
                        </td>
                        <td className="py-4 px-4 font-bold text-accent">${flight.price}</td>
                        <td className="py-4 px-4 font-semibold text-primary">{flight.available_seats}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteFlight(flight.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
