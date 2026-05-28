import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface SimilarListingsCarouselControlsProps {
  onPrev: () => void
  onNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}
export function SimilarListingsCarouselControls({
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
}: SimilarListingsCarouselControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canScrollPrev}
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
          canScrollPrev
            ? 'border-gray-200 bg-white text-gray-700 hover:border-[#C6A15B] hover:text-[#C6A15B]'
            : 'cursor-not-allowed border-gray-100 text-gray-300',
        )}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canScrollNext}
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
          canScrollNext
            ? 'border-gray-200 bg-white text-gray-700 hover:border-[#C6A15B] hover:text-[#C6A15B]'
            : 'cursor-not-allowed border-gray-100 text-gray-300',
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
