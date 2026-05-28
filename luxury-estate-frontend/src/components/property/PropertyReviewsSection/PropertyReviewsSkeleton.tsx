export function PropertyReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-16 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gray-200" />
                <div className="h-2 flex-1 rounded-full bg-gray-100" />
                <div className="h-3 w-4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          </div>
          <div className="mb-3 h-4 w-32 rounded bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-3/4 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
