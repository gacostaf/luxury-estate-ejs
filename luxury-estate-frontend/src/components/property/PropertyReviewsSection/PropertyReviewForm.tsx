import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send, Star } from 'lucide-react'
import { api } from '@/api/axios'
import { useAuthStore } from '@/store/auth.store'
import { PropertyReviewRating } from './PropertyReviewRating'

interface PropertyReviewFormProps {
  propertyId: number
  onSuccess?: () => void
}

export function PropertyReviewForm({ propertyId, onSuccess }: PropertyReviewFormProps) {
  const user = useAuthStore((s) => s.user)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        <Star size={20} className="mx-auto mb-2 text-gray-300" />
        Sign in to leave a review
      </div>
    )
  }

  const canSubmit = rating >= 1 && rating <= 5 && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await api.post('/property-reviews', {
        propertyId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      })
      toast.success('Review submitted')
      setRating(0)
      setTitle('')
      setComment('')
      onSuccess?.()
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#C6A15B]">
        Write a Review
      </h3>

      <label className="mb-1 block text-xs font-medium text-gray-700">Rating *</label>
      <div className="mb-4">
        <PropertyReviewRating rating={rating} interactive onChange={setRating} size={24} />
      </div>

      <label htmlFor="review-title" className="mb-1 block text-xs font-medium text-gray-700">
        Title
      </label>
      <input
        id="review-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
        className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
      />

      <label htmlFor="review-body" className="mb-1 block text-xs font-medium text-gray-700">
        Review
      </label>
      <textarea
        id="review-body"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this property"
        className="mb-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex items-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b8913f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={16} />
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
