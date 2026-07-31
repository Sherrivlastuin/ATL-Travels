'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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
      if (isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:opacity-70 transition">
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

          <h1 className="text-3xl font-bold text-primary text-center mb-2">Login</h1>
          <p className="text-primary font-semibold text-center mb-8">
            Sign in to your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 mb-8">
            {/* Admin Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-accent"
              />
              <label htmlFor="isAdmin" className="text-sm font-semibold text-primary">
                Login as Admin
              </label>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-600 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-accent text-white font-bold text-base shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
            <p className="text-xs font-bold text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-800 font-semibold">Email: atltravels@hotmail.com</p>
            <p className="text-xs text-blue-800 font-semibold">Password: atltravels</p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-primary font-semibold text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent hover:text-accent-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
