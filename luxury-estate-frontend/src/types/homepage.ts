import type { AssociateCardDTO } from "./associate"
import type { AgencyCardDTO } from "./agency"
import type { PropertyCardDTO } from "./property"

export interface HomePageDTO {
  featuredListings: PropertyCardDTO[] 
  featuredAgencies: AgencyCardDTO[] 
  featuredAssociates: AssociateCardDTO[]
}

export interface HomepageHeroDTO {
  badge: string
  title: string
  subtitle: string
  backgroundImageUrl: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
}
