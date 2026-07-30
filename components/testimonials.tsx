import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Anderson',
      location: 'New York, USA',
      rating: 5,
      text: 'ATL Travels made our honeymoon absolutely perfect. The attention to detail was incredible!',
      initials: 'SA',
    },
    {
      id: 2,
      name: 'Michael Johnson',
      location: 'Los Angeles, USA',
      rating: 5,
      text: 'Best vacation planning service we\'ve ever used. Highly recommended for anyone seeking luxury travel!',
      initials: 'MJ',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Miami, USA',
      rating: 5,
      text: 'The experiences curated by ATL Travels were beyond our expectations. Pure paradise!',
      initials: 'ER',
    },
    {
      id: 4,
      name: 'James Wilson',
      location: 'Chicago, USA',
      rating: 5,
      text: 'Exceptional service and unforgettable memories. We\'re already planning our next trip!',
      initials: 'JW',
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 section-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
          What Our Travelers Say
        </h2>
        <p className="text-slate-500 text-sm">
          Real experiences from real travelers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 section-reveal">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 card-hover hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-orange-400 text-white flex items-center justify-center font-bold text-sm">
                {testimonial.initials}
              </div>
              <div>
                <h4 className="font-bold text-primary">{testimonial.name}</h4>
                <p className="text-xs text-slate-500">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              &quot;{testimonial.text}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
