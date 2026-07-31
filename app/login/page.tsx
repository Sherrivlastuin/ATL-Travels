'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams?.get('mode')
    if (mode === 'signup') {
      setIsSignup(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        // Sign up endpoint
        const response = await fetch('http://localhost:3001/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password,
            first_name: name,
            is_admin: isAdmin
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Sign up failed')
          return
        }

        // Store token
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect to dashboard
        router.push('/user/dashboard')
      } else {
        // Login endpoint
        const endpoint = isAdmin ? '/api/auth/admin-login' : '/api/auth/login'
        const response = await fetch(`http://localhost:3001${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Login failed')
          return
        }

        // Store token
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect based on user type
        if (data.user?.is_admin) {
          router.push('/admin/dashboard')
        } else {
          router.push('/user/dashboard')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-800 font-bold mb-8 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="ATL Travels"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
            {isSignup ? 'Create Account' : 'Login'}
          </h1>
          <p className="text-slate-800 font-bold text-center mb-8">
            {isSignup ? 'Join ATL Travels today' : 'Welcome back'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-bold text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Name Field - Show only for signup */}
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none font-bold text-slate-900 placeholder:text-slate-500"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            {/* Admin Toggle - Show only for login */}
            {!isSignup && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-800"
                />
                <label htmlFor="isAdmin" className="text-sm font-bold text-slate-900">
                  Login as Admin
                </label>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none font-bold text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none font-bold text-slate-900 placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-700 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-lg"
            >
              {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Demo Credentials - Show only for login */}
          {!isSignup && (
            <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-xl mb-6">
              <p className="text-xs font-bold text-slate-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-slate-800 font-semibold">Email: atltravels@hotmail.com</p>
              <p className="text-xs text-slate-800 font-semibold">Password: atltravels</p>
            </div>
          )}

          {/* Toggle Sign Up / Login */}
          <p className="text-center text-slate-800 font-bold text-sm">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-accent hover:text-accent-hover font-bold"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center"><div className="text-slate-800 font-bold">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  )
}
