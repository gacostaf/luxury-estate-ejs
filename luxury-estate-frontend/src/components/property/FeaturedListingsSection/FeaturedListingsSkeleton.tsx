export function FeaturedListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl bg-white shadow-sm"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />

          <div className="p-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-7 w-full animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-7 w-2/3 animate-pulse rounded bg-slate-200" />

            <div className="mt-8 grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, item) => (
                <div
                  key={item}
                  className="h-10 animate-pulse rounded bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}