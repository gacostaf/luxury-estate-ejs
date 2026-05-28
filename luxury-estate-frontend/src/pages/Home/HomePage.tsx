import { HomepageHero } from '@/components/home/HomepageHero/HomepageHero'

import { FeaturedListingsSection } from '@/components/property/FeaturedListingsSection/FeaturedListingsSection'

export function HomePage() {
  return (
    <>
      <HomepageHero />

      <FeaturedListingsSection />
    </>
  )
}