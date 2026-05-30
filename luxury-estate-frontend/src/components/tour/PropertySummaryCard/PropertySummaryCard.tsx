import { Home, BedDouble, Bath, Maximize, MapPin } from 'lucide-react'

import type { TourPropertyDTO } from '@/types/tour'

interface Props {
  property: TourPropertyDTO
}

export function PropertySummaryCard({ property }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {property.featuredImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={property.featuredImage}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${property.price.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={14} />
              <span>
                {[property.address.addressLocality, property.address.addressRegion]
                  .filter(Boolean)
                  .join(', ') || 'Atlanta, GA'}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C6A15B]/10 px-3 py-1 text-xs font-semibold text-[#C6A15B]">
            <Home size={12} />
            {property.propertyStatus}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div className="text-center">
            <BedDouble size={18} className="mx-auto text-slate-400" />
            <p className="mt-1 text-sm font-semibold text-slate-900">{property.bedrooms}</p>
            <p className="text-xs text-slate-500">Beds</p>
          </div>
          <div className="text-center">
            <Bath size={18} className="mx-auto text-slate-400" />
            <p className="mt-1 text-sm font-semibold text-slate-900">{property.bathrooms}</p>
            <p className="text-xs text-slate-500">Baths</p>
          </div>
          <div className="text-center">
            <Maximize size={18} className="mx-auto text-slate-400" />
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {property.areaSqFt.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">ft&sup2;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
