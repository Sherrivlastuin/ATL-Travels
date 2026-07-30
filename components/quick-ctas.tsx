import Link from 'next/link'
import { Mail, Eye, ArrowUpRight } from 'lucide-react'

export default function QuickCtas() {
  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="#contact"
          className="group bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 flex items-center justify-between card-hover border border-slate-100 hover:no-underline"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-primary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                Vacation Request Form
              </h4>
              <p className="text-sm font-semibold text-primary">Start planning today!</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center btn-icon">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          href="#contact"
          className="group bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 flex items-center justify-between card-hover border border-slate-100 hover:no-underline"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-primary text-sm uppercase tracking-wide">
                Join Our VIP List
              </h4>
              <p className="text-sm font-semibold text-primary">
                Add preferred airport or N/A
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center btn-icon">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </section>
  )
}
