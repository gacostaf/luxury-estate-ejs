import { Link } from 'react-router-dom'

import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  MapPin,
} from 'lucide-react'

import type { PropertyCardDTO } from '@/types/property'

interface PropertyCardProps {
  property: PropertyCardDTO
}

function formatPrice(price?: number) {
  if (!price) return 'Price Upon Request'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={
            property.featuredImage ||
            'https://placehold.co/800x600?text=Property'
          }
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-5 top-5 flex items-center gap-2">
          {property.propertyStatus && (
            <span className="rounded-full bg-[#C6A15B] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
              {property.propertyStatus.name}
            </span>
          )}

          {property.isFeatured && (
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-white drop-shadow-md">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" />

          <span>
            {property.address?.addressLocality}
            {property.address?.addressLocality &&
            property.address?.addressRegion
              ? ', '
              : ''}
            {property.address?.addressRegion}
          </span>
        </div>

        <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-slate-900 transition-colors group-hover:text-[#C6A15B]">
          {property.title}
        </h3>

        <div className="mt-6 grid grid-cols-2 gap-y-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-slate-600">
            <BedDouble className="h-5 w-5 text-[#C6A15B]" />

            <span className="text-sm font-medium">
              {property.bedrooms || 0}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Bath className="h-5 w-5 text-[#C6A15B]" />

            <span className="text-sm font-medium">
              {property.bathrooms || 0}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Car className="h-5 w-5 text-[#C6A15B]" />

            <span className="text-sm font-medium">
              {property.garages || 0}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Ruler className="h-5 w-5 text-[#C6A15B]" />

            <span className="text-sm font-medium">
              {property.areaSqFt || 0} sqft
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
          <div>
            {property.associate && (
              <p className="text-sm font-medium text-slate-700">
                {property.associate.firstName}{' '}
                {property.associate.lastName}
              </p>
            )}

            {property.agency && (
              <p className="text-xs text-slate-500 mt-1">
                {property.agency.name}
              </p>
            )}
          </div>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition-colors group-hover:bg-[#C6A15B] group-hover:text-white">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}
