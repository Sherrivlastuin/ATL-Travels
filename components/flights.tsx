import Link from 'next/link'
import { Plane, MapPin, Calendar } from 'lucide-react'

export default function Flights() {
  const flights = [
    {
      id: 1,
      airline: 'Delta Airways',
      from: 'ATL',
      to: 'MIA',
      departure: '08:30',
      arrival: '10:15',
      duration: '1h 45m',
      price: '$245',
      stops: 'Non-stop',
    },
    {
      id: 2,
      airline: 'United Airlines',
      from: 'ATL',
      to: 'NYC',
      departure: '14:00',
      arrival: '16:30',
      duration: '2h 30m',
      price: '$189',
      stops: 'Non-stop',
    },
    {
      id: 3,
      airline: 'American Airlines',
      from: 'ATL',
      to: 'LAX',
      departure: '11:15',
      arrival: '14:45',
      duration: '5h 30m',
      price: '$320',
      stops: 'Non-stop',
    },
    {
      id: 4,
      airline: 'Southwest Airlines',
      from: 'ATL',
      to: 'DEN',
      departure: '09:45',
      arrival: '11:30',
      duration: '2h 45m',
      price: '$156',
      stops: 'Non-stop',
    },
  ]

  return (
    <section id="flights" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 section-reveal">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-3">
          Flights & Travel
        </h2>
        <p className="text-primary font-bold text-base">
          Best flight deals for your next adventure
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 section-reveal">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-hover hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-primary text-sm sm:text-base mb-2">
                  {flight.airline}
                </h3>
                <p className="text-sm font-semibold text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {flight.stops}
                </p>
              </div>
              <div className="text-right">
                <p className="text-accent font-bold text-lg">{flight.price}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div className="text-center flex-1">
                  <p className="font-bold text-primary text-lg">
                    {flight.from}
                  </p>
                  <p className="text-sm font-semibold text-primary">{flight.departure}</p>
                </div>
                <Plane className="w-5 h-5 text-slate-400 mx-3 rotate-90" />
                <div className="text-center flex-1">
                  <p className="font-bold text-primary text-lg">{flight.to}</p>
                  <p className="text-sm font-semibold text-primary">{flight.arrival}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-primary">
                <span>{flight.duration}</span>
                <Link href="/bookings" className="text-accent hover:text-accent-hover font-bold">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
