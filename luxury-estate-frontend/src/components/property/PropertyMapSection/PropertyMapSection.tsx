import {
  MapPin,
  Navigation,
  Building2,
  GraduationCap,
  ShoppingBag,
  Trees,
} from 'lucide-react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'

import L from 'leaflet'

import type { PropertyMapSectionDTO } from '@/types/property-map'

interface PropertyMapSectionProps {
  property: PropertyMapSectionDTO
}

const propertyIcon = new L.Icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],

  iconAnchor: [12, 41],
})

const nearbyIcons: Record<string, React.ElementType> = {
  School: GraduationCap,
  Shopping: ShoppingBag,
  Park: Trees,
  Business: Building2,
}

export function PropertyMapSection({
  property,
}: PropertyMapSectionProps) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Map */}
          <div>
            <div>
              <span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Property Location
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Explore the Neighborhood
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Discover the property's location and nearby lifestyle destinations.
              </p>
            </div>

            {/* Map Container */}
            <div className="mt-12 overflow-hidden rounded-[32px] border border-slate-200 shadow-xl">
              <div className="h-[650px] w-full">
                <MapContainer
                  center={[
                    property.latitude,
                    property.longitude,
                  ]}
                  zoom={14}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[
                      property.latitude,
                      property.longitude,
                    ]}
                    icon={propertyIcon}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900">
                          {property.title}
                        </h3>

                        {property.address && (
                          <p className="text-sm text-slate-600">
                            {property.address}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Address Card */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A15B]/10 text-[#C6A15B] shrink-0">
                  <MapPin className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                    Property Address
                  </p>

                  <h3 className="mt-4 text-2xl font-bold text-slate-900 leading-tight">
                    {property.address}
                  </h3>
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Nearby Places
              </h3>

              <div className="mt-8 space-y-5">
                {property.nearbyPlaces?.map((place) => {
                  const Icon =
                    nearbyIcons[place.category] ||
                    Navigation

                  return (
                    <div
                      key={place.id}
                      className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6A15B]/10 text-[#C6A15B] shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {place.name}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                              {place.category}
                            </p>
                          </div>

                          {place.distance && (
                            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                              {place.distance}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lifestyle Card */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C6A15B] blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
                  Luxury Lifestyle
                </p>

                <h3 className="mt-6 text-3xl font-bold leading-tight">
                  Prime location surrounded by exceptional amenities.
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-300">
                  Enjoy convenient access to premium shopping, dining, parks, and entertainment destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
