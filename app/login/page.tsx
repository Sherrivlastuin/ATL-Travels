'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
      const supabase = createClient()

      if (isSignup) {
        // Sign up
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
              `${window.location.origin}/auth/callback`,
          },
        })

        if (signupError) {
          if (signupError.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.')
          } else if (signupError.message.includes('weak password')) {
            setError('Password is too weak. Please use a stronger password.')
          } else {
            setError(signupError.message || 'Sign up failed')
          }
          return
        }

        // Show success message
        setError('')
        router.push('/auth/sign-up-success?email=' + encodeURIComponent(email))
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError('Invalid email or password')
          return
        }

        if (data.user) {
          // Redirect to user dashboard
          router.push('/user/dashboard')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Auth error:', err)
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

          {/* Toggle Sign Up / Login */}
          <p className="text-center text-slate-800 font-bold text-sm">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError('')
              }}
              className="text-blue-600 hover:text-blue-700 font-bold"
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
