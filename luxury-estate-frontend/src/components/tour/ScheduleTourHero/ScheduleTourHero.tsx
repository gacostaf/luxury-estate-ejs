import type { TourPropertyDTO } from '@/types/tour'

interface Props {
  property: TourPropertyDTO
}

export function ScheduleTourHero({ property }: Props) {
  return (
    <section className="relative h-[320px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: property.featuredImage
            ? `url(${property.featuredImage})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-12 sm:px-6 lg:px-8">
        <div>
          <span className="inline-flex rounded-full bg-[#C6A15B]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A15B] backdrop-blur-sm">
            Schedule a Tour
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            {property.title}
          </h1>
          <p className="mt-2 text-lg text-white/80">
            {[property.address.streetAddress, property.address.addressLocality, property.address.addressRegion]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      </div>
    </section>
  )
}
