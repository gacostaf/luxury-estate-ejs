import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'

interface PropertyReviewRatingProps {
  rating: number
  maxRating?: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function PropertyReviewRating({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange,
}: PropertyReviewRatingProps) {
  const [hovered, setHovered] = useState(0)

  if (interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const star = i + 1
          const filled = star <= (hovered || rating)
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                size={size}
                className={clsx(
                  'transition-colors',
                  filled ? 'fill-[#C6A15B] text-[#C6A15B]' : 'fill-none text-gray-300',
                )}
              />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={clsx(
            i < rating ? 'fill-[#C6A15B] text-[#C6A15B]' : 'fill-none text-gray-300',
          )}
        />
      ))}
    </div>
  )
}
