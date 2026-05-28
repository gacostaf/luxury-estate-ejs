export interface AgencyCardDTO {
  id: number

  slug: string

  name: string

  logoUrl?: string

  coverImageUrl?: string

  description?: string

  phone?: string

  email?: string

  websiteUrl?: string

  city?: string

  state?: string

  address?: string

  associateCount?: number

  listingCount?: number

  foundedYear?: number

  socials?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}