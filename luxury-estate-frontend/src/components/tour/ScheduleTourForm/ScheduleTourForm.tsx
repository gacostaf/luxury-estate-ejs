import { useState } from 'react'
import { CalendarDays, Clock, Video, Home, CheckCircle } from 'lucide-react'

import { Button } from '@/components/common/Button/Button'
import { Input } from '@/components/common/Input/Input'
import { TextArea } from '@/components/common/Input/TextArea'
import { api } from '@/api/axios'

import type { TourFormData, TourAssociateDTO } from '@/types/tour'

interface Props {
  propertyId: number
  associate?: TourAssociateDTO
}

const initialForm: TourFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  tourType: 'IN_PERSON',
  notes: '',
}

export function ScheduleTourForm({ propertyId, associate }: Props) {
  const [form, setForm] = useState<TourFormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setField<K extends keyof TourFormData>(key: K, value: TourFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.firstName || !form.lastName || !form.email || !form.preferredDate || !form.preferredTime) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setLoading(true)

      const scheduledDate = new Date(`${form.preferredDate}T${form.preferredTime}`).toISOString()

      await api.post('/tour-requests', {
        propertyId,
        primaryAssociateId: associate?.id,
        clientFirstName: form.firstName,
        clientLastName: form.lastName,
        clientEmail: form.email,
        clientPhone: form.phone || undefined,
        scheduledDate,
        clientMessage: form.notes || undefined,
        tourType: form.tourType,
      })

      setSuccess(true)
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Please sign in to schedule a tour.')
      } else if (err?.response?.data?.details) {
        setError(err.response.data.details.map((d: any) => d.message).join(', '))
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Tour Request Sent!</h3>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ve received your request. An agent will confirm your preferred date and time shortly.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setForm(initialForm)
            setSuccess(false)
          }}
        >
          Schedule Another Tour
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg sm:p-10">
      <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A15B]">
        Private Showing
      </span>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">Schedule a Tour</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Reserve a private viewing and experience this luxury property firsthand.
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            required
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          required
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preferred Date"
            type="date"
            value={form.preferredDate}
            onChange={(e) => setField('preferredDate', e.target.value)}
            leftIcon={<CalendarDays size={16} />}
            required
          />
          <Input
            label="Preferred Time"
            type="time"
            value={form.preferredTime}
            onChange={(e) => setField('preferredTime', e.target.value)}
            leftIcon={<Clock size={16} />}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tour Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setField('tourType', 'IN_PERSON')}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                form.tourType === 'IN_PERSON'
                  ? 'border-[#C6A15B] bg-[#C6A15B]/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Home size={22} className={form.tourType === 'IN_PERSON' ? 'text-[#C6A15B]' : 'text-slate-400'} />
              <span className={`text-sm font-semibold ${form.tourType === 'IN_PERSON' ? 'text-[#C6A15B]' : 'text-slate-700'}`}>
                In Person
              </span>
            </button>
            <button
              type="button"
              onClick={() => setField('tourType', 'VIRTUAL')}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                form.tourType === 'VIRTUAL'
                  ? 'border-[#C6A15B] bg-[#C6A15B]/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Video size={22} className={form.tourType === 'VIRTUAL' ? 'text-[#C6A15B]' : 'text-slate-400'} />
              <span className={`text-sm font-semibold ${form.tourType === 'VIRTUAL' ? 'text-[#C6A15B]' : 'text-slate-700'}`}>
                Virtual Tour
              </span>
            </button>
          </div>
        </div>

        <TextArea
          label="Additional Notes"
          placeholder="Any specific questions or preferences..."
          rows={4}
          value={form.notes}
          onChange={(e) => setField('notes', e.target.value)}
        />

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Request Tour
        </Button>
      </form>
    </div>
  )
}
