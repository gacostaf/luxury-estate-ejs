import { Link } from 'react-router-dom'
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';

import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Home
} from 'lucide-react'

import type { AgencyCardDTO } from '@/types/agency'

interface AgencyCardProps {
  agency: AgencyCardDTO
}

export function AgencyCard({
  agency,
}: AgencyCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            agency.coverImageUrl ||
            'https://placehold.co/1200x500?text=Agency'
          }
          alt={agency.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Logo */}
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
            <img
              src={
                agency.logoUrl ||
                'https://placehold.co/200x200?text=Logo'
              }
              alt={agency.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-[#C6A15B]">
              {agency.name}
            </h3>

            {agency.foundedYear && (
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-[#C6A15B]">
                Established {agency.foundedYear}
              </p>
            )}
          </div>

          <Building2 className="h-8 w-8 text-[#C6A15B] shrink-0" />
        </div>

        {agency.description && (
          <p className="mt-6 line-clamp-3 text-sm leading-7 text-slate-600">
            {agency.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#C6A15B]" />

              <p className="text-2xl font-bold text-slate-900">
                {agency.associateCount || 0}
              </p>
            </div>

            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
              Associates
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#C6A15B]" />

              <p className="text-2xl font-bold text-slate-900">
                {agency.listingCount || 0}
              </p>
            </div>

            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
              Listings
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
          {(agency.city || agency.state) && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span>
                {agency.city}
                {agency.city && agency.state
                  ? ', '
                  : ''}
                {agency.state}
              </span>
            </div>
          )}

          {agency.phone && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span>{agency.phone}</span>
            </div>
          )}

          {agency.email && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span className="truncate">
                {agency.email}
              </span>
            </div>
          )}

          {agency.websiteUrl && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Globe className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <a
                href={agency.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:text-[#C6A15B] transition-colors"
              >
                {agency.websiteUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            {agency.socials?.facebook && (
              <a
                href={agency.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            )}

            {agency.socials?.instagram && (
              <a
                href={agency.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            )}

            {agency.socials?.linkedin && (
              <a
                href={agency.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-[#C6A15B] hover:text-white"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            )}
          </div>

          <Link
            to={`/agencies/${agency.slug}`}
            className="inline-flex items-center rounded-full bg-[#C6A15B] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            View Agency
          </Link>
        </div>
      </div>
    </div>
  )
}
