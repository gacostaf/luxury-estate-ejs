export interface TourPropertyDTO {
  id: number
  slug: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  areaSqFt: number
  propertyType: string
  propertyStatus: string
  featuredImage?: string
  address: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
  }
}

export interface TourAssociateDTO {
  id: number
  fullName: string
  title?: string
  email?: string
  phone?: string
  photoUrl?: string
  agency?: {
    name: string
    logoUrl?: string
  }
}

export interface TourFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  tourType: 'IN_PERSON' | 'VIRTUAL'
  notes: string
}

export interface CreateTourRequestDTO {
  propertyId: number
  associateId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  preferredDate: string
  preferredTime: string
  tourTypeId: number
  contactMethodId: number
  notes?: string
}