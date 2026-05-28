export async function getFeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: {
      isFeatured: true,
    },

    include: {
      propertyStatus: true,

      address: true,

      agency: true,

      agent: true,

      images: {
        include: {
          image: true,
        },
      },
    },

    take: 6,

    orderBy: {
      publishDate: 'desc',
    },
  })

  return properties.map(mapPropertyToCardDTO)
}

export async function getRelatedProperties(
  propertyId: number,
) {
  const currentProperty =
    await prisma.property.findUnique({
      where: {
        id: propertyId,
      },

      include: {
        propertyType: true,
        propertyStatus: true,
        address: true,
      },
    })

  if (!currentProperty) {
    return []
  }

  const properties =
    await prisma.property.findMany({
      where: {
        id: {
          not: propertyId,
        },

        propertyTypeId:
          currentProperty.propertyTypeId,

        propertyStatusId:
          currentProperty.propertyStatusId,

        address: {
          addressLocality:
            currentProperty.address
              ?.addressLocality,
        },

        price: {
          gte:
            currentProperty.price * 0.7,

          lte:
            currentProperty.price * 1.3,
        },
      },

      include: {
        propertyStatus: true,
        propertyType: true,
        address: true,
        images: {
          include: {
            image: true,
          },
        },
      },

      take: 6,

      orderBy: {
        publishDate: 'desc',
      },
    })

  return properties.map(mapPropertyToCardDTO)
}


