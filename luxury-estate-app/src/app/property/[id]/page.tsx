import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ✅ Next.js 15: params is a Promise
export default async function PropertyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const propertyId = parseInt(id, 10);

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
            address: true,
            agent: { include: { employee: true } },
            propertyImages: { include: { image: true } },
            propertyVideos: { include: { video: true } },
        },
    });

    if (!property) notFound();

    // ✅ Construct JSON-LD Object
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.name,
        "description": property.description,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`,
        "image": property.propertyImages.length > 0
            ? property.propertyImages.map(img => img.image.uri)
            : [property.bannerImage?.uri].filter(Boolean),
        "offers": {
            "@type": "Offer",
            "price": property.price ? property.price.toNumber() : null,
            "priceCurrency": "USD",
            "availability": property.propertyStatusId === 1 ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address?.streetAddress,
            "addressLocality": property.address?.addressLocality,
            "addressRegion": property.address?.addressRegion,
            "postalCode": property.address?.postalCode,
            "addressCountry": property.address?.addressCountry
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": property.latitude?.toNumber(),
            "longitude": property.longitude?.toNumber()
        },
        "agent": property.agent ? {
            "@type": "RealEstateAgent",
            "name": property.agent.name,
            "jobTitle": property.agent.employee?.department
        } : undefined
    };

    return (
        <>
            {/* ✅ JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
                <p className="text-gray-600">{property.summary}</p>
                {/* Rest of your UI: Image Gallery, Details, Map, etc. */}
            </main>
        </>
    );
}

// ✅ Optional: Generate static paths for SEO/performance
export async function generateStaticParams() {
    const properties = await prisma.property.findMany({ select: { id: true } });
    return properties.map((p) => ({ id: p.id.toString() }));
}

// ✅ Optional: Standard SEO Meta Tags (Title/Description)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const propertyId = parseInt(id, 10);
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { name: true, summary: true }
    });

    if (!property) return { title: 'Property Not Found' };

    return {
        title: `${property.name} | Luxury Estate`,
        description: property.summary,
    };
}