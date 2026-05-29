import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'

import { HomepageHero } from '@/components/homepage/HomepageHero/HomepageHero'

import { SearchSidebar } from '@/components/search/SearchSidebar/SearchSidebar'

import type { ListingsFiltersDTO } from '@/types/listings'

import { FeaturedListingsSection } from '@/components/property/FeaturedListingsSection/FeaturedListingsSection'

import { NewsletterSubscribeSection } from '@/components/newsletter/NewsletterSubscribeSection/NewsletterSubscribeSection'

import { api } from '@/api/axios'

import type {
  AgencyCardDTO,
} from '@/types/agency'

import type {
  AssociateCardDTO,
} from '@/types/associate'

import type {
  PropertyCardDTO,
} from '@/types/property'
import { FeaturedAgenciesSection } from '@/components/homepage/FeaturedAgenciesSection/FeaturedAgenciesSection'
import { FeaturedAssociatesSection } from '@/components/homepage/FeaturedAssociatesSection/FeaturedAssociatesSection'

export function HomePage() {
  const navigate = useNavigate()

  const [
    featuredListings,
    setFeaturedListings,
  ] = useState<PropertyCardDTO[]>([])

  const [
    featuredAgencies,
    setFeaturedAgencies,
  ] = useState<AgencyCardDTO[]>([])

  const [
    featuredAssociates,
    setFeaturedAssociates,
  ] = useState<AssociateCardDTO[]>([])

  useEffect(() => {
    async function loadData() {
      const [
        listingsResponse,
        agenciesResponse,
        associatesResponse,
      ] = await Promise.all([
        api.get('/properties'),
        api.get('/agencies'),
        api.get('/associates'),
      ])

      setFeaturedListings(
        listingsResponse.data.data.items,
      )

      setFeaturedAgencies(
        agenciesResponse.data.data,
      )

      setFeaturedAssociates(
        associatesResponse.data.data,
      )
    }

    loadData()
  }, [])

  function handleSearch(filters: ListingsFiltersDTO) {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms))
    if (filters.bathrooms) params.set('bathrooms', String(filters.bathrooms))
    if (filters.propertyTypeId) params.set('propertyTypeId', String(filters.propertyTypeId))
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <>
      <Header />

      <main>

        {/* Hero */}

        <HomepageHero />

        {/* Search */}

        <SearchSidebar onSearch={handleSearch} />

        {/* Featured Listings */}

        <FeaturedListingsSection
          properties={featuredListings}
         />

        {/* Featured Agencies */}

        <FeaturedAgenciesSection
          agencies={featuredAgencies}
        />

        {/* Featured Associates */}

        <FeaturedAssociatesSection  
          associates={
            featuredAssociates
          }
        />

        {/* Newsletter */}

        <NewsletterSubscribeSection />

      </main>

      <Footer />
    </>
  )
}
