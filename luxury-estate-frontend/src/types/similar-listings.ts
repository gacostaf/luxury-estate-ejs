import type { PropertyCardDTO } from './property'

export interface SimilarListingsCarouselDTO {
  title: string
  subtitle?: string
  properties: PropertyCardDTO[]
}
