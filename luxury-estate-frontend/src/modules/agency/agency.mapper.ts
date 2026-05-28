export function mapAgencyToCardDTO(
  agency: any,
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