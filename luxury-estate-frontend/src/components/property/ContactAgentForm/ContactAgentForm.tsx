import { useState } from 'react'

import {
  Mail,
  Phone,
  MessageSquare,
  Send,
} from 'lucide-react'

import { Button } from '@/components/common/Button/Button'

import { Input } from '@/components/common/Input/Input'

import { Select } from '@/components/common/Input/Select'

import { api } from '@/api/axios'

interface ContactAgentFormProps {
  propertyId: number

  associateId?: number
}

export function ContactAgentForm({
  propertyId,
  associateId,
}: ContactAgentFormProps) {
  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [formData, setFormData] =
    useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message:
        'I would like more information about this property.',
      preferredContactMethod: 'email',
      interestedInFinancing: false,
    })

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post(
        '/leads/property-inquiry',
        {
          ...formData,

          propertyId,

          associateId,
        },
      )

      setSuccess(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Form Card */}
          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-slate-200 sm:p-12">
            <div>
              <span className="inline-flex items-center rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Contact an Associate
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Request More Information
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Connect with a luxury real estate professional to schedule a private showing or receive additional details.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="text-xl font-semibold text-emerald-900">
                  Inquiry Sent Successfully
                </h3>

                <p className="mt-3 text-sm leading-7 text-emerald-700">
                  An associate will contact you shortly.
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-12 space-y-8"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value,
                    })
                  }
                />

                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@email.com"
                  leftIcon={<Mail className="h-5 w-5" />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                <Input
                  label="Phone Number"
                  placeholder="+1 555 555 5555"
                  leftIcon={<Phone className="h-5 w-5" />}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <Select
                label="Preferred Contact Method"
                value={
                  formData.preferredContactMethod
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredContactMethod:
                      e.target.value,
                  })
                }
                options={[
                  {
                    label: 'Email',
                    value: 'email',
                  },
                  {
                    label: 'Phone',
                    value: 'phone',
                  },
                  {
                    label: 'WhatsApp',
                    value: 'whatsapp',
                  },
                ]}
              />

              {/* Message */}
              <div>
                <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Message
                </label>

                <div className="relative">
                  <MessageSquare className="absolute left-5 top-5 h-5 w-5 text-slate-400" />

                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-white px-14 py-5 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#C6A15B] focus:ring-4 focus:ring-[#C6A15B]/10"
                  />
                </div>
              </div>

              {/* Financing */}
              <label className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.interestedInFinancing
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interestedInFinancing:
                        e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-[#C6A15B] focus:ring-[#C6A15B]"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    I am interested in financing options
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Connect me with financing and mortgage specialists.
                  </p>
                </div>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={loading}
              >
                <span className="flex items-center gap-3">
                  <Send className="h-5 w-5" />

                  {loading
                    ? 'Sending Inquiry...'
                    : 'Send Inquiry'}
                </span>
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Schedule Tour */}
            <div className="rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C6A15B] blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
                  Private Showing
                </p>

                <h3 className="mt-6 text-3xl font-bold leading-tight">
                  Schedule a personalized property tour.
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-300">
                  Experience this luxury property in person with a guided private showing.
                </p>

                <button className="mt-10 inline-flex items-center rounded-2xl bg-[#C6A15B] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90">
                  Schedule Tour
                </button>
              </div>
            </div>

            {/* Trust Card */}
            <div className="rounded-[32px] bg-white p-10 shadow-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                Why Work With Us?
              </h3>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Luxury Market Expertise
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Our associates specialize in premium real estate markets.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Personalized Service
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Tailored guidance throughout the buying journey.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Exclusive Listings
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Access premium off-market and luxury opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
