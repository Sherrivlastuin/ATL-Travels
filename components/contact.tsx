'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center section-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
          Get In Touch
        </h2>
        <p className="text-slate-500 text-sm">
          We&apos;d love to hear from you and help plan your dream vacation
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 section-reveal">
        {/* Contact Info */}
        <div className="md:col-span-1">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Email</h4>
                <a
                  href="mailto:atltravels@hotmail.com"
                  className="text-slate-600 hover:text-accent transition"
                >
                  atltravels@hotmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Phone</h4>
                <a
                  href="tel:+17543423805"
                  className="text-slate-600 hover:text-accent transition"
                >
                  +1 754-342-3805
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Office</h4>
                <p className="text-slate-600">
                  Miami Beach 33105
                  <br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none font-bold text-slate-900"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-orange-200 outline-none resize-none font-bold text-slate-900"
                placeholder="Tell us about your dream vacation..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-accent text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:bg-accent-hover transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
