import {
  MapPin,
  Shield,
  GraduationCap,
  Train,
  Footprints,
  TrendingUp,
} from 'lucide-react'

import type {
    NeighborhoodInsightsDTO,
} from '@/types/neighborhood-insights'

interface Props {
  insights: NeighborhoodInsightsDTO
}

export function NeighborhoodInsights({
  insights,
}: Props) {

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-4xl">

          <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            Neighborhood Insights
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Discover {insights.neighborhoodName}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {insights.description}
          </p>

        </div>

        {/* Scores */}

        <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-5">

          <ScoreCard
            icon={<Footprints />}
            label="Walkability"
            value={insights.scores.walkabilityScore}
          />

          <ScoreCard
            icon={<Train />}
            label="Transit"
            value={insights.scores.transitScore}
          />

          <ScoreCard
            icon={<Shield />}
            label="Safety"
            value={insights.scores.safetyScore}
          />

          <ScoreCard
            icon={<GraduationCap />}
            label="Schools"
            value={insights.scores.schoolScore}
          />

          <ScoreCard
            icon={<TrendingUp />}
            label="Investment"
            value={insights.scores.investmentScore}
          />

        </div>

        {/* Market Statistics */}

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">

          <StatCard
            label="Median Home Price"
            value={
              insights.medianHomePrice
                ?.toLocaleString()
            }
          />

          <StatCard
            label="Annual Appreciation"
            value={`${insights.annualAppreciationRate}%`}
          />

          <StatCard
            label="Average Household Income"
            value={`$${insights.averageHouseholdIncome?.toLocaleString()}`}
          />

        </div>

        {/* Amenities */}

        <div className="mt-16 rounded-[32px] bg-white p-10 shadow-lg">

          <h3 className="text-3xl font-bold text-slate-900">
            Nearby Amenities
          </h3>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {insights.amenities.map(
              (amenity) => (
                <div
                  key={amenity.id}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  <div className="flex items-center gap-3">

                    <MapPin className="h-5 w-5 text-[#C6A15B]" />

                    <span className="text-sm uppercase tracking-wide text-slate-500">
                      {amenity.category}
                    </span>

                  </div>

                  <h4 className="mt-4 text-xl font-semibold text-slate-900">
                    {amenity.name}
                  </h4>

                  <p className="mt-2 text-slate-600">
                    {amenity.distance}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>

      </div>
    </section>
  )
}

function ScoreCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm">

      <div className="text-[#C6A15B]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm uppercase tracking-wide text-slate-500">
        {label}
      </h3>

      <p className="mt-2 text-4xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  return (
    <div className="rounded-[24px] bg-white p-8 shadow-sm">

      <h3 className="text-sm uppercase tracking-wide text-slate-500">
        {label}
      </h3>

      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value || 'N/A'}
      </p>

    </div>
  )
}
