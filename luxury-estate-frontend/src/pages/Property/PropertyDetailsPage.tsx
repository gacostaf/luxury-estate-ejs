import {
  useEffect,
  useState,
} from 'react'

import { useParams } from 'react-router-dom'

import { api } from '@/api/axios'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

import { PropertyDetailsHero }
  from '@/components/property/PropertyDetailsHero/PropertyDetailsHero'

import { PropertyImageGallery }
  from '@/components/property/PropertyImageGallery/PropertyImageGallery'

import { PropertyFeatures }
  from '@/components/property/PropertyFeatures/PropertyFeatures'

import { PropertyDescriptionSection }
  from '@/components/property/PropertyDescriptionSection/PropertyDescriptionSection'

import { PropertyInvestmentAnalysis }
  from '@/components/property/PropertyInvestmentAnalysis/PropertyInvestmentAnalysis'

import { NeighborhoodInsights }
  from '@/components/property/NeighborhoodInsights/NeighborhoodInsights'

import { PropertyMapSection }
  from '@/components/property/PropertyMapSection/PropertyMapSection'

import { PropertyReviewsSection }
  from '@/components/property/PropertyReviewsSection/PropertyReviewsSection'

import { SimilarListingsCarousel }
  from '@/components/property/SimilarListingsCarousel/SimilarListingsCarousel'

import { ContactAgentForm }
  from '@/components/property/ContactAgentForm/ContactAgentForm'

import { ScheduleTour }
  from '@/components/property/ScheduleTour/ScheduleTour'

import type { PropertyDetailsDTO } from '@/types/property'

export function PropertyDetailsPage() {

  const { slug } = useParams()

  const [property, setProperty] =
    useState<PropertyDetailsDTO>()

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    if (slug) {
      loadProperty(slug)
    }

  }, [slug])

  async function loadProperty(
    slug: string,
  ) {

    try {

      const response =
        await api.get(
          `/properties/${slug}`,
        )

      setProperty(
        response.data,
      )

    } finally {

      setLoading(false)

    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!property) {
    return (
      <div>
        Property not found
      </div>
    )
  }

  return (
    <>
      <Header />

      <main>

        <PropertyDetailsHero
          property={property}
        />

        <PropertyImageGallery
          images={property.images}
        />

        <PropertyFeatures
          property={property}
        />

        <PropertyDescriptionSection
          description={
            property.description
          }
        />

        {property.investmentAnalysis && (

          <PropertyInvestmentAnalysis
            {...property.investmentAnalysis}
          />

        )}

        {property.neighborhood && (

          <NeighborhoodInsights
            insights={
              property.neighborhood
            }
          />

        )}

        <PropertyMapSection
          latitude={
            property.latitude
          }
          longitude={
            property.longitude
          }
        />

        <PropertyReviewsSection
          reviews={
            property.reviews
          }
        />

        <SimilarListingsCarousel
          properties={
            property.similarProperties
          }
        />

        {property.primaryAssociate && (

          <ContactAgentForm
            propertyId={
              property.id
            }
            associate={
              property.primaryAssociate
            }
          />

        )}

        <ScheduleTour
          propertyId={
            property.id
          }
          associateId={
            property.primaryAssociate?.id
          }
        />

      </main>

      <Footer />
    </>
  )
}
