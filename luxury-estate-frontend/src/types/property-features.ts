export interface PropertyFeatureDTO {
  id: number

  name: string

  category?: string

  icon?: string

  value?: string
}

export interface PropertyFeaturesDTO {
  features: PropertyFeatureDTO[]

  amenities: string[]

  energyRating?: {
    id: number
    name: string
    value: string
  }
}