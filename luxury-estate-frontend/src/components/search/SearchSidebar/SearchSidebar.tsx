import { useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '../../common/Button/Button'

import { Input } from '../../common/Input/Input'

import { Select } from '../../common/Input/Select'

import { Checkbox } from '../../common/Input/Checkbox'

import type { ListingsFiltersDTO } from '@/types/listings'

interface SearchSidebarProps {
  onSearch?: (filters: ListingsFiltersDTO) => void
  initialFilters?: ListingsFiltersDTO
}

export function SearchSidebar({
  onSearch,
  initialFilters,
}: SearchSidebarProps) {
  const [filters, setFilters] = useState<ListingsFiltersDTO>(
    initialFilters ?? {},
  )

  function update(key: keyof ListingsFiltersDTO, value: any) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.(filters)
  }

  function handleReset() {
    setFilters({})
    onSearch?.({})
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Find Your Property
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Search premium listings using advanced filters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Keyword, city, ZIP..."
          leftIcon={<Search className="h-5 w-5" />}
          value={filters.search ?? ''}
          onChange={(e) => update('search', e.target.value)}
        />

        <Select
          label="Property Type"
          value={filters.propertyTypeId?.toString() ?? ''}
          onChange={(e) =>
            update('propertyTypeId', e.target.value ? Number(e.target.value) : undefined)
          }
          options={[
            { label: 'Any Type', value: '' },
            { label: 'House', value: '1' },
            { label: 'Condo', value: '2' },
            { label: 'Villa', value: '3' },
            { label: 'Apartment', value: '4' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Price"
            type="number"
            placeholder="$100,000"
            value={filters.minPrice ?? ''}
            onChange={(e) => update('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          />

          <Input
            label="Max Price"
            type="number"
            placeholder="$2,000,000"
            value={filters.maxPrice ?? ''}
            onChange={(e) => update('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Bedrooms"
            value={filters.bedrooms?.toString() ?? ''}
            onChange={(e) => update('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
            options={[
              { label: 'Any', value: '' },
              { label: '1+', value: '1' },
              { label: '2+', value: '2' },
              { label: '3+', value: '3' },
              { label: '4+', value: '4' },
            ]}
          />

          <Select
            label="Bathrooms"
            value={filters.bathrooms?.toString() ?? ''}
            onChange={(e) => update('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
            options={[
              { label: 'Any', value: '' },
              { label: '1+', value: '1' },
              { label: '2+', value: '2' },
              { label: '3+', value: '3' },
            ]}
          />
        </div>

        <Button size="lg" fullWidth type="submit">
          Search Properties
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          type="button"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </form>
    </aside>
  )
}
