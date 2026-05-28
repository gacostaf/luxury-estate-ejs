export function SimilarListingsCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="min-w-[280px] flex-shrink-0 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="aspect-[4/3] rounded-t-2xl bg-gray-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-300" />
            <div className="flex gap-4">
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
