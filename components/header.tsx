'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Menu, X, LogIn, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsAdmin(parsedUser.is_admin || false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAdmin(false)
    router.push('/')
  }

  const navLinks = [
    { href: '#destinations', label: 'Destinations' },
    { href: '#packages', label: 'Packages' },
    { href: '#flights', label: 'Flights' },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="#" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="ATL Travels Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>

              {user ? (
                <>
                  <Link
                    href={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                    className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {isAdmin ? 'Admin' : 'My Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/bookings"
                    className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full bg-accent text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition-colors"
                  >
                    BOOK NOW
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] mt-20">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <span className="font-bold text-lg text-primary">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>
            <nav className="p-6 flex flex-col gap-4 text-lg font-medium text-slate-800">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 border-b border-slate-50 hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#booking"
                className="mt-4 inline-flex justify-center px-6 py-3 rounded-full bg-accent text-white font-semibold shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
