import type { PropertyReviewDTO } from '@/types/property-review'
import { PropertyReviewRating } from './PropertyReviewRating'

interface PropertyReviewsSummaryProps {
  reviews: PropertyReviewDTO[]
}

export function PropertyReviewsSummary({ reviews }: PropertyReviewsSummaryProps) {
  const total = reviews.length
  if (total === 0) return null

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</span>
          <PropertyReviewRating rating={Math.round(avg)} />
          <span className="mt-1 text-sm text-gray-500">{total} review{total !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex-1 space-y-1.5 self-stretch">
          {distribution.map(({ star, count }) => {
            const pct = total > 0 ? (count / total) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right text-gray-500">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#C6A15B] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-400">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
