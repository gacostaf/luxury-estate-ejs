import { Link } from 'react-router-dom'
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';



import {
  Mail,
  Phone,
  MapPin,
  Building2
} from 'lucide-react'

import { type AssociateCardDTO } from '@/types/associate'

interface AssociateCardProps {
  associate: AssociateCardDTO
}

export function AssociateCard({
  associate,
}: AssociateCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <div className="aspect-[4/4.5] overflow-hidden bg-slate-100">
          <img
            src={
              associate.avatarUrl ||
              'https://placehold.co/600x700?text=Associate'
            }
            alt={`${associate.firstName} ${associate.lastName}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3">
            {associate.socials?.facebook && (
              <a
                href={associate.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#C6A15B]"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            )}

            {associate.socials?.instagram && (
              <a
                href={associate.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#C6A15B]"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            )}

            {associate.socials?.linkedin && (
              <a
                href={associate.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#C6A15B]"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-[#C6A15B]">
            {associate.firstName} {associate.lastName}
          </h3>

          {associate.title && (
            <p className="mt-2 text-sm uppercase tracking-wide text-[#C6A15B] font-semibold">
              {associate.title}
            </p>
          )}
        </div>

        {associate.bio && (
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">
            {associate.bio}
          </p>
        )}

        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
          {associate.agency && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Building2 className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span>{associate.agency.name}</span>
            </div>
          )}

          {(associate.city || associate.state) && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span>
                {associate.city}
                {associate.city && associate.state
                  ? ', '
                  : ''}
                {associate.state}
              </span>
            </div>
          )}

          {associate.phone && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span>{associate.phone}</span>
            </div>
          )}

          {associate.email && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="h-5 w-5 text-[#C6A15B] shrink-0" />

              <span className="truncate">
                {associate.email}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {associate.listingCount || 0}
            </p>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Listings
            </p>
          </div>

          <Link
            to={`/associates/${associate.slug}`}
            className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition-all group-hover:bg-[#C6A15B] group-hover:text-white"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
