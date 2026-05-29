import { useState } from 'react'

import { Button } from '@/components/common/Button/Button'

import { Input } from '@/components/common/Input/Input'

import { api } from '@/api/axios'

export function NewsletterSubscribeSection() {

  const [email, setEmail] =
    useState('')

  const [success, setSuccess] =
    useState(false)

  async function subscribe() {

    await api.post(
      '/newsletter-subscriptions',
      {
        email,
      },
    )

    setSuccess(true)
  }

  return (
    <section className="bg-slate-900 py-24 text-white">

      <div className="max-w-4xl mx-auto px-4 text-center">

        <span className="inline-flex rounded-full bg-[#C6A15B]/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
          Stay Informed
        </span>

        <h2 className="mt-6 text-5xl font-bold">
          Luxury Market Insights
        </h2>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Subscribe for exclusive listings, market reports, and luxury real estate opportunities.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">

          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            placeholder="Enter your email"
          />

          <Button
            onClick={subscribe}
          >
            Subscribe
          </Button>

        </div>

        {success && (
          <p className="mt-6 text-emerald-400">
            Subscription successful.
          </p>
        )}

      </div>

    </section>
  )
}
