import { useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar, Send } from 'lucide-react'
import { api } from '@/api/axios'
import { useAuthStore } from '@/store/auth.store'
import type { TourType } from './TourTypeSelector'
import { TourTypeSelector } from './TourTypeSelector'
import { TourDatePicker } from './TourDatePicker'
import { TourSuccessModal } from './TourSuccessModal'

interface ScheduleTourProps {
  propertyId: number
  propertyTitle?: string
}

export function ScheduleTour({ propertyId, propertyTitle }: ScheduleTourProps) {
  const user = useAuthStore((s) => s.user)
  const [tourType, setTourType] = useState<TourType>('in_person')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && date && time && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await api.post('/contact-requests', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        type: 'SALES',
        subject: propertyTitle
          ? `Tour request: ${propertyTitle}`
          : `Tour request for property #${propertyId}`,
        message: [
          `Tour type: ${tourType}`,
          `Preferred date: ${date}`,
          `Preferred time: ${time}`,
          message.trim() && `Notes: ${message.trim()}`,
        ]
          .filter(Boolean)
          .join('\n'),
        contactMethod: 'EMAIL',
      })
      setShowSuccess(true)
      setDate('')
      setTime('')
      setPhone('')
      setMessage('')
    } catch {
      toast.error('Failed to schedule tour. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccess(false)
    setTourType('in_person')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C6A15B]/10">
            <Calendar size={20} className="text-[#C6A15B]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C6A15B]">Schedule a Tour</h3>
            <p className="text-xs text-gray-400">Pick your preferred experience</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Tour Type</label>
            <TourTypeSelector value={tourType} onChange={setTourType} />
          </div>

          <TourDatePicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="st-first" className="mb-1 block text-xs font-medium text-gray-700">First Name *</label>
              <input
                id="st-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
              />
            </div>
            <div>
              <label htmlFor="st-last" className="mb-1 block text-xs font-medium text-gray-700">Last Name *</label>
              <input
                id="st-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="st-email" className="mb-1 block text-xs font-medium text-gray-700">Email *</label>
            <input
              id="st-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
            />
          </div>

          <div>
            <label htmlFor="st-phone" className="mb-1 block text-xs font-medium text-gray-700">Phone</label>
            <input
              id="st-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
            />
          </div>

          <div>
            <label htmlFor="st-notes" className="mb-1 block text-xs font-medium text-gray-700">Notes</label>
            <textarea
              id="st-notes"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any specific questions or preferences?"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b8913f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? 'Scheduling…' : 'Request Tour'}
          </button>
        </div>
      </form>

      <TourSuccessModal open={showSuccess} onClose={handleCloseModal} />
    </>
  )
}
