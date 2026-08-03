'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignUpSuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') || ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center">
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

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">Account Created!</h1>
          <p className="text-slate-700 font-semibold mb-2">
            We&apos;ve sent a confirmation email to:
          </p>
          <p className="text-slate-900 font-bold mb-6 break-all">{email}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-slate-800 font-semibold">
              Please check your email and click the confirmation link to activate your account. You&apos;ll then be able to log in and access your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Back to Login
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    }>
      <SignUpSuccessContent />
    </Suspense>
  )
}
