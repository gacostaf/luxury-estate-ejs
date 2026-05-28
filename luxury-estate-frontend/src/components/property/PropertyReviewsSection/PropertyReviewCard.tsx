import { ThumbsUp, BadgeCheck, Clock } from 'lucide-react'
import type { PropertyReviewDTO } from '@/types/property-review'
import { PropertyReviewRating } from './PropertyReviewRating'

interface PropertyReviewCardProps {
  review: PropertyReviewDTO
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function getInitials(first?: string, last?: string): string {
  const a = first?.charAt(0) ?? ''
  const b = last?.charAt(0) ?? ''
  return (a + b).toUpperCase() || '?'
}

export function PropertyReviewCard({ review }: PropertyReviewCardProps) {
  const name = review.person?.fullName ?? 'Anonymous'
  const initials = getInitials(review.person?.firstName, review.person?.lastName)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C6A15B]/10 text-sm font-bold text-[#C6A15B]">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              {formatDate(review.createdAt)}
            </div>
          </div>
        </div>

        {review.isVerified && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            <BadgeCheck size={14} />
            Verified
          </span>
        )}
      </div>

      <div className="mb-3">
        <PropertyReviewRating rating={review.rating} />
      </div>

      {review.title && (
        <h4 className="mb-1 text-sm font-semibold text-gray-900">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
        <ThumbsUp size={14} />
        <span>{review.helpfulCount} found helpful</span>
      </div>
    </div>
  )
}
