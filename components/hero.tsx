'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Minus, Plus, Mail, Share2, Music2 } from 'lucide-react'

export default function Hero() {
  const [guestCount, setGuestCount] = useState(2)
  const [formData, setFormData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', { ...formData, guests: guestCount })
  }

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div
        className="absolute inset-0 hero-bg transform scale-105"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E3D]/75 via-[#0B1E3D]/40 to-[#0B1E3D]/80" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="hero-text text-center lg:text-left">
            <p className="text-orange-300 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-4 animate-pulse">
              ATL TRAVELS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4">
              Your Next <br />
              <span className="font-serif italic font-normal text-orange-200">
                Dream Vacation
              </span>
            </h1>
            <p className="text-slate-100 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8 font-light">
              Handpicked villas, boutique hotels, and once-in-a-lifetime experiences curated by travel professionals.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-700 hover:text-accent hover:scale-110 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-700 hover:text-accent hover:scale-110 transition-all"
              >
                <Music2 className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:hello@atltravels.com"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-700 hover:text-accent hover:scale-110 transition-all"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
            <Link
              href="#booking"
              className="inline-flex items-center px-8 py-4 rounded-full bg-accent text-white font-bold tracking-wide shadow-xl shadow-orange-500/30 hover:bg-accent-hover hover:-translate-y-1 transition-all"
            >
              BOOK NOW
            </Link>
          </div>

          {/* Booking Card */}
          <div
            id="booking"
            className="hero-card glass rounded-[2rem] p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ATL
              </div>
              <div>
                <h3 className="font-bold text-primary">Start Planning Today</h3>
                <p className="text-xs text-primary font-semibold">Tell us where you&apos;re headed</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                  Where to?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Turks & Caicos, Bali, Miami..."
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none text-sm font-bold text-slate-900"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={formData.checkin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={formData.checkout}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkout: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                  Guests
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-sm font-bold text-slate-900">
                    {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-slate-900">
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-accent text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition-colors"
              >
                SEARCH GETAWAYS
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
