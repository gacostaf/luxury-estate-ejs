import { AssociateCard } from '@/components/associate/AssociateCard/AssociateCard'

import   type {
  AssociateCardDTO,
} from '@/types/associate'

interface Props {
  associates: AssociateCardDTO[]
}

export function FeaturedAssociatesSection({
  associates,
}: Props) {
  return (
    <section className="bg-slate-50 py-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl">

          <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            Luxury Professionals
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Meet Our Associates
          </h2>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {associates.map(
            (associate) => (
              <AssociateCard
                key={associate.id}
                associate={associate}
              />
            ),
          )}

        </div>

      </div>

    </section>
  )
}
