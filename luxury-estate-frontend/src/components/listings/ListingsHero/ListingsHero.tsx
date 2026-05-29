export function ListingsHero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('/assets/images/listings-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="relative z-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-[420px] flex items-center">

            <div className="max-w-3xl text-white">

              <span className="inline-flex rounded-full bg-[#C6A15B]/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Luxury Collection
              </span>

              <h1 className="mt-8 text-5xl font-bold md:text-6xl">
                Luxury Property Listings
              </h1>

              <p className="mt-8 text-xl leading-9 text-slate-300">
                Discover exceptional homes, waterfront estates,
                investment opportunities, and luxury residences.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
