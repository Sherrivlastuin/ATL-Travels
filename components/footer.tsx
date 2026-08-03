'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2, Music2, Mail, Heart, LogIn } from 'lucide-react'
import AdminLoginModal from './admin-login-modal'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  return (
    <>
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <footer className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm">
                ATL
              </div>
              <div>
                <div className="font-bold text-lg">ATL TRAVELS</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-orange-200">
                  Luxury Escapes
                </div>
              </div>
            </Link>
            <p className="text-white/70 text-sm">
              Handpicked experiences and luxury travel curated for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#destinations"
                  className="text-white/70 hover:text-accent transition"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="#packages"
                  className="text-white/70 hover:text-accent transition"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  href="#flights"
                  className="text-white/70 hover:text-accent transition"
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-white/70 hover:text-accent transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                aria-label="Instagram"
              >
                <Share2 className="w-5 h-5" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                aria-label="TikTok"
              >
                <Music2 className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:atltravels@hotmail.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm">
              © {currentYear} ATL TRAVELS. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-white/70 text-sm flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for luxury
                travelers
              </p>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="p-2 rounded-full hover:bg-white/10 transition opacity-40 hover:opacity-100"
                aria-label="Admin login"
              >
                <LogIn className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
