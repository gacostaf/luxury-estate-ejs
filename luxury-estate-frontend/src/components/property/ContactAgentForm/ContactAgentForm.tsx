import { useState } from 'react'

import {
  Mail,
  Phone,
  User,
} from 'lucide-react'

import { Button }
  from '@/components/common/Button/Button'

import { Input }
  from '@/components/common/Input/Input'

import { api }
  from '@/api/axios'

import type { AssociateCardDTO } from '@/types/associate'

import { ContactAgentCard } from '@/components/property/ContactAgentForm/ContactAgentCard'

interface Props {
  propertyId: number

  associate: AssociateCardDTO
}

export function ContactAgentForm({
  propertyId,
  associate,
}: Props) {

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [form, setForm] =
    useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    })

  function setField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post(
        '/property-inquiries',
        {
          propertyId,
          associateId: associate.id,
          ...form,
        },
      )

      setSuccess(true)
    } catch {
      // submission failed silently
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-50 py-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">

          <ContactAgentCard
            associate={associate}
          />

          <div className="rounded-[32px] bg-white p-10 shadow-lg">

            <h2 className="text-4xl font-bold text-slate-900">
              Contact an Agent
            </h2>

            {!success ? (

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >

                <div className="grid gap-6 md:grid-cols-2">

                  <Input
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={e => setField('firstName', e.target.value)}
                  />

                  <Input
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={e => setField('lastName', e.target.value)}
                  />

                </div>

                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                />

                <Input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                />

                <textarea
                  rows={6}
                  className="w-full rounded-3xl border border-slate-200 p-4"
                  placeholder="Message"
                  value={form.message}
                  onChange={e => setField('message', e.target.value)}
                />

                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </Button>

              </form>

            ) : (

              <div className="py-12">

                Inquiry submitted successfully.

              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  )
}
