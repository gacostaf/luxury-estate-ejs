export function mapAssociateToCardDTO(
    associate: any,
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
            associate.properties?.length || 0,< ate.properties?.length || 0,

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