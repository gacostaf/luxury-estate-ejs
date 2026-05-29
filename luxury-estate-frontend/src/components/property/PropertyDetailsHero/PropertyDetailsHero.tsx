import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  Calendar,
  MapPin,
  Heart,
  Share2,
} from 'lucide-react'

import type { PropertyDetailsHeroDTO } from '@/types/property-details'

interface PropertyDetailsHeroProps {
  property: PropertyDetailsHeroDTO
}

function formatPrice(price?: number) {
  if (!price) {
    return 'Price Upon Request'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function PropertyDetailsHero({
  property,
}: PropertyDetailsHeroProps) {
  const heroImage =
    property.gallery?.[0]?.url ||
    'https://placehold.co/1600x900?text=Luxury+Property'

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Hero Image */}
      <div className="relative h-[85vh] min-h-[700px] overflow-hidden">
        <img
          src={heroImage}
          alt={property.title}
          className="h-full w-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              {/* Top Labels */}
              <div className="flex flex-wrap items-center gap-4">
                {property.propertyStatus && (
                  <span className="rounded-full bg-[#C6A15B] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg">
                    {property.propertyStatus.name}
                  </span>
                )}

                {property.propertyType && (
                  <span className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    {property.propertyType.name}
                  </span>
                )}

                {property.isFeatured && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    Featured Property
                  </span>
                )}
              </div>

              {/* Main Content */}
              <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                    {property.title}
                  </h1>

                  {/* Address */}
                  <div className="mt-6 flex items-center gap-3 text-lg text-slate-200">
                    <MapPin className="h-6 w-6 shrink-0 text-[#C6A15B]" />

                    <span>
                      {property.address?.streetAddress}
                      {property.address?.streetAddress
                        ? ', '
                        : ''}
                      {property.address?.addressLocality}
                      {property.address?.addressLocality &&
                      property.address?.addressRegion
                        ? ', '
                        : ''}
                      {property.address?.addressRegion}
                    </span>
                  </div>

                  {/* Property Stats */}
                  <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-5">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3 text-white">
                        <BedDouble className="h-6 w-6 text-[#C6A15B]" />

                        <div>
                          <p className="text-2xl font-bold">
                            {property.bedrooms || 0}
                          </p>

                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            Bedrooms
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3 text-white">
                        <Bath className="h-6 w-6 text-[#C6A15B]" />

                        <div>
                          <p className="text-2xl font-bold">
                            {property.bathrooms || 0}
                          </p>

                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            Bathrooms
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3 text-white">
                        <Car className="h-6 w-6 text-[#C6A15B]" />

                        <div>
                          <p className="text-2xl font-bold">
                            {property.garages || 0}
                          </p>

                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            Garages
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3 text-white">
                        <Ruler className="h-6 w-6 text-[#C6A15B]" />

                        <div>
                          <p className="text-2xl font-bold">
                            {property.areaSqFt || 0}
                          </p>

                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            Sq Ft
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3 text-white">
                        <Calendar className="h-6 w-6 text-[#C6A15B]" />

                        <div>
                          <p className="text-2xl font-bold">
                            {property.yearBuilt || '-'}
                          </p>

                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            Built
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
                      Property Price
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-white">
                      {formatPrice(property.price)}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="mt-10 flex gap-4">
                    <button className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#C6A15B] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90">
                      Contact Agent
                    </button>

                    <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20">
                      <Heart className="h-5 w-5" />
                    </button>

                    <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Associate */}
                  {property.associate && (
                    <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white/10">
                        <img
                          src={
                            property.associate.avatarUrl ||
                            'https://placehold.co/200x200?text=Agent'
                          }
                          alt={`${property.associate.firstName} ${property.associate.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm uppercase tracking-wide text-slate-300">
                          Listed By
                        </p>

                        <h3 className="mt-2 text-xl font-semibold text-white">
                          {property.associate.firstName}{' '}
                          {property.associate.lastName}
                        </h3>

                        {property.agency && (
                          <p className="mt-1 text-sm text-slate-300">
                            {property.agency.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
