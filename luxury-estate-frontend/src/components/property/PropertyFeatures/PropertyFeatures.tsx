import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  Waves,
  Dumbbell,
  MonitorSmartphone,
  Building2,
  Shield,
  Trees,
  Flame,
  Tv,
  Wine,
  Sun,
} from 'lucide-react'

import {
  PropertyFeaturesDTO,
} from '@/types/property-features'

interface PropertyFeaturesProps {
  features: PropertyFeaturesDTO
}

const amenityIcons: Record<string, any> = {
  Pool: Waves,
  Gym: Dumbbell,
  'Smart Home': MonitorSmartphone,
  Elevator: Building2,
  'Security System': Shield,
  Garden: Trees,
  Fireplace: Flame,
  'Home Theater': Tv,
  'Wine Cellar': Wine,
  'Solar Panels': Sun,
}

export function PropertyFeatures({
  features,
}: PropertyFeaturesProps) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[2fr_1fr]">
          {/* Main Features */}
          <div>
            <div>
              <span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Property Features
              </span>

              <h2 className="mt-6 text-4xl font-bold text-slate-900">
                Exceptional Features & Amenities
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Discover thoughtfully designed luxury amenities and premium features crafted for exceptional living.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {features.features.map((feature) => {
                const Icon =
                  amenityIcons[feature.name] ||
                  BedDouble

                return (
                  <div
                    key={feature.id}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#C6A15B]/30 hover:shadow-xl"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A15B]/10 text-[#C6A15B] transition-all group-hover:bg-[#C6A15B] group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-slate-900">
                      {feature.name}
                    </h3>

                    {feature.value && (
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {feature.value}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Amenities */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Luxury Amenities
              </h3>

              <div className="mt-8 space-y-4">
                {features.amenities.map((amenity) => {
                  const Icon =
                    amenityIcons[amenity] ||
                    BedDouble

                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6A15B]/10 text-[#C6A15B]">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="font-medium text-slate-800">
                        {amenity}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Energy Rating */}
            {features.energyRating && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">
                  Energy Rating
                </h3>

                <div className="mt-8 flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#C6A15B] text-5xl font-bold text-white shadow-lg">
                    {features.energyRating.value}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {features.energyRating.name}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      This property meets premium energy efficiency standards.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
