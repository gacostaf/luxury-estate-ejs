import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface TourSuccessModalProps {
  open: boolean
  onClose: () => void
}

export function TourSuccessModal({ open, onClose }: TourSuccessModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">Tour Scheduled!</h3>
        <p className="mb-6 text-sm text-gray-500">
          We&apos;ve received your request. An agent will confirm your preferred date and time shortly.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-[#C6A15B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b8913f]"
        >
          Done
        </button>
      </div>
    </div>
  )
}
