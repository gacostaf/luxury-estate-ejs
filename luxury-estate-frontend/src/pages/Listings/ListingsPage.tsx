import { SearchSidebar } from '@/components/search/SearchSidebar/SearchSidebar'

export function ListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        <SearchSidebar />

        <div>
          Listings Grid
        </div>
      </div>
    </div>
  )
}