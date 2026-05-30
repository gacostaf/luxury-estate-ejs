import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

import { PropertyDetailsHero } from '@/components/property/PropertyDetailsHero/PropertyDetailsHero'
import { PropertyDescriptionSection } from '@/components/property/PropertyDescriptionSection/PropertyDescriptionSection'
import { PropertyFeatures } from '@/components/property/PropertyFeatures/PropertyFeatures'
import { PropertyImageGallery } from '@/components/property/PropertyImageGallery/PropertyImageGallery'
import { PropertyMapSection } from '@/components/property/PropertyMapSection/PropertyMapSection'
import { PropertyReviewsSection } from '@/components/property/PropertyReviewsSection/PropertyReviewsSection'
import { ScheduleTour } from '@/components/property/ScheduleTour/ScheduleTour'
import { PropertyInvestmentAnalysis } from '@/components/property/PropertyInvestmentAnalysis/PropertyInvestmentAnalysis'
import { NeighborhoodInsights } from '@/components/property/NeighborhoodInsights/NeighborhoodInsights'
import { ContactAgentForm } from '@/components/property/ContactAgentForm/ContactAgentForm'

import { api } from '@/api/axios'

import type { PropertyDetailsHeroDTO } from '@/types/property-details'
import type { PropertyDescriptionSectionDTO } from '@/types/property-description'
import type { PropertyFeaturesDTO } from '@/types/property-features'
import type { PropertyGalleryImageDTO } from '@/types/property-gallery'
import type { PropertyMapSectionDTO } from '@/types/property-map'
import type { PropertyReviewsSectionDTO } from '@/types/property-review'
import type { NeighborhoodInsightsDTO } from '@/types/neighborhood-insights'

interface BackendPropertyImage {
  id: number
  imageId: number
  isBanner: boolean
  image: { id: number; uri: string; isPersonal: boolean }
}

interface BackendProperty {
  id: number
  name: string
  description: string
  summary: string | null
  bannerImageId: number | null
  bannerImage?: { id: number; uri: string; isPersonal: boolean } | null
  featuredImage: string | null
  seoUrl: string | null
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  areaSqft: number | null
  garageSpaces: number | null
  builtYear: number | null
  propertyType: { id: number; name: string } | null
  propertyStatus: { id: number; name: string } | null
  streetAddress: string | null
  addressLocality: string | null
  addressRegion: string | null
  postalCode: string | null
  addressCountry: string | null
  latitude: number | null
  longitude: number | null
  isFeatured: boolean
  mlsId: string | null
  lotSize: number | null
  hoaFees: number | null
  agentId: number | null
  agent?: {
    id: number
    fullName: string
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
  } | null
  images: BackendPropertyImage[]
}

function mapToHeroDTO(p: BackendProperty): PropertyDetailsHeroDTO {
  return {
    id: p.id,
    slug: p.seoUrl ?? String(p.id),
    title: p.name,
    description: p.summary || p.description,
    price: p.price ?? undefined,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    garages: p.garageSpaces ?? undefined,
    areaSqFt: p.areaSqft ?? undefined,
    yearBuilt: p.builtYear ?? undefined,
    isFeatured: p.isFeatured,
    propertyStatus: p.propertyStatus ? { name: p.propertyStatus.name } : undefined,
    propertyType: p.propertyType ? { name: p.propertyType.name } : undefined,
    address: {
      streetAddress: p.streetAddress ?? undefined,
      addressLocality: p.addressLocality ?? undefined,
      addressRegion: p.addressRegion ?? undefined,
      postalCode: p.postalCode ?? undefined,
    },
    gallery: p.images.map((img) => ({
      id: img.id,
      url: img.image.uri,
    })),
    associate: p.agent
      ? {
          firstName: p.agent.firstName ?? undefined,
          lastName: p.agent.lastName ?? undefined,
        }
      : undefined,
  }
}

function mapToDescriptionDTO(p: BackendProperty): PropertyDescriptionSectionDTO {
  return {
    title: p.name,
    fullDescription: p.description,
    highlights: [
      { id: 1, label: 'Property Type', value: p.propertyType?.name ?? '-' },
      { id: 2, label: 'Status', value: p.propertyStatus?.name ?? '-' },
      { id: 3, label: 'Year Built', value: String(p.builtYear ?? '-') },
      { id: 4, label: 'Garage Spaces', value: String(p.garageSpaces ?? '-') },
      { id: 5, label: 'Lot Size', value: p.lotSize ? `${p.lotSize.toLocaleString()} ft\xB2` : '-' },
    ],
  }
}

function mapToFeaturesDTO(p: BackendProperty): PropertyFeaturesDTO {
  const amenities: string[] = []
  if (p.description) {
    const match = p.description.match(/Features include: (.+?)\./)
    if (match) {
      amenities.push(...match[1].split(',').map((s: string) => s.trim()))
    }
  }
  return {
    features: [
      { id: 1, name: 'Bedrooms', value: String(p.bedrooms ?? 0) },
      { id: 2, name: 'Bathrooms', value: String(p.bathrooms ?? 0) },
      { id: 3, name: 'Garage', value: String(p.garageSpaces ?? 0) },
      { id: 4, name: 'Area', value: p.areaSqft ? `${p.areaSqft.toLocaleString()} ft²` : '-' },
    ],
    amenities,
  }
}

function mapToGalleryDTO(p: BackendProperty): PropertyGalleryImageDTO[] {
  return p.images.map((img) => ({
    id: img.id,
    url: img.image.uri,
    alt: p.name,
    isFeatured: img.isBanner,
    type: 'image' as const,
    thumbnailUrl: img.image.uri,
  }))
}

function mapToMapDTO(p: BackendProperty): PropertyMapSectionDTO {
  return {
    latitude: p.latitude ?? 33.749,
    longitude: p.longitude ?? -84.388,
    title: p.name,
    address: [p.streetAddress, p.addressLocality, p.addressRegion]
      .filter(Boolean)
      .join(', '),
  }
}

function mapToNeighborhoodDTO(p: BackendProperty): NeighborhoodInsightsDTO {
  return {
    neighborhoodName: p.addressLocality || 'Downtown',
    city: p.addressLocality || 'Atlanta',
    description: `Experience luxury living in the heart of ${p.addressLocality || 'Atlanta'}. This prestigious neighborhood offers an unparalleled lifestyle.`,
    scores: {
      walkabilityScore: 75,
      transitScore: 70,
      safetyScore: 80,
      schoolScore: 85,
      investmentScore: 78,
    },
    amenities: [
      { id: 1, name: 'Luxury Shopping Center', category: 'Shopping', distance: '0.8 mi' },
      { id: 2, name: 'International School', category: 'School', distance: '1.2 mi' },
      { id: 3, name: 'Central Park', category: 'Park', distance: '0.5 mi' },
    ],
  }
}

export function PropertyDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [property, setProperty] = useState<BackendProperty | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .get(`/properties/${encodeURIComponent(slug)}`)
      .then((res) => {
        setProperty(res.data.data)
      })
      .catch(() => {
        setProperty(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-500 text-lg">Loading property...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-500 text-lg">Property not found</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main>
        <PropertyDetailsHero property={mapToHeroDTO(property)} />

        <PropertyDescriptionSection property={mapToDescriptionDTO(property)} />

        <PropertyImageGallery images={mapToGalleryDTO(property)} />

        <PropertyFeatures features={mapToFeaturesDTO(property)} />

        {property.agent && (
          <ContactAgentForm
            propertyId={property.id}
            associate={{
              id: property.agent.id,
              fullName: property.agent.fullName,
              title: `${property.propertyType?.name ?? ''} Specialist`,
              email: property.agent.email ?? undefined,
              phone: property.agent.phone ?? undefined,
            }}
          />
        )}

        <PropertyMapSection property={mapToMapDTO(property)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] py-24">
            <PropertyReviewsSection
              reviews={{ averageRating: 0, totalReviews: 0, reviews: [] }}
            />
            <div className="space-y-12">
              <ScheduleTour propertyId={property.id} />
              <PropertyInvestmentAnalysis
                propertyPrice={property.price ?? 0}
                estimatedMonthlyRent={Math.round((property.price ?? 0) * 0.008)}
                annualPropertyTaxes={Math.round((property.price ?? 0) * 0.012)}
                annualInsurance={1800}
                annualMaintenance={Math.round((property.price ?? 0) * 0.01)}
                annualHoaFees={property.hoaFees ?? undefined}
                appreciationRate={5}
              />
            </div>
          </div>
        </div>

        <NeighborhoodInsights insights={mapToNeighborhoodDTO(property)} />
      </main>

      <Footer />
    </>
  )
}
