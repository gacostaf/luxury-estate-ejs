import type { PropertyCardDTO } from './property'

export interface ListingsPageDTO {
  items: PropertyCardDTO[]

  totalItems: number

  totalPages: number

  currentPage: number

  pageSize: number
}

export interface ListingsFiltersDTO {
  search?: string

  minPrice?: number
  maxPrice?: number

  bedrooms?: number
  bathrooms?: number

  propertyTypeId?: number
  propertyStatusId?: number

  city?: string
  state?: string
  country?: string

  minLotSize?: number
  maxLotSize?: number

  minSquareFeet?: number
  maxSquareFeet?: number

  hasPool?: boolean
  hasGym?: boolean
  hasOceanView?: boolean
  hasSmartHome?: boolean
  hasElevator?: boolean
  hasHomeTheater?: boolean

  page?: number
  pageSize?: number

  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}
