import { useState } from 'react'

import {
  CalendarDays,
  Clock,
  Video,
  Home,
} from 'lucide-react'

import { Button } from '@/components/common/Button/Button'
import { Input } from '@/components/common/Input/Input'
import { api } from '@/api/axios'

interface ScheduleTourProps {
  propertyId: number
  associateId?: number
}

export function ScheduleTour({
  propertyId,
  associateId,
}: ScheduleTourProps) {
  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [form] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    tourType: 'IN_PERSON',
    notes: '',
  })

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post('/tours', {
        ...form,
        propertyId,
        associateId,
      })

      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[1.2fr_0.8fr]">

          <div className="rounded-[32px] bg-white p-10 shadow-xl">

            <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              Private Showing
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900">
              Schedule a Tour
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Reserve a private viewing and experience this luxury property firsthand.
            </p>

            {success && (
              <div className="mt-8 rounded-2xl bg-emerald-50 p-6">
                Tour request submitted successfully.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-12 space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={form.firstName}
                />

                <Input
                  label="Last Name"
                  value={form.lastName}
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={form.email}
              />

              <Input
                label="Phone"
                value={form.phone}
              />

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Preferred Date"
                  type="date"
                />

                <Input
                  label="Preferred Time"
                  type="time"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  className="rounded-2xl border p-5"
                >
                  <Home className="mb-3 h-6 w-6" />
                  In Person
                </button>

                <button
                  type="button"
                  className="rounded-2xl border p-5"
                >
                  <Video className="mb-3 h-6 w-6" />
                  Virtual Tour
                </button>
              </div>

              <textarea
                rows={5}
                placeholder="Additional notes..."
                className="w-full rounded-3xl border p-5"
              />

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={loading}
              >
                Request Tour
              </Button>
            </form>
          </div>

          <div className="space-y-8">

            <div className="rounded-[32px] bg-slate-900 p-10 text-white">
              <h3 className="text-3xl font-bold">
                Luxury Viewing Experience
              </h3>

              <p className="mt-6 leading-8 text-slate-300">
                Receive personalized guidance from a luxury real estate professional.
              </p>
            </div>

            <div className="rounded-[32px] bg-white p-10 shadow-lg">
              <div className="space-y-6">

                <div className="flex gap-4">
                  <CalendarDays />
                  Flexible scheduling
                </div>

                <div className="flex gap-4">
                  <Clock />
                  Fast confirmations
                </div>

                <div className="flex gap-4">
                  <Video />
                  Virtual tour options
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
