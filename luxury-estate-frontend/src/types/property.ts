export interface PropertyDetailsDTO {
  id: number
  slug: string
  title: string
  description?: string
  price: number
  propertyType?: string
  propertyStatus?: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  lotSize?: number
  yearBuilt?: number
  latitude?: number
  longitude?: number
  images: PropertyImageDTO[]
  features: PropertyFeatureDTO[]
  reviews: PropertyReviewDTO[]
  relatedProperties: PropertyCardDTO[]
  similarProperties: PropertyCardDTO[]
  primaryAssociate?: AssociateCardDTO
  neighborhood?: NeighborhoodInsightsDTO
  investmentAnalysis?: PropertyInvestmentAnalysisDTO
}

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
