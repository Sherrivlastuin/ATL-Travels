import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function PartnerPromo() {
  return (
    <section id="packages" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-5 section-reveal">
        <div className="relative h-72 sm:h-80 rounded-[2rem] overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
            alt="Viator"
            className="w-full h-full object-cover img-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-5 left-5 bg-white/95 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Viator Partner
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h3 className="text-white text-3xl sm:text-4xl font-serif font-bold mb-2">
              viator
            </h3>
            <p className="text-white/80 text-xs uppercase tracking-widest mb-4">
              Over 400,000 experiences worldwide
            </p>
            <button className="px-6 py-2.5 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wide hover:bg-accent hover:text-white transition">
              Explore Viator
            </button>
          </div>
        </div>

        <div className="relative h-72 sm:h-80 rounded-[2rem] overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
            alt="Airbnb"
            className="w-full h-full object-cover img-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-5 left-5 bg-white/95 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Airbnb Partner
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h3 className="text-white text-3xl sm:text-4xl font-serif font-bold mb-2">
              airbnb
            </h3>
            <p className="text-white/80 text-xs uppercase tracking-widest mb-4">
              Unique stays around the globe
            </p>
            <button className="px-6 py-2.5 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wide hover:bg-accent hover:text-white transition">
              Browse Homes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
