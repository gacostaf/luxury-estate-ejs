import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import {
  useSearchParams,
} from 'react-router-dom'

import { Header } from '@/components/layout/Header/Header'

import { Footer } from '@/components/layout/Footer/Footer'

import { ListingsHero } from '@/components/listings/ListingsHero/ListingsHero'

import { SearchSidebar } from '@/components/search/SearchSidebar/SearchSidebar'

import { ListingsGrid } from '@/components/property/ListingsGrid/ListingsGrid'

import { Pagination } from '@/components/listings/Pagination/Pagination'

import { api } from '@/api/axios'

import type {
  ListingsPageDTO,
} from '@/types/listings'

import type { ListingsFiltersDTO } from '@/types/listings'

function parseFilters(sp: URLSearchParams): ListingsFiltersDTO {
  const filters: ListingsFiltersDTO = {}
  const search = sp.get('search')
  const minPrice = sp.get('minPrice')
  const maxPrice = sp.get('maxPrice')
  const bedrooms = sp.get('bedrooms')
  const bathrooms = sp.get('bathrooms')
  const propertyTypeId = sp.get('propertyTypeId')
  if (search) filters.search = search
  if (minPrice) filters.minPrice = Number(minPrice)
  if (maxPrice) filters.maxPrice = Number(maxPrice)
  if (bedrooms) filters.bedrooms = Number(bedrooms)
  if (bathrooms) filters.bathrooms = Number(bathrooms)
  if (propertyTypeId) filters.propertyTypeId = Number(propertyTypeId)
  return filters
}

export function ListingsPage() {

  const [searchParams, setSearchParams] =
    useSearchParams()

  const [data, setData] =
    useState<ListingsPageDTO>()

  const [page, setPage] =
    useState(1)

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  )

  const loadListings = useCallback(
    async (
      currentPage: number,
      currentFilters: ListingsFiltersDTO,
    ) => {
      const params: Record<string, any> = {
        page: currentPage,
        pageSize: 12,
      }

      if (currentFilters.search) params.search = currentFilters.search
      if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice
      if (currentFilters.bedrooms) params.bedrooms = currentFilters.bedrooms
      if (currentFilters.bathrooms) params.bathrooms = currentFilters.bathrooms
      if (currentFilters.propertyTypeId) params.propertyTypeId = currentFilters.propertyTypeId

      const response =
        await api.get(
          '/properties',
          { params },
        )

      setData(response.data.data)
    },
    [],
  )

  useEffect(() => {
    loadListings(page, filters)
  }, [page, filters, loadListings])

  function handleSearch(newFilters: ListingsFiltersDTO) {
    const sp = new URLSearchParams()
    if (newFilters.search) sp.set('search', newFilters.search)
    if (newFilters.minPrice) sp.set('minPrice', String(newFilters.minPrice))
    if (newFilters.maxPrice) sp.set('maxPrice', String(newFilters.maxPrice))
    if (newFilters.bedrooms) sp.set('bedrooms', String(newFilters.bedrooms))
    if (newFilters.bathrooms) sp.set('bathrooms', String(newFilters.bathrooms))
    if (newFilters.propertyTypeId) sp.set('propertyTypeId', String(newFilters.propertyTypeId))
    setSearchParams(sp, { replace: true })
    setPage(1)
  }

  return (
    <>
      <Header />

      <main>

        <ListingsHero />

        <section className="bg-slate-50 py-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

              <div>

                <SearchSidebar
                  onSearch={handleSearch}
                  initialFilters={filters}
                />

              </div>

              <div>

                {data && (

                  <>
                    <ListingsGrid
                      properties={
                        data.items
                      }
                    />

                    <Pagination
                      currentPage={
                        data.currentPage
                      }
                      totalPages={
                        data.totalPages
                      }
                      onPageChange={
                        setPage
                      }
                    />

                  </>
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}
