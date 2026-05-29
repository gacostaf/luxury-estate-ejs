import { Link } from 'react-router-dom'

import {
    Search,
    ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/common/Button/Button'

import heroImage from '@/assets/images/homepage-hero.png'

export function HomepageHero() {
    return (
        <section className="relative overflow-hidden bg-slate-900">

            {/* Background Image */}

            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-slate-900/70" />

            <div className="relative z-10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="min-h-[700px] flex items-center">

                        <div className="max-w-3xl text-white">

                            <span className="inline-flex rounded-full bg-[#C6A15B]/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                                Luxury Real Estate
                            </span>

                            <h1 className="mt-8 text-5xl font-bold leading-tight md:text-6xl xl:text-7xl">
                                Discover Exceptional Properties
                            </h1>

                            <p className="mt-8 text-xl leading-9 text-slate-300">
                                Explore luxury homes, waterfront estates,
                                investment opportunities, and exclusive listings
                                curated by experienced real estate professionals.
                            </p>

                            <div className="mt-12 flex flex-col gap-4 sm:flex-row">

                                <Button
                                    size="lg"
                                    asChild
                                >
                                    <Link to="/listings">
                                        <Search className="mr-2 h-5 w-5" />
                                        Browse Listings
                                    </Link>
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="lg"
                                    asChild
                                >
                                    <Link to="/contact">
                                        Contact Us
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}
