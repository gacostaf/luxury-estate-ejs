export interface PropertyCardDTO {
  id: number

  slug: string

  title: string

  price: number
  
  bedrooms?: number

  bathrooms?: number

  garages?: number

  areaSqFt?: number

  propertyType?: {
    name: string
  }

  propertyStatus?: {
    name: string
  }

  featuredImage?: string

  address?: {
    addressLocality?: string
    addressRegion?: string
  }

  agency?: {
    name: string
  }

  associate?: {
    firstName?: string
    lastName?: string
  }

  isFeatured?: boolean
}
