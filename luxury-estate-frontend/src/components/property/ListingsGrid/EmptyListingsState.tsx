import { SearchX } from 'lucide-react'

export function EmptyListingsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className="mt-8 text-3xl font-bold text-slate-900">
        No Properties Found
      </h3>

      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
        Try adjusting your filters or searching in another location.
      </p>
    </div>
  )
}