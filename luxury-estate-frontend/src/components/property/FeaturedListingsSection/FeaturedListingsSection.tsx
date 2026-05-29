import { ArrowRight } from 'lucide-react'

import { Link } from 'react-router-dom'

import { PropertyCard } from '@/components/property/PropertyCard/PropertyCard'

import type { PropertyCardDTO } from '@/types/property'

interface FeaturedListingsSectionProps {
  properties?: PropertyCardDTO[]
}

export function FeaturedListingsSection({
  properties,
}: FeaturedListingsSectionProps) {

  return (
	<section className="relative overflow-hidden bg-slate-50 py-24">
	  {/* Decorative Background */}
	  <div className="absolute inset-0 opacity-40">
		<div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#C6A15B]/10 blur-3xl" />

		<div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-200 blur-3xl" />
	  </div>

	  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{/* Header */}
		<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
		  <div className="max-w-3xl">
			<span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
			  Premium Collection
			</span>

			<h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
			  Featured Luxury Listings
			</h2>

			<p className="mt-6 text-lg leading-8 text-slate-600">
			  Explore handpicked luxury properties curated by top-performing agencies and associates.
			</p>
		  </div>

		  <div>
			<Link
			  to="/listings"
			  className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#C6A15B]"
			>
			  View All Listings

			  <ArrowRight className="h-5 w-5" />
			</Link>
		  </div>
		</div>

		{/* Content */}
		<div className="mt-16">
		  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
			{properties?.map((property) => (
			  <PropertyCard
				key={property.id}
				property={property}
			  />
			))}
		  </div>
		</div>
	  </div>
	</section>
  )
}
