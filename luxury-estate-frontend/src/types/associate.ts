export interface AssociateCardDTO {
  id: number

  slug: string

  firstName?: string

  lastName?: string

  title?: string

  email?: string

  phone?: string

  avatarUrl?: string

  agency?: {
    name: string
  }

  city?: string

  state?: string

  listingCount?: number

  bio?: string

  socials?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}