import { NavLink } from 'react-router-dom'

import { X } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Listings',
    href: '/listings',
  },
  {
    label: 'Agencies',
    href: '/agencies',
  },
  {
    label: 'Associates',
    href: '/associates',
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

export function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      className={`
        fixed inset-0 z-[60] bg-black/50 transition-opacity
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
    >
      <div
        className={`
          absolute top-0 right-0 h-full w-[320px] bg-white
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Menu
          </h2>

          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-900" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="border-b border-slate-100 py-4 text-base font-medium text-slate-700"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 pt-6 flex flex-col gap-4">
          <NavLink
            to="/login"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            onClick={onClose}
            className="rounded-xl bg-[#C6A15B] px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Register
          </NavLink>
        </div>
      </div>
    </div>
  )
}