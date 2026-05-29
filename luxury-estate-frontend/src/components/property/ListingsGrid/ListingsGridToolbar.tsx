import { Grid2X2, Rows3 } from 'lucide-react'

import { Select } from '@/components/common/Input/Select'

interface ListingsGridToolbarProps {
  totalResults: number

  sortBy: string

  onSortChange: (value: string) => void

  gridMode: 'grid' | 'list'

  onGridModeChange: (
    value: 'grid' | 'list',
  ) => void
}

export function ListingsGridToolbar({
  totalResults,
  sortBy,
  onSortChange,
  gridMode,
  onGridModeChange,
}: ListingsGridToolbarProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Search Results
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          {totalResults} Properties Found
        </h2>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Sort */}
        <div className="min-w-[220px]">
          <Select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value)
            }
            options={[
              {
                label: 'Newest Listings',
                value: 'newest',
              },
              {
                label: 'Price: Low to High',
                value: 'price_asc',
              },
              {
                label: 'Price: High to Low',
                value: 'price_desc',
              },
              {
                label: 'Most Popular',
                value: 'popular',
              },
            ]}
          />
        </div>

        {/* View Modes */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <button
            onClick={() => onGridModeChange('grid')}
            className={`
              flex h-11 w-11 items-center justify-center rounded-xl transition-all
              ${gridMode === 'grid'
                ? 'bg-[#C6A15B] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            <Grid2X2 className="h-5 w-5" />
          </button>

          <button
            onClick={() => onGridModeChange('list')}
            className={`
              flex h-11 w-11 items-center justify-center rounded-xl transition-all
              ${gridMode === 'list'
                ? 'bg-[#C6A15B] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            <Rows3 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
