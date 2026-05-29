import { Link } from 'react-router-dom'

import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

import { theme } from '@/templates/default/theme'

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src={theme.logo}
              alt="Lead Authority"
              className="h-14 w-auto object-contain mb-6"
            />

            <p className="text-sm leading-7 text-slate-300">
              Luxury real estate platform connecting buyers,
              sellers, agencies, and associates through a
              premium digital experience.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-[#C6A15B] hover:text-[#C6A15B]"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-[#C6A15B] hover:text-[#C6A15B]"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-[#C6A15B] hover:text-[#C6A15B]"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/listings" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  Listings
                </Link>
              </li>

              <li>
                <Link to="/agencies" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  Agencies
                </Link>
              </li>

              <li>
                <Link to="/associates" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  Associates
                </Link>
              </li>

              <li>
                <Link to="/news" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  News
                </Link>
              </li>

              <li>
                <Link to="/contact" className="text-sm text-slate-300 hover:text-[#C6A15B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              Contact Info
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C6A15B] mt-1 shrink-0" />

                <p className="text-sm text-slate-300 leading-6">
                  Mexico City, Mexico
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#C6A15B] shrink-0" />

                <p className="text-sm text-slate-300">
                  +52 55 0000 0000
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#C6A15B] shrink-0" />

                <p className="text-sm text-slate-300">
                  info@lead-authority.com
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">
              Newsletter
            </h3>

            <p className="text-sm text-slate-300 leading-7 mb-6">
              Subscribe to receive luxury property updates,
              market insights, and exclusive listings.
            </p>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#C6A15B]"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#C6A15B] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 text-center md:text-left">
            © {new Date().getFullYear()} Lead Authority. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-slate-400 hover:text-[#C6A15B] transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-of-service"
              className="text-sm text-slate-400 hover:text-[#C6A15B] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
