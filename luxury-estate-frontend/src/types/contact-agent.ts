export interface ContactAgentFormDTO {
  firstName: string

  lastName: string

  email: string

  phone?: string

  message?: string

  interestedInFinancing?: boolean

  preferredContactMethod?:
    | 'email'
    | 'phone'
    | 'whatsapp'

  propertyId: number

  associateId?: number
}