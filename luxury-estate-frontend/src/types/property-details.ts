export interface PropertyDetailsHeroDTO {
  id: number

  slug: string

  title: string

  description?: string

  price?: number

  bedrooms?: number

  bathrooms?: number

  garages?: number

  areaSqFt?: number

  yearBuilt?: number

  isFeatured?: boolean

  propertyStatus?: {
    name: string
  }

  propertyType?: {
    name: string
  }

  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
  }

  gallery?: {
    id: number
    url: string
  }[]

  associate?: {
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }

  agency?: {
    name: string
    logoUrl?: string
  }
}