'use client'

import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Header from '@/components/header'
import Hero from '@/components/hero'
import QuickCtas from '@/components/quick-ctas'
import DestinationsCarousel from '@/components/destinations-carousel'
import PartnerPromo from '@/components/partner-promo'
import Flights from '@/components/flights'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import Footer from '@/components/footer'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [revealElements, setRevealElements] = useState(false)

  useEffect(() => {
    // Animate section reveals
    const reveals = document.querySelectorAll('.section-reveal')
    
    reveals.forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 50%',
          scrub: false,
          markers: false,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <>
      <main className="w-full">
        <Header />
        <Hero />
        <QuickCtas />
        <DestinationsCarousel />
        <PartnerPromo />
        <Flights />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
      <Script
        id="chatway"
        src="https://cdn.chatway.app/widget.js?id=t0ySpmKryfXY"
        async
        strategy="lazyOnload"
      />
    </>
  )
}
