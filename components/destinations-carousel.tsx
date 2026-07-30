'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const destinations = [
  {
    id: 1,
    location: 'Miami, FL',
    title: 'Yacht & Skyline Sunset',
    price: 189,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    location: 'Turks & Caicos',
    title: 'Floating Pool Villa Escape',
    price: 429,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    location: 'Jamaica',
    title: 'Horseback Beach Ride at Sunset',
    price: 129,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    location: 'Phuket',
    title: 'Phi Phi Islands Speedboat',
    price: 99,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    location: 'Cancun',
    title: 'Cenote & Tulum Private Tour',
    price: 159,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    location: 'Bali',
    title: 'Ubud Jungle Swing & Rice Terraces',
    price: 79,
    rating: '5.0',
    reviews: '2.4k',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  },
]

export default function DestinationsCarousel() {

  return (
    <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 section-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
          Top Rated Destinations
        </h2>
        <p className="text-primary font-semibold text-sm">
          Curated excursions with instant confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 section-reveal">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="group cursor-pointer"
          >
            <div className="relative h-64 rounded-3xl overflow-hidden mb-4">
              <img
                src={destination.image}
                alt={destination.location}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {destination.location}
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 backdrop-blur text-white flex items-center justify-center btn-icon">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="absolute bottom-4 left-4 bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                From ${destination.price}
              </div>
            </div>
            <h3 className="font-bold text-primary text-lg leading-tight mb-1">
              {destination.title}
            </h3>
            <p className="text-xs text-slate-500">
              {destination.rating} ★ ({destination.reviews}) · Instant confirmation
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
