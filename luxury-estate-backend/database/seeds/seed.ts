import { config } from 'dotenv';
config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_TENANT_ID = 1;

async function main() {
    console.log('🌱 Starting database seed...\n');

    console.log('🏢 Seeding tenant...');
    const tenant = await prisma.tenant.upsert({
        where: { id: DEFAULT_TENANT_ID },
        update: { name: 'Luxury Homes Inc.', slug: 'luxury-homes' },
        create: {
            id: DEFAULT_TENANT_ID,
            name: 'Luxury Homes Inc.',
            slug: 'luxury-homes',
            domain: null,
            isActive: true,
            settings: {
                create: {
                    companyName: 'Luxury Homes Inc.',
                    tagline: 'Your Gateway to Luxury Living',
                    contactEmail: 'info@luxuryhomes.com',
                    contactPhone: '+1-555-0100',
                }
            }
        },
        include: { settings: true }
    });
    console.log(`  ✅ Tenant: ${tenant.name} (ID: ${tenant.id})`);

    console.log('📋 Seeding lookup tables...');

    const personTypes = await Promise.all(
        ['CLIENT', 'AGENT', 'BROKER', 'REALTOR', 'VP', 'OWNER', 'EXTERNAL_AGENT'].map(name =>
            prisma.personType.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.replace(/_/g, ' ').toLowerCase()} type` }
            })
        )
    );
    const [clientType, agentType, externalAgentType] = personTypes;

    const associateTypes = await Promise.all(
        ['AGENT', 'BROKER', 'REALTOR', 'VP', 'MANAGER', 'ADMIN'].map(name =>
            prisma.associateType.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name} role` }
            })
        )
    );
    const [assocAgentType] = associateTypes;

    const propertyTypes = await Promise.all(
        ['house', 'condo', 'villa', 'townhouse', 'penthouse', 'land'].map(name =>
            prisma.propertyType.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name} property type` }
            })
        )
    );
    const [houseType, condoType] = propertyTypes;

    const propertyStatuses = await Promise.all(
        ['for_sale', 'for_rent', 'sold', 'pending'].map(name =>
            prisma.propertyStatus.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.replace(/_/g, ' ')} property status` }
            })
        )
    );
    const [forSale, forRent] = propertyStatuses;

    const dqStatuses = await Promise.all(
        [
            'NOT A FIT/BUDGET',
            'LOST TO COMPETITION',
            'UNRESPONSIVE / DEAD',
            'POSTPONED (NURTURE)'
        ].map(name => {
            const code = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            return prisma.disqualificationStatus.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code, name }
            });
        })
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
            where: { tenantId_reason: { tenantId: DEFAULT_TENANT_ID, reason: r.reason } },
            update: {},
            create: {
                tenantId: DEFAULT_TENANT_ID,
                statusId: dqStatuses[r.statusIdx].id,
                reason: r.reason,
                description: r.desc
            }
        });
    }

    const contactMethods = await Promise.all([
        { code: 'EMAIL', name: 'Email', description: 'Email communication' },
        { code: 'PHONE', name: 'Phone', description: 'Phone call' },
        { code: 'SMS', name: 'SMS', description: 'Text message (SMS)' },
        { code: 'WHATSAPP', name: 'WhatsApp', description: 'WhatsApp messaging' },
        { code: 'TELEGRAM', name: 'Telegram', description: 'Telegram messaging' },
        { code: 'PORTAL', name: 'Portal', description: 'Client portal' },
    ].map(cm =>
        prisma.contactMethod.upsert({
            where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: cm.code } },
            update: {},
            create: { tenantId: DEFAULT_TENANT_ID, ...cm }
        })
    ));

    console.log(`  ✅ ${contactMethods.length} contact methods`);

    const leadSources = await Promise.all([
        { code: 'WEBSITE', name: 'Website', description: 'Direct website visit' },
        { code: 'REFERRAL', name: 'Referral', description: 'Referred by existing client or partner' },
        { code: 'SOCIAL_MEDIA', name: 'Social Media', description: 'Social media platform' },
        { code: 'EMAIL_MARKETING', name: 'Email Marketing', description: 'Email marketing campaign' },
        { code: 'PHONE_INQUIRY', name: 'Phone Inquiry', description: 'Incoming phone call inquiry' },
        { code: 'WALK_IN', name: 'Walk-In', description: 'Walk-in to office' },
        { code: 'OPEN_HOUSE', name: 'Open House', description: 'Open house event' },
        { code: 'ZILLOW', name: 'Zillow', description: 'Zillow listing referral' },
        { code: 'REALTOR_COM', name: 'Realtor.com', description: 'Realtor.com listing referral' },
        { code: 'GOOGLE', name: 'Google', description: 'Google search or ads' },
        { code: 'FACEBOOK', name: 'Facebook', description: 'Facebook ads or page' },
        { code: 'INSTAGRAM', name: 'Instagram', description: 'Instagram ads or page' },
        { code: 'LINKEDIN', name: 'LinkedIn', description: 'LinkedIn ads or profile' },
        { code: 'YOUTUBE', name: 'YouTube', description: 'YouTube channel or ads' },
        { code: 'OTHER', name: 'Other', description: 'Other source' },
    ].map(ls =>
        prisma.leadSource.upsert({
            where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: ls.code } },
            update: {},
            create: { tenantId: DEFAULT_TENANT_ID, ...ls }
        })
    ));

    console.log(`  ✅ ${leadSources.length} lead sources`);

    const moderationStatuses = await Promise.all(
        ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'].map(name =>
            prisma.reviewModerationStatus.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.toLowerCase()} moderation status` }
            })
        )
    );

    console.log(`  ✅ ${moderationStatuses.length} review moderation statuses`);
    console.log('  ✅ Person types, property types, statuses, etc.');

    const tourTypes = await Promise.all([
        { code: 'in_person', name: 'In-Person Tour', description: 'In-Person Tour' },
        { code: 'virtual', name: 'Virtual Tour', description: 'Virtual Tour' },
        { code: 'private_showing', name: 'Private Showing', description: 'Private Showing' },
        { code: 'open_house', name: 'Open House Visit', description: 'Open House Visit' },
        { code: 'broker_tour', name: 'Broker Tour', description: 'Broker Tour' },
        { code: 'video_walkthrough', name: 'Video Walkthrough', description: 'Video Walkthrough' },
        { code: 'new_construction', name: 'New Construction Tour', description: 'New Construction Tour' },
        { code: 'investment', name: 'Investment Property Tour', description: 'Investment Property Tour' },
    ].map(tt =>
        prisma.tourType.upsert({
            where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: tt.code } },
            update: {},
            create: { tenantId: DEFAULT_TENANT_ID, ...tt }
        })
    ));

    console.log(`  ✅ ${tourTypes.length} tour types`);

    const tourStatuses = await Promise.all(
        ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map(name =>
            prisma.tourStatus.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.toLowerCase().replace(/_/g, ' ')} tour status` }
            })
        )
    );
    console.log(`  ✅ ${tourStatuses.length} tour statuses`);

    const requestTypes = await Promise.all(
        ['GENERAL', 'SALES', 'SUPPORT', 'PARTNERSHIP'].map(name =>
            prisma.requestType.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.toLowerCase()} request type` }
            })
        )
    );
    console.log(`  ✅ ${requestTypes.length} request types`);

    const requestStatuses = await Promise.all(
        ['NEW', 'OPEN', 'HOLD', 'CLOSED'].map(name =>
            prisma.requestStatus.upsert({
                where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: name } },
                update: {},
                create: { tenantId: DEFAULT_TENANT_ID, code: name, name, description: `${name.toLowerCase()} request status` }
            })
        )
    );
    console.log(`  ✅ ${requestStatuses.length} request statuses`);

    console.log('🔐 Seeding roles & permissions...');

    const ROLES = [
      { code: 'ADMINISTRATOR', name: 'Administrator', isSystem: true, sortOrder: 10 },
      { code: 'BROKER', name: 'Broker', isSystem: true, sortOrder: 20 },
      { code: 'MANAGING_BROKER', name: 'Managing Broker', isSystem: false, sortOrder: 25 },
      { code: 'ASSOCIATE', name: 'Associate', isSystem: false, sortOrder: 30 },
      { code: 'MARKETING_MANAGER', name: 'Marketing Manager', isSystem: false, sortOrder: 35 },
      { code: 'CONTENT_EDITOR', name: 'Content Editor', isSystem: false, sortOrder: 40 },
      { code: 'CUSTOMER', name: 'Customer', isSystem: false, sortOrder: 50 },
    ];

    for (const r of ROLES) {
      await prisma.role.upsert({
        where: { tenantId_code: { tenantId: DEFAULT_TENANT_ID, code: r.code } },
        update: { name: r.name, isSystem: r.isSystem, sortOrder: r.sortOrder },
        create: { tenantId: DEFAULT_TENANT_ID, code: r.code, name: r.name, description: `${r.name} role`, isSystem: r.isSystem, sortOrder: r.sortOrder },
      });
    }

    const PERMISSION_CATEGORIES: { category: string; codes: { code: string; name: string; sortOrder: number }[] }[] = [
      {
        category: 'Properties',
        codes: [
          { code: 'PROPERTY_VIEW', name: 'View Properties', sortOrder: 10 },
          { code: 'PROPERTY_CREATE', name: 'Create Properties', sortOrder: 20 },
          { code: 'PROPERTY_UPDATE', name: 'Update Properties', sortOrder: 30 },
          { code: 'PROPERTY_DELETE', name: 'Delete Properties', sortOrder: 40 },
          { code: 'PROPERTY_PUBLISH', name: 'Publish Properties', sortOrder: 50 },
        ],
      },
      {
        category: 'Agencies',
        codes: [
          { code: 'AGENCY_VIEW', name: 'View Agencies', sortOrder: 10 },
          { code: 'AGENCY_CREATE', name: 'Create Agencies', sortOrder: 20 },
          { code: 'AGENCY_UPDATE', name: 'Update Agencies', sortOrder: 30 },
          { code: 'AGENCY_DELETE', name: 'Delete Agencies', sortOrder: 40 },
        ],
      },
      {
        category: 'Associates',
        codes: [
          { code: 'ASSOCIATE_VIEW', name: 'View Associates', sortOrder: 10 },
          { code: 'ASSOCIATE_CREATE', name: 'Create Associates', sortOrder: 20 },
          { code: 'ASSOCIATE_UPDATE', name: 'Update Associates', sortOrder: 30 },
          { code: 'ASSOCIATE_DELETE', name: 'Delete Associates', sortOrder: 40 },
        ],
      },
      {
        category: 'Blog',
        codes: [
          { code: 'BLOG_VIEW', name: 'View Blog Posts', sortOrder: 10 },
          { code: 'BLOG_CREATE', name: 'Create Blog Posts', sortOrder: 20 },
          { code: 'BLOG_UPDATE', name: 'Update Blog Posts', sortOrder: 30 },
          { code: 'BLOG_DELETE', name: 'Delete Blog Posts', sortOrder: 40 },
          { code: 'BLOG_PUBLISH', name: 'Publish Blog Posts', sortOrder: 50 },
        ],
      },
      {
        category: 'Newsletter',
        codes: [
          { code: 'NEWSLETTER_VIEW', name: 'View Newsletters', sortOrder: 10 },
          { code: 'NEWSLETTER_CREATE', name: 'Create Newsletters', sortOrder: 20 },
          { code: 'NEWSLETTER_UPDATE', name: 'Update Newsletters', sortOrder: 30 },
          { code: 'NEWSLETTER_DELETE', name: 'Delete Newsletters', sortOrder: 40 },
          { code: 'NEWSLETTER_SEND', name: 'Send Newsletters', sortOrder: 50 },
        ],
      },
      {
        category: 'Tours',
        codes: [
          { code: 'TOUR_VIEW', name: 'View Tours', sortOrder: 10 },
          { code: 'TOUR_CREATE', name: 'Create Tours', sortOrder: 20 },
          { code: 'TOUR_UPDATE', name: 'Update Tours', sortOrder: 30 },
          { code: 'TOUR_DELETE', name: 'Delete Tours', sortOrder: 40 },
          { code: 'TOUR_CONFIRM', name: 'Confirm Tours', sortOrder: 50 },
          { code: 'TOUR_CANCEL', name: 'Cancel Tours', sortOrder: 60 },
        ],
      },
      {
        category: 'Inquiries',
        codes: [
          { code: 'INQUIRY_VIEW', name: 'View Inquiries', sortOrder: 10 },
          { code: 'INQUIRY_CREATE', name: 'Create Inquiries', sortOrder: 20 },
          { code: 'INQUIRY_UPDATE', name: 'Update Inquiries', sortOrder: 30 },
          { code: 'INQUIRY_DELETE', name: 'Delete Inquiries', sortOrder: 40 },
        ],
      },
      {
        category: 'Users',
        codes: [
          { code: 'USER_VIEW', name: 'View Users', sortOrder: 10 },
          { code: 'USER_CREATE', name: 'Create Users', sortOrder: 20 },
          { code: 'USER_UPDATE', name: 'Update Users', sortOrder: 30 },
          { code: 'USER_DELETE', name: 'Delete Users', sortOrder: 40 },
        ],
      },
      {
        category: 'Roles',
        codes: [
          { code: 'ROLE_VIEW', name: 'View Roles', sortOrder: 10 },
          { code: 'ROLE_CREATE', name: 'Create Roles', sortOrder: 20 },
          { code: 'ROLE_UPDATE', name: 'Update Roles', sortOrder: 30 },
          { code: 'ROLE_DELETE', name: 'Delete Roles', sortOrder: 40 },
        ],
      },
      {
        category: 'System',
        codes: [
          { code: 'SYSTEM_ADMIN', name: 'System Admin', sortOrder: 10 },
        ],
      },
    ];

    for (const cat of PERMISSION_CATEGORIES) {
      for (const p of cat.codes) {
        await prisma.permission.upsert({
          where: { code: p.code },
          update: { name: p.name, category: cat.category, sortOrder: p.sortOrder },
          create: { code: p.code, name: p.name, description: p.name, category: cat.category, sortOrder: p.sortOrder },
        });
      }
    }

    console.log(`  ✅ ${ROLES.length} roles, ${PERMISSION_CATEGORIES.reduce((s, c) => s + c.codes.length, 0)} permissions`);

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

    const us = await prisma.country.findUniqueOrThrow({ where: { code002: 'US' } });
    const flState = await prisma.state.findFirstOrThrow({ where: { countryId: us.id, stateCode: 'FL' } });

    const getOrCreateCity = async (stateId: number, cityName: string) => {
        const existing = await prisma.city.findFirst({ where: { stateId, cityName } });
        if (existing) return existing;
        return prisma.city.create({ data: { country: { connect: { id: us.id } }, state: { connect: { id: stateId } }, cityName } });
    };

    const malibuCity = await getOrCreateCity(caState.id, 'Malibu');
    const miamiCity = await getOrCreateCity(flState.id, 'Miami');

    const officeAddress = await prisma.address.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            organization: 'Luxury Estate Realty HQ',
            addressStreet: '1234 Pacific Coast Highway, Suite 500',
            city: { connect: { id: malibuCity.id } },
            region: { connect: { id: caState.id } },
            country: { connect: { id: us.id } },
            postalCode: '90265',
            latitude: 34.0259,
            longitude: -118.7798
        }
    });

    const propertyAddress1 = await prisma.address.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            addressStreet: '1234 Ocean Blvd',
            city: { connect: { id: malibuCity.id } },
            region: { connect: { id: caState.id } },
            country: { connect: { id: us.id } },
            postalCode: '90265',
            latitude: 34.035000,
            longitude: -118.678000
        }
    });

    const propertyAddress2 = await prisma.address.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            addressStreet: '5678 Collins Ave, Penthouse A',
            city: { connect: { id: miamiCity.id } },
            region: { connect: { id: flState.id } },
            country: { connect: { id: us.id } },
            postalCode: '33140',
            latitude: 25.815000,
            longitude: -80.125000
        }
    });

    console.log('👥 Seeding people & associates...');

    const internalAgent = await prisma.person.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+1-555-0198',
            email: 'sarah.j@luxuryrealty.com',
            slug: 'sarah-johnson',
            personType: { connect: { id: agentType.id } },
            isLead: false,
            isClient: false,
            isAssociate: true,
            isDisqualified: false,
            address: { connect: { id: officeAddress.id } },
            associate: {
                create: {
                    tenant: { connect: { id: DEFAULT_TENANT_ID } },
                    associateType: { connect: { id: assocAgentType.id } },
                    slug: 'sarah-johnson',
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
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            firstName: 'Michael',
            lastName: 'Torres',
            phone: '+1-555-0287',
            email: 'mtorres@partnerrealty.com',
            slug: 'michael-torres',
            personType: { connect: { id: externalAgentType.id } },
            isLead: false,
            isClient: false,
            isAssociate: false,
            isDisqualified: false
        }
    });

    const client = await prisma.person.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            firstName: 'Marcus',
            lastName: 'Chen',
            phone: '+1-555-0345',
            email: 'marcus.chen@email.com',
            slug: 'marcus-chen',
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
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            uri: 'https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propImg2 = await prisma.image.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propImg3 = await prisma.image.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000',
            isPersonal: false
        }
    });

    const propVid1 = await prisma.video.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            uri: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            isPersonal: false
        }
    });

    const empPhoto = await prisma.image.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400',
            isPersonal: true
        }
    });

    const empVideo = await prisma.video.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
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
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            phone: '+1-310-555-0100',
            name: 'Luxury Estate Realty HQ',
            slug: 'luxury-estate-realty-hq',
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
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            name: 'Modern Coastal Villa',
            description: 'Stunning oceanfront property with panoramic Pacific views, smart home automation, infinity pool, and private beach access.',
            summary: 'Luxury 4BR beachfront home with smart tech',
            slug: 'modern-coastal-villa-malibu',
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
                    { tenant: { connect: { id: DEFAULT_TENANT_ID } }, image: { connect: { id: propImg1.id } }, isBanner: true },
                    { tenant: { connect: { id: DEFAULT_TENANT_ID } }, image: { connect: { id: propImg2.id } }, isBanner: false },
                    { tenant: { connect: { id: DEFAULT_TENANT_ID } }, image: { connect: { id: propImg3.id } }, isBanner: false }
                ]
            },
            propertyVideos: {
                create: [{ tenant: { connect: { id: DEFAULT_TENANT_ID } }, video: { connect: { id: propVid1.id } } }]
            }
        }
    });

    const property2 = await prisma.property.create({
        data: {
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            name: 'Skyline Penthouse',
            description: 'Breathtaking penthouse in the heart of Miami Beach with 360-degree views of the ocean and city skyline.',
            summary: 'Ultra-luxury 3BR penthouse with ocean views',
            slug: 'skyline-penthouse-miami-beach',
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
            tenant: { connect: { id: DEFAULT_TENANT_ID } },
            name: 'Desert Oasis Villa',
            description: 'Exclusive desert villa in Cabo San Lucas with private pool, outdoor kitchen, and stunning Sea of Cortez views.',
            summary: '5BR villa with pool & ocean views',
            slug: 'desert-oasis-villa-cabo',
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
