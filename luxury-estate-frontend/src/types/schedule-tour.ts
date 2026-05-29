export interface ScheduleTourDTO {
  propertyId: number

  associateId?: number

  firstName: string

  lastName: string

  email: string

  phone?: string

  preferredDate: string

  preferredTime: string

  tourType:
    | 'IN_PERSON'
    | 'VIRTUAL'

  notes?: string
}
