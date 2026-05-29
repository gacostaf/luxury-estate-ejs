import { useState } from 'react'

import {
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

import type { PropertyDescriptionSectionDTO } from '@/types/property-description'

interface PropertyDescriptionSectionProps {
  property: PropertyDescriptionSectionDTO
}

export function PropertyDescriptionSection({
  property,
}: PropertyDescriptionSectionProps) {
  const [expanded, setExpanded] =
    useState(false)

  const description = expanded
    ? property.fullDescription
    : property.shortDescription ||
      property.fullDescription

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div>
            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-3 rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                <Sparkles className="h-4 w-4" />

                Property Overview
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {property.title}
              </h2>
            </div>

            {/* Description */}
            <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <div className="prose prose-lg max-w-none text-slate-600 prose-p:leading-8 prose-p:text-slate-600">
                <p>
                  {description}
                </p>
              </div>

              {property.fullDescription &&
                property.shortDescription && (
                  <button
                    onClick={() =>
                      setExpanded(!expanded)
                    }
                    className="mt-8 inline-flex items-center rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-[#C6A15B]"
                  >
                    {expanded
                      ? 'Show Less'
                      : 'Read More'}
                  </button>
                )}
            </div>

            {/* Highlights */}
            {property.highlights &&
              property.highlights.length > 0 && (
                <div className="mt-14">
                  <h3 className="text-3xl font-bold text-slate-900">
                    Property Highlights
                  </h3>

                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {property.highlights.map(
                      (highlight) => (
                        <div
                          key={highlight.id}
                          className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6A15B]/10 text-[#C6A15B] shrink-0">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">
                              {highlight.label}
                            </h4>

                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {highlight.value}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Facts Card */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                Property Facts
              </h3>

              <div className="mt-8 divide-y divide-slate-100">
                {property.facts?.map((fact) => (
                  <div
                    key={fact.id}
                    className="flex items-center justify-between py-5 gap-6"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
                      {fact.label}
                    </span>

                    <span className="text-sm font-semibold text-slate-900 text-right">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Luxury Quote Card */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C6A15B] blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
                  Luxury Living
                </p>

                <h3 className="mt-6 text-3xl font-bold leading-tight">
                  Designed for exceptional comfort and timeless elegance.
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-300">
                  Every detail of this property has been curated to deliver an extraordinary lifestyle experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
