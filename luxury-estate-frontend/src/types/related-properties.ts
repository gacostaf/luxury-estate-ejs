import type { PropertyCardDTO } from './property'

export interface RelatedPropertiesSectionDTO {
  currentPropertyId: number

  properties: PropertyCardDTO[]
}
