import {
  Star,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react'

import type { PropertyReviewsSectionDTO } from '@/types/property-review'

interface PropertyReviewsSectionProps {
  reviews: PropertyReviewsSectionDTO
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function PropertyReviewsSection({
  reviews,
}: PropertyReviewsSectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[0.8fr_1.2fr]">
          {/* Summary */}
          <div className="space-y-8">
            {/* Rating Card */}
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-10 shadow-sm">
              <span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Client Reviews
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                What Buyers Are Saying
              </h2>

              <div className="mt-10 flex items-end gap-5">
                <span className="text-7xl font-bold leading-none text-slate-900">
                  {reviews.averageRating.toFixed(1)}
                </span>

                <div className="pb-2">
                  <div className="flex items-center gap-1 text-[#C6A15B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i <
                          Math.round(
                            reviews.averageRating,
                          )
                            ? 'fill-current'
                            : ''
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-sm uppercase tracking-wide text-slate-500">
                    Based on {reviews.totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Card */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C6A15B] blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A15B]/20 text-[#C6A15B]">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <h3 className="mt-8 text-3xl font-bold leading-tight">
                  Trusted luxury real estate experiences.
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-300">
                  Reviews help future buyers discover exceptional properties and trusted associates.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-[32px] border border-[#C6A15B]/20 bg-[#C6A15B]/5 p-8 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A15B]/10 text-[#C6A15B] shrink-0">
                  <MessageSquare className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Share Your Experience
                  </h3>

                  <p className="mt-4 text-base leading-8 text-slate-600">
                    Help future buyers by sharing your experience with this property and associate.
                  </p>

                  <button className="mt-8 inline-flex items-center rounded-2xl bg-[#C6A15B] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90">
                    Write a Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-8">
            {reviews.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={
                          review.reviewerAvatarUrl ||
                          'https://placehold.co/200x200?text=User'
                        }
                        alt={review.reviewerName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {review.reviewerName}
                        </h3>

                        {review.verified && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[#C6A15B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'fill-current'
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="mt-8 text-2xl font-bold text-slate-900">
                    {review.title}
                  </h4>
                )}

                {/* Comment */}
                <p className="mt-6 text-base leading-8 text-slate-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
