import { PropertyCard } from '@/components/property/PropertyCard/PropertyCard'

import { PropertyCardDTO } from '@/types/property'

import { ListingsGridPagination } from './ListingsGridPagination'

import { EmptyListingsState } from './EmptyListingsState'

interface ListingsGridProps {
  properties: PropertyCardDTO[]

  totalPages: number

  currentPage: number

  onPageChange: (page: number) => void
}

export function ListingsGrid({
  properties,
  totalPages,
  currentPage,
  onPageChange,
}: ListingsGridProps) {
  if (!properties.length) {
    return <EmptyListingsState />
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <ListingsGridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}