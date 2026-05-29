export interface NeighborhoodScoreDTO {
  walkabilityScore: number

  transitScore: number

  safetyScore: number

  schoolScore: number

  investmentScore: number
}

export interface NeighborhoodAmenityDTO {
  id: number

  name: string

  category: string

  distance: string
}

export interface NeighborhoodInsightsDTO {
  neighborhoodName: string

  city: string

  description: string

  scores: NeighborhoodScoreDTO

  amenities: NeighborhoodAmenityDTO[]

  medianHomePrice?: number

  annualAppreciationRate?: number

  averageHouseholdIncome?: number
}
    