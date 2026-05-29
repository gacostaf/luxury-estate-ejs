import { AgencyCard } from '@/components/agency/AgencyCard/AgencyCard'

import type { AgencyCardDTO } from '@/types/agency'

interface Props {
  agencies: AgencyCardDTO[]
}

export function FeaturedAgenciesSection({
  agencies,
}: Props) {
  return (
    <section className="bg-slate-50 py-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl">

          <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            Leading Agencies
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Our Trusted Agencies
          </h2>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {agencies.map(
            (agency) => (
              <AgencyCard
                key={agency.id}
                agency={agency}
              />
            ),
          )}

        </div>

      </div>

    </section>
  )
}
