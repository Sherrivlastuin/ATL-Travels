'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowLeft, MapPin, Calendar, Users, Star, DollarSign } from 'lucide-react'

interface DestinationInfo {
  name: string
  description: string
  highlights: string[]
  bestTime: string
  climate: string
  image: string
}

const destinations: { [key: string]: DestinationInfo } = {
  'turks-caicos': {
    name: 'Turks & Caicos',
    description: 'Experience pristine beaches with crystal-clear turquoise waters, world-class resorts, and perfect island vibes. Turks & Caicos is the ultimate luxury beach destination.',
    highlights: [
      'Grace Bay Beach - consistently ranked best in the world',
      'Snorkeling and diving opportunities',
      'Luxury resorts and private villas',
      'Relaxed Caribbean atmosphere',
      'Water sports and yacht charters',
    ],
    bestTime: 'December to April',
    climate: 'Tropical, warm year-round',
    image: 'https://images.unsplash.com/photo-1583885285754-8665a0203d67?auto=format&fit=crop&w=1200&q=85',
  },
  bali: {
    name: 'Bali, Indonesia',
    description: 'Discover tropical paradise with ancient temples, lush rice terraces, vibrant culture, and world-class resorts. Bali is perfect for both relaxation and adventure.',
    highlights: [
      'Ubud - cultural heart with art and traditions',
      'Seminyak Beach - trendy dining and nightlife',
      'Temple visits and spiritual experiences',
      'Volcano trekking and hiking',
      'Traditional Balinese massage and wellness',
    ],
    bestTime: 'April to October',
    climate: 'Tropical, monsoon season July-September',
    image: 'https://images.unsplash.com/photo-1537225228614-b4fad34a2b08?auto=format&fit=crop&w=1200&q=85',
  },
  bahamas: {
    name: 'Bahamas',
    description: 'Enjoy sunny days, sandy beaches, and vibrant culture just a short flight away. The Bahamas offers perfect getaways for families and couples.',
    highlights: [
      'Paradise Island - luxury resorts and casinos',
      'Thunderball Grotto - unique cenote swimming',
      'Swimming with pigs in Exuma',
      'Junkanoo Festival celebrations',
      'Excellent snorkeling and reef diving',
    ],
    bestTime: 'November to May',
    climate: 'Subtropical, warm and sunny',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=85',
  },
  maldives: {
    name: 'Maldives',
    description: 'Experience luxury overwater bungalows, pristine coral reefs, and world-class diving. The Maldives is the definition of paradise.',
    highlights: [
      'Over-water bungalows with ocean views',
      'World-class diving and snorkeling',
      'Bioluminescent beach walks',
      'Spa and wellness retreats',
      'Sunset dolphin cruises',
    ],
    bestTime: 'November to April',
    climate: 'Tropical monsoon, dry season best',
    image: 'https://images.unsplash.com/photo-1583512161515-5ff63faa3740?auto=format&fit=crop&w=1200&q=85',
  },
  cancun: {
    name: 'Cancun, Mexico',
    description: 'Explore white-sand beaches, Mayan ruins, vibrant nightlife, and all-inclusive resorts. Cancun is perfect for beach lovers and adventure seekers.',
    highlights: [
      'Beautiful Caribbean beaches',
      'Tulum Mayan ruins with ocean views',
      'Cenote swimming and exploration',
      'Cozumel island diving',
      'Vibrant nightlife and dining',
    ],
    bestTime: 'November to April',
    climate: 'Tropical, hurricane season Jun-Nov',
    image: 'https://images.unsplash.com/photo-1517842645770-c51eb3dd4e4f?auto=format&fit=crop&w=1200&q=85',
  },
  thailand: {
    name: 'Thailand',
    description: 'Discover ancient temples, beautiful islands, bustling markets, and authentic cuisine. Thailand offers incredible value and unforgettable experiences.',
    highlights: [
      'Bangkok temples and markets',
      'Phuket and Krabi islands',
      'Phi Phi Islands boat tours',
      'Thai massage and wellness',
      'Street food and dining experiences',
    ],
    bestTime: 'November to February',
    climate: 'Tropical, monsoon season May-Oct',
    image: 'https://images.unsplash.com/photo-1500595046-fun-activities-in-bali-indonesia?auto=format&fit=crop&w=1200&q=85',
  },
}

export default function DestinationDetailsPage() {
  const params = useParams()
  const slug = params?.slug as string
  const destination = destinations[slug] || destinations['turks-caicos']
  const [passengers, setPassengers] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 pt-32 pb-20">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-70 transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <h1 className="absolute bottom-8 left-8 text-5xl font-bold text-white">{destination.name}</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 mb-8">
                <p className="text-lg text-primary font-semibold leading-relaxed mb-6">{destination.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Best Time to Visit</p>
                    <p className="text-lg font-bold text-primary">{destination.bestTime}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-600 uppercase mb-2">Climate</p>
                    <p className="text-lg font-bold text-primary">{destination.climate}</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50">
                <h2 className="text-2xl font-bold text-primary mb-6">Highlights</h2>
                <ul className="space-y-4">
                  {destination.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                      <Star className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-primary font-semibold">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 h-fit">
              <h3 className="text-2xl font-bold text-primary mb-6">Plan Your Trip</h3>

              <div className="space-y-6 mb-8">
                {/* Passengers */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">Passengers</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-10 h-10 rounded-lg border border-slate-200 text-primary font-bold hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-primary w-8 text-center">{passengers}</span>
                    <button
                      onClick={() => setPassengers(passengers + 1)}
                      className="w-10 h-10 rounded-lg border border-slate-200 text-primary font-bold hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/bookings"
                  className="block w-full py-3 rounded-2xl bg-accent text-white font-bold text-center hover:bg-accent-hover transition"
                >
                  Book Flight
                </Link>
                <Link
                  href="/contact"
                  className="block w-full py-3 rounded-2xl border border-accent text-accent font-bold text-center hover:bg-orange-50 transition"
                >
                  Request Custom Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
