import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { ScheduleTourHero } from '@/components/tour/ScheduleTourHero/ScheduleTourHero'
import { PropertySummaryCard } from '@/components/tour/PropertySummaryCard/PropertySummaryCard'
import { AssociateSummaryCard } from '@/components/tour/AssociateSummaryCard/AssociateSummaryCard'
import { ScheduleTourForm } from '@/components/tour/ScheduleTourForm/ScheduleTourForm'

import { api } from '@/api/axios'

import type { TourPropertyDTO, TourAssociateDTO } from '@/types/tour'

interface BackendProperty {
  id: number
  name: string
  seoUrl: string | null
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  areaSqft: number | null
  featuredImage: string | null
  propertyType: { id: number; name: string } | null
  propertyStatus: { id: number; name: string } | null
  streetAddress: string | null
  addressLocality: string | null
  addressRegion: string | null
  postalCode: string | null
  agentId: number | null
  agent?: {
    id: number
    fullName: string
    email: string | null
    phone: string | null
  } | null
}

function mapToPropertyDTO(p: BackendProperty): TourPropertyDTO {
  return {
    id: p.id,
    slug: p.seoUrl ?? String(p.id),
    title: p.name,
    price: p.price ?? 0,
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    areaSqFt: p.areaSqft ?? 0,
    propertyType: p.propertyType?.name ?? '',
    propertyStatus: p.propertyStatus?.name ?? '',
    featuredImage: p.featuredImage ?? undefined,
    address: {
      streetAddress: p.streetAddress ?? undefined,
      addressLocality: p.addressLocality ?? undefined,
      addressRegion: p.addressRegion ?? undefined,
      postalCode: p.postalCode ?? undefined,
    },
  }
}

function mapToAssociateDTO(p: BackendProperty): TourAssociateDTO | undefined {
  if (!p.agent) return undefined
  return {
    id: p.agent.id,
    fullName: p.agent.fullName,
    email: p.agent.email ?? undefined,
    phone: p.agent.phone ?? undefined,
  }
}

export function ScheduleTourPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const [property, setProperty] = useState<BackendProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) return

    setLoading(true)
    setError(null)

    api
      .get(`/properties/${encodeURIComponent(propertyId)}`)
      .then((res) => setProperty(res.data.data))
      .catch(() => setError('Property not found. Please check the link and try again.'))
      .finally(() => setLoading(false))
  }, [propertyId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
          <p className="text-lg text-slate-500">Loading property...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-lg text-slate-500">{error || 'Property not found.'}</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const propertyDTO = mapToPropertyDTO(property)
  const associateDTO = mapToAssociateDTO(property)

  return (
    <>
      <Header />

      <ScheduleTourHero property={propertyDTO} />

      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
            <ScheduleTourForm
              propertyId={property.id}
              associate={associateDTO}
            />

            <div className="space-y-6">
              <PropertySummaryCard property={propertyDTO} />
              {associateDTO && <AssociateSummaryCard associate={associateDTO} />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
