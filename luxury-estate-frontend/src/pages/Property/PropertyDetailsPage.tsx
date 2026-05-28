import { PropertyFeatures } from '@/components/property/PropertyFeatures/PropertyFeatures'
import { PropertyDescriptionSection } from '@/components/property/PropertyDescriptionSection/PropertyDescriptionSection'

export function PropertyDetailsPage() {
  return (
    <>
      <PropertyDescriptionSection
        property={property.descriptionSection}
      />
      <PropertyFeatures
        features={property.features}
      />
            <RelatedPropertiesSection
        propertyId={property.id}
      />
      <PropertyMapSection
        property={property.mapSection}
      />
      <PropertyReviewsSection
        reviews={property.reviewsSection}
      />
      <MortgageCalculator
        propertyPrice={property.price}
      />
      <ContactAgentForm
        propertyId={property.id}
        associateId={property.associate?.id}
      />

    </>
  )
}

