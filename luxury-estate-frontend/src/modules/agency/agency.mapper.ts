interface AgencyApiRecord {
  id: number; slug: string; name: string; description?: string | null;
  phone?: string | null; email?: string | null; websiteUrl?: string | null;
  foundedYear?: number | null; facebookUrl?: string | null;
  instagramUrl?: string | null; linkedinUrl?: string | null;
  logoImage?: { url?: string } | null; coverImage?: { url?: string } | null;
  address?: { addressLocality?: string | null; addressRegion?: string | null } | null;
  associates?: unknown[] | null; properties?: unknown[] | null;
}

export function mapAgencyToCardDTO(
  agency: AgencyApiRecord,
) {
  return {
    id: agency.id,

    slug: agency.slug,

    name: agency.name,

    logoUrl:
      agency.logoImage?.url,

    coverImageUrl:
      agency.coverImage?.url,

    description: agency.description,

    phone: agency.phone,

    email: agency.email,

    websiteUrl: agency.websiteUrl,

    city:
      agency.address?.addressLocality,

    state:
      agency.address?.addressRegion,

    foundedYear: agency.foundedYear,

    associateCount:
      agency.associates?.length || 0,

    listingCount:
      agency.properties?.length || 0,

    socials: {
      facebook: agency.facebookUrl,

      instagram: agency.instagramUrl,

      linkedin: agency.linkedinUrl,
    },
  }
}