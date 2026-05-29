interface AssociateApiRecord {
  id: number; slug?: string | null; title?: string | null;
  person?: {
    firstName?: string | null; lastName?: string | null;
    email?: string | null; phone?: string | null;
    description?: string | null;
    facebookUrl?: string | null; instagramUrl?: string | null; linkedinUrl?: string | null;
    avatarImage?: { url?: string | null } | null;
    address?: { addressLocality?: string | null; addressRegion?: string | null } | null;
  } | null;
  properties?: unknown[] | null;
  agency?: { name?: string | null } | null;
}

export function mapAssociateToCardDTO(
    associate: AssociateApiRecord,
) {
    return {
        id: associate.id,

        slug: associate.slug,

        firstName: associate.person?.firstName,

        lastName: associate.person?.lastName,

        title: associate.title,

        email: associate.person?.email,

        phone: associate.person?.phone,

        avatarUrl:
            associate.person?.avatarImage?.url,

        city:
            associate.person?.address?.addressLocality,

        state:
            associate.person?.address?.addressRegion,

        bio: associate.person?.description,

        listingCount:
            associate.properties?.length || 0,

        agency: associate.agency
            ? {
                name: associate.agency.name,
            }
            : undefined,

        socials: {
            facebook:
                associate.person?.facebookUrl,

            instagram:
                associate.person?.instagramUrl,

            linkedin:
                associate.person?.linkedinUrl,
        },
    }
}
