import { Swiper, SwiperSlide } from 'swiper/react'

import {
  Navigation,
  Pagination,
  Autoplay,
} from 'swiper/modules'

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { PropertyCard } from '@/components/property/PropertyCard/PropertyCard'

import type { PropertyCardDTO } from '@/types/property'

interface SimilarListingsCarouselProps {
  title?: string
  subtitle?: string
  properties: PropertyCardDTO[]
}

export function SimilarListingsCarousel({
  title = 'Similar Listings',
  subtitle = 'Discover additional luxury properties that may interest you.',
  properties,
}: SimilarListingsCarouselProps) {
  if (!properties?.length) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              Property Recommendations
            </span>

            <h2 className="mt-6 text-4xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-6 max-w-3xl text-lg text-slate-600 leading-8">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="similar-prev flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#C6A15B]">
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button className="similar-next flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#C6A15B]">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mt-14">
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Autoplay,
            ]}
            navigation={{
              prevEl: '.similar-prev',
              nextEl: '.similar-next',
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
            }}
            spaceBetween={32}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <PropertyCard
                  property={property}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
