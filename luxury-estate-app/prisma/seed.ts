import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    console.log('📋 Seeding lookup tables...');

    const personTypes = await Promise.all(
        ['CLIENT', 'AGENT', 'BROKER', 'REALTOR', 'VP', 'OWNER', 'EXTERNAL_AGENT'].map(name =>
            prisma.personType.upsert({ where: { name }, update: {}, create: { name } })
        )
    );
    const [clientType, agentType, externalAgentType] = personTypes;

    const associateTypes = await Promise.all(
        ['AGENT', 'BROKER', 'REALTOR', 'VP', 'MANAGER', 'ADMIN'].map(name =>
            prisma.associateType.upsert({ where: { name }, update: {}, create: { name, description: `${name} role` } })
        )
    );
    const [assocAgentType] = associateTypes;

    const propertyTypes = await Promise.all(
        ['house', 'condo', 'villa', 'townhouse', 'penthouse', 'land'].map(name =>
            prisma.propertyType.upsert({ where: { name }, update: {}, create: { name } })
        )
    );
    const [houseType, condoType] = propertyTypes;

    const propertyStatuses = await Promise.all(
        ['for_sale', 'for_rent', 'sold', 'pending'].map(name =>
            prisma.propertyStatus.upsert({ where: { name }, update: {}, create: { name } })
        )
    );
    const [forSale, forRent] = propertyStatuses;

    const dqStatuses = await Promise.all(
        [
            'NOT A FIT/BUDGET',
            'LOST TO COMPETITION',
            'UNRESPONSIVE / DEAD',
            'POSTPONED (NURTURE)'
        ].map(name =>
            prisma.disqualificationStatus.upsert({ where: { name }, update: {}, create: { name } })
        )
    );

    const dqReasonsData = [
        { statusIdx: 0, reason: 'Budget', desc: 'The prospect cannot afford your product or service' },
        { statusIdx: 0, reason: 'No Authority', desc: 'The contact is not a decision-maker' },
        { statusIdx: 0, reason: 'No Need', desc: 'The lead does not have a problem your solution solves' },
        { statusIdx: 1, reason: 'Lost to Competition', desc: 'Competitor Choice' },
        { statusIdx: 1, reason: 'Better Pricing', desc: 'They went with a cheaper alternative' },
        { statusIdx: 2, reason: 'Unresponsive / Dead', desc: 'The prospect stopped replying' },
        { statusIdx: 2, reason: 'Bad Data', desc: 'The email bounced or phone disconnected' },
        { statusIdx: 3, reason: 'Bad Timing', desc: 'The lead is interested but cannot buy now' },
        { statusIdx: 3, reason: 'Lack of Resources', desc: 'Company experienced restructuring' }
    ];

    for (const r of dqReasonsData) {
        await prisma.disqualificationReason.upsert({
            where: { reason: r.reason },
            update: {},
            create: {
                statusId: dqStatuses[r.statusIdx].id,
                reason: r.reason,
                description: r.desc
            }
        });
    }

    const contactMethods = await Promise.all(
        ['EMAIL', 'PHONE', 'SMS', 'WHATSAPP', 'TELEGRAM', 'PORTAL'].map(method =>
            prisma.contactMethod.upsert({ where: { method }, update: {}, create: { method } })
        )
    );

    console.log('🌍 Seeding geographic data...');

    const usa = await prisma.country.upsert({
        where: { codenum: '840' },
        update: {},
        create: {
            codenum: '840',
            name: 'United States',
            code002: 'US',
            code003: 'USA',
            tld: '.us'
        }
    });

    await prisma.country.upsert({
        where: { codenum: '484' },
        update: {},
        create: {
            codenum: '484',
            name: 'Mexico',
            code002: 'MX',
            code003: 'MEX',
            tld: '.mx'
        }
    });

    const caState = await prisma.state.upsert({
        where: { uq_country_state: { countryId: usa.id, stateCode: 'CA' } },
        update: {},
        create: { countryId: usa.id, stateCode: 'CA', territory: 'California' }
    });

    await prisma.state.upsert({
        where: { uq_country_state: { countryId: usa.id, stateCode: 'FL' } },
        update: {},
        create: { countryId: usa.id, stateCode: 'FL', territory: 'Florida' }
    });

    console.log('📍 Seeding addresses...');

    const officeAddress = await prisma.address.create({
        data: {
            organization: 'Luxury Estate Realty HQ',
            streetAddress: '1234 Pacific Coast Highway, Suite 500',
            addressLocality: 'Malibu',
            addressRegion: 'CA',
            postalCode: '90265',
            addressCountry: 'US',
            latitude: 34.0259,
            longitude: -118.7798
        }
    });

    const propertyAddress1 = await prisma.address.create({
        data: {
            streetAddress: '1234 Ocean Blvd',
            addressLocality: 'Malibu',
            addressRegion: 'CA',
            postalCode: '90265',
            addressCountry: 'US',
            latitude: 34.035000,
            longitude: -118.678000
        }
    });

    const propertyAddress2 = await prisma.address.create({
        data: {
            streetAddress: '5678 Collins Ave, Penthouse A',
            addressLocality: 'Miami',
            addressRegion: 'FL',
            postalCode: '33140',
            addressCountry: 'US',
            latitude: 25.815000,
            longitude: -80.125000
        }
    });

    console.log('👥 Seeding people & associates...');

    const internalAgent = await prisma.person.create({
        data: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+1-555-0198',
            email: 'sarah.j@luxuryrealty.com',
            personType: { connect: { id: agentType.id } },
            isLead: false,
            isClient: false,
            isAssociate: true,
            isDisqualified: false,
            address: { connect: { id: officeAddress.id } },
            associate: {
                create: {
                    associateType: { connect: { id: assocAgentType.id } },
                    department: 'Luxury Sales',
                    fbHandle: 'https://facebook.com/sarahjrealty',
                    igHandle: 'https://instagram.com/sarahjrealty',
                    linkedinHandle: 'https://linkedin.com/in/sarahjohnsonrealty'
                }
            }
        }
    });

    const externalAgent = await prisma.person.create({
        data: {
            firstName: 'Michael',
            lastName: 'Torres',
            phone: '+1-555-0287',
            email: 'mtorres@partnerrealty.com',
            personType: { connect: { id: externalAgentType.id } },
            isLead: false,
            isClient: false,
            isAssociate: false,
            isDisqualified: false
        }
    });

    const client = await prisma.person.create({
        data: {
            firstName: 'Marcus',
            lastName: 'Chen',
            phone: '+1-555-0345',
            email: 'marcus.chen@email.com',
            personType: { connect: { id: clientType.id } },
            isLead: true,
            isClient: true,
            isAssociate: false,
            isDisqualified: false
        }
    });

    console.log('🖼️  Seeding media...');

    const propImg1 = await prisma.image.create({
        data: {
            uri: 'https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propImg2 = await prisma.image.create({
        data: {
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propImg3 = await prisma.image.create({
        data: {
            uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propVid1 = await prisma.video.create({
        data: {
            uri: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            isPersonal: false
        }
    });

    const empPhoto = await prisma.image.create({
        data: {
            uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400',
            isPersonal: true
        }
    });

    const empVideo = await prisma.video.create({
        data: {
            uri: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            isPersonal: true
        }
    });

    await prisma.associate.update({
        where: { personId: internalAgent.id },
        data: {
            photo: { connect: { id: empPhoto.id } },
            video: { connect: { id: empVideo.id } }
        }
    });

    console.log('🏢 Seeding offices...');

    const mainOffice = await prisma.office.create({
        data: {
            phone: '+1-310-555-0100',
            address: { connect: { id: officeAddress.id } }
        }
    });

    await prisma.associate.update({
        where: { personId: internalAgent.id },
        data: { office: { connect: { id: mainOffice.id } } }
    });

    console.log('🏠 Seeding properties...');

    const property1 = await prisma.property.create({
        data: {
            name: 'Modern Coastal Villa',
            description: 'Stunning oceanfront property with panoramic Pacific views, smart home automation, infinity pool, and private beach access.',
            summary: 'Luxury 4BR beachfront home with smart tech',
            seoUrl: 'modern-coastal-villa-malibu',
            publishDate: new Date(),
            price: 4500000.00,
            bedrooms: 4,
            bathrooms: 3,
            areaSqft: 3200.50,

            streetAddress: '1234 Ocean Blvd',
            addressLocality: 'Malibu',
            addressRegion: 'CA',
            postalCode: '90265',
            addressCountry: 'US',

            garageSpaces: 2,
            builtYear: 2018,
            propertyType: { connect: { id: houseType.id } },
            propertyStatus: { connect: { id: forSale.id } },
            lotSize: 8500.75,
            hoaFees: 150.00,
            mlsId: 'ML90265A',
            latitude: 34.035000,
            longitude: -118.678000,
            agent: { connect: { id: internalAgent.id } },
            address: { connect: { id: propertyAddress1.id } },
            bannerImage: { connect: { id: propImg1.id } },
            propertyImages: {
                create: [
                    { image: { connect: { id: propImg1.id } }, isBanner: true },
                    { image: { connect: { id: propImg2.id } }, isBanner: false },
                    { image: { connect: { id: propImg3.id } }, isBanner: false }
                ]
            },
            propertyVideos: {
                create: [{ video: { connect: { id: propVid1.id } } }]
            }
        }
    });

    const property2 = await prisma.property.create({
        data: {
            name: 'Skyline Penthouse',
            description: 'Breathtaking penthouse in the heart of Miami Beach with 360-degree views of the ocean and city skyline.',
            summary: 'Ultra-luxury 3BR penthouse with ocean views',
            seoUrl: 'skyline-penthouse-miami-beach',
            publishDate: new Date(Date.now() - 86400000),
            price: 2850000.00,
            bedrooms: 3,
            bathrooms: 3,
            areaSqft: 2400.00,

            streetAddress: '5678 Collins Ave, Penthouse A',
            addressLocality: 'Miami',
            addressRegion: 'FL',
            postalCode: '33140',
            addressCountry: 'US',

            garageSpaces: 2,
            builtYear: 2021,
            propertyType: { connect: { id: condoType.id } },
            propertyStatus: { connect: { id: forSale.id } },
            lotSize: null,
            hoaFees: 1250.00,
            mlsId: 'A11234567',
            latitude: 25.815000,
            longitude: -80.125000,
            agent: { connect: { id: internalAgent.id } },
            address: { connect: { id: propertyAddress2.id } }
        }
    });

    const property3 = await prisma.property.create({
        data: {
            name: 'Desert Oasis Villa',
            description: 'Exclusive desert villa in Cabo San Lucas with private pool, outdoor kitchen, and stunning Sea of Cortez views.',
            summary: '5BR villa with pool & ocean views',
            seoUrl: 'desert-oasis-villa-cabo',
            publishDate: new Date(Date.now() - 172800000),
            price: 15000.00,
            bedrooms: 5,
            bathrooms: 4,
            areaSqft: 4500.00,

            streetAddress: 'Camino del Mar 789',
            addressLocality: 'Cabo San Lucas',
            addressRegion: 'BCN',
            postalCode: '23410',
            addressCountry: 'MX',

            garageSpaces: 3,
            builtYear: 2020,
            propertyType: { connect: { id: houseType.id } },
            propertyStatus: { connect: { id: forRent.id } },
            lotSize: 12000.00,
            hoaFees: null,
            mlsId: 'CABO-2024-001',
            latitude: 22.890000,
            longitude: -109.912000,
            agent: { connect: { id: externalAgent.id } }
        }
    });

    console.log('\n✅ Seed completed! Verification:\n');

    const stats = await Promise.all([
        prisma.property.count(),
        prisma.person.count(),
        prisma.associate.count(),
        prisma.address.count(),
        prisma.office.count()
    ]);

    console.log(`  🏠 Properties: ${stats[0]}`);
    console.log(`  👥 People: ${stats[1]}`);
    console.log(`  🔗 Associates: ${stats[2]}`);
    console.log(`  📍 Addresses: ${stats[3]}`);
    console.log(`  🏢 Offices: ${stats[4]}`);

    const sampleProperty = await prisma.property.findFirst({
        include: { address: true }
    });

    if (sampleProperty) {
        console.log('\n📋 Sample Schema.org Address (from Property denormalized fields):');
        console.log(JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PostalAddress',
            streetAddress: sampleProperty.streetAddress,
            addressLocality: sampleProperty.addressLocality,
            addressRegion: sampleProperty.addressRegion,
            postalCode: sampleProperty.postalCode,
            addressCountry: sampleProperty.addressCountry
        }, null, 2));
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
