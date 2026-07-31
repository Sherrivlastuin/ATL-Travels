'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowLeft, Plane, MapPin, Calendar, Users } from 'lucide-react'

interface Flight {
  id: string
  airline: string
  departure_city: string
  arrival_city: string
  departure_date: string
  arrival_date: string
  price: number
  available_seats: number
  duration?: string
  stops?: string
}

export default function BookingsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/flights')
      const data = await response.json()
      setFlights(data.data || [])
    } catch (err) {
      console.error('Failed to fetch flights:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (flight: Flight) => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      setBookingMessage('Please login to book a flight')
      setTimeout(() => window.location.href = '/login', 2000)
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flight_id: flight.id,
          passengers,
          total_price: flight.price * passengers,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingMessage('Booking successful! Redirecting to your dashboard...')
        setSelectedFlight(null)
        setTimeout(() => window.location.href = '/user/dashboard', 2000)
      } else {
        setBookingMessage(data.message || 'Booking failed')
      }
    } catch (err) {
      setBookingMessage('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-70 transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-primary mb-2">Available Flights</h1>
          <p className="text-primary font-semibold mb-12">Browse and book your next adventure</p>

          {/* Success Message */}
          {bookingMessage && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-bold">{bookingMessage}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-accent border-t-accent/30 animate-spin mx-auto mb-4"></div>
              <p className="text-primary font-bold">Loading flights...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {flights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition">
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    {/* Airline */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Airline</p>
                      <p className="text-xl font-bold text-primary">{flight.airline}</p>
                    </div>

                    {/* Route */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Route</p>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-lg font-bold text-primary">{flight.departure_city}</p>
                          <p className="text-xs text-primary font-semibold">{new Date(flight.departure_date).toLocaleDateString()}</p>
                        </div>
                        <Plane className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-lg font-bold text-primary">{flight.arrival_city}</p>
                          <p className="text-xs text-primary font-semibold">{new Date(flight.arrival_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Price per Seat</p>
                      <p className="text-3xl font-bold text-accent">${flight.price}</p>
                      <p className="text-xs text-primary font-semibold mt-1">{flight.available_seats} seats available</p>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => setSelectedFlight(flight)}
                      className="py-3 rounded-2xl bg-accent text-white font-bold hover:bg-accent-hover transition"
                    >
                      Book Now
                    </button>
                  </div>

                  {/* Details */}
                  {flight.duration && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-6 text-sm font-semibold text-primary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {flight.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="w-4 h-4" />
                        {flight.stops}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Booking Modal */}
          {selectedFlight && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl">
                <h2 className="text-2xl font-bold text-primary mb-6">Confirm Booking</h2>

                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Selected Flight:</p>
                  <p className="text-lg font-bold text-primary mb-1">
                    {selectedFlight.airline} - {selectedFlight.departure_city} to {selectedFlight.arrival_city}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    ${selectedFlight.price} per seat
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-primary mb-2">Number of Passengers</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-primary font-bold hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-primary w-12 text-center">{passengers}</span>
                    <button
                      onClick={() => setPassengers(passengers + 1)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-primary font-bold hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs font-bold text-blue-900 mb-1">TOTAL PRICE:</p>
                  <p className="text-3xl font-bold text-blue-900">
                    ${(selectedFlight.price * passengers).toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleBooking(selectedFlight)}
                    className="flex-1 py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setSelectedFlight(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-primary font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
