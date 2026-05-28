import { motion } from 'framer-motion'

import { HeroSearchForm } from './HeroSearchForm'

import { HeroStats } from './HeroStats'

export function HomepageHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Luxury Property"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md">
                Luxury Real Estate Platform
              </span>

              <h1 className="mt-8 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                Discover Exceptional Luxury Properties
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                Explore exclusive listings, premium agencies,
                and world-class real estate opportunities with
                Lead Authority.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="mt-12"
            >
              <HeroSearchForm />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
              }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <button className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#C6A15B] px-8 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:opacity-90">
                Explore Listings
              </button>

              <button className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-md transition-all hover:bg-white/20">
                Contact Us
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.6,
              }}
              className="mt-16"
            >
              <HeroStats />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}