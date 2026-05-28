import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Menu, X } from 'lucide-react'

import { theme } from '@/templates/default/theme'

import { Navigation } from './Navigation'

import { MobileMenu } from './MobileMenu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          isScrolled
            ? 'bg-white shadow-md py-3'
            : 'bg-transparent py-5'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={theme.logo}
              alt="Lead Authority"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">
            <Navigation />
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Register
            </Link>

            <Link
              to="/dashboard/properties/create"
              className="inline-flex items-center rounded-xl bg-[#C6A15B] px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              Submit Property
            </Link>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7 text-slate-900" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}