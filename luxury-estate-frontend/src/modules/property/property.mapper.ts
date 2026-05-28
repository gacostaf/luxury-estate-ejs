export function mapPropertyImagesToGalleryDTO(
  property: any,
) {
  return (
    property.images?.map((item: any) => ({
      id: item.id,

      url: item.image?.url,

      thumbnailUrl:
        item.image?.thumbnailUrl ||
        item.image?.url,

      alt:
        item.image?.alt || property.title,

      isFeatured: item.isFeatured,

      type: item.type || 'image',
    })) || []
  )
}

export function mapPropertyToDetailsHeroDTO(
  property: any,
) {
  return {
    id: property.id,

    slug: property.slug,

    title: property.title,

    description: property.description,

    price: property.price,

    bedrooms: property.bedrooms,

    bathrooms: property.bathrooms,

    garages: property.garages,

    areaSqFt: property.areaSqFt,

    yearBuilt: property.yearBuilt,

    isFeatured: property.isFeatured,

    propertyStatus: property.propertyStatus
      ? {
          name: property.propertyStatus.name,
        }
      : undefined,

    propertyType: property.propertyType
      ? {
          name: property.propertyType.name,
        }
      : undefined,

    address: property.address
      ? {
          streetAddress:
            property.address.streetAddress,

          addressLocality:
            property.address.addressLocality,

          addressRegion:
            property.address.addressRegion,

          postalCode:
            property.address.postalCode,
        }
      : undefined,

    gallery:
      property.images?.map((item: any) => ({
        id: item.id,
        url: item.image?.url,
      })) || [],

    associate: property.agent
      ? {
          firstName:
            property.agent.firstName,

          lastName:
            property.agent.lastName,

          avatarUrl:
            property.agent.avatarImage?.url,
        }
      : undefined,

    agency: property.agency
      ? {
          name: property.agency.name,

          logoUrl:
            property.agency.logoImage?.url,
        }
      : undefined,
  }
}

export function mapPropertyFeaturesDTO(
  property: any,
) {
  return {
    features:
      property.features?.map((feature: any) => ({
        id: feature.id,

        name: feature.name,

        category: feature.category,

        value: feature.value,
      })) || [],

    amenities:
      property.amenities?.map(
        (amenity: any) => amenity.name,
      ) || [],

    energyRating: property.energyRating
      ? {
          id: property.energyRating.id,

          name: property.energyRating.name,

          value: property.energyRating.value,
        }
      : undefined,
  }
}
export function mapPropertyDescriptionSectionDTO(
  property: any,
) {
  return {
    title: property.title,

    shortDescription:
      property.shortDescription,

    fullDescription:
      property.description,

    highlights:
      property.highlights?.map(
        (highlight: any) => ({
          id: highlight.id,

          label: highlight.label,

          value: highlight.value,
        }),
      ) || [],

    facts: [
      {
        id: 1,
        label: 'Property Type',
        value:
          property.propertyType?.name || '-',
      },
      {
        id: 2,
        label: 'Status',
        value:
          property.propertyStatus?.name || '-',
      },
      {
        id: 3,
        label: 'Year Built',
        value:
          property.yearBuilt?.toString() || '-',
      },
      {
        id: 4,
        label: 'Garage Spaces',
        value:
          property.garages?.toString() || '-',
      },
      {
        id: 5,
        label: 'Energy Rating',
        value:
          property.energyRating?.value || '-',
      },
    ],
  }
}

export function mapPropertyMapSectionDTO(
  property: any,
) {
  return {
    latitude: property.latitude,

    longitude: property.longitude,

    title: property.title,

    address: [
      property.address?.streetAddress,
      property.address?.addressLocality,
      property.address?.addressRegion,
    ]
      .filter(Boolean)
      .join(', '),

    nearbyPlaces: [
      {
        id: 1,
        name: 'Luxury Shopping Center',
        category: 'Shopping',
        distance: '0.8 mi',
      },
      {
        id: 2,
        name: 'International School',
        category: 'School',
        distance: '1.2 mi',
      },
      {
        id: 3,
        name: 'Central Park',
        category: 'Park',
        distance: '0.5 mi',
      },
    ],
  }
}

export function mapPropertyReviewsSectionDTO(
  property: any,
) {
  const reviews =
    property.reviews?.filter(
      (review: any) =>
        review.isPublished &&
        review.moderationStatus?.name ===
          'APPROVED',
    ) || []

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) =>
            sum + review.rating,
          0,
        ) / reviews.length
      : 0

  return {
    averageRating,

    totalReviews: reviews.length,

    reviews: reviews.map((review: any) => ({
      id: review.id,

      reviewerName:
        review.person?.firstName &&
        review.person?.lastName
          ? `${review.person.firstName} ${review.person.lastName}`
          : 'Anonymous Reviewer',

      reviewerAvatarUrl:
        review.person?.avatarImage?.url,

      rating: review.rating,

      title: review.title,

      comment: review.comment,

      verified: review.isVerified,

      createdAt: review.createdAt,
    })),
  }
}

