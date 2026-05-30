import { prisma } from '@/lib/prisma';

export async function clearTestDatabase() {
  await prisma.newsletterSubscriptionCategory.deleteMany();
  await prisma.newsletterCampaign.deleteMany();
  await prisma.newsletterContent.deleteMany();
  await prisma.newsletterSection.deleteMany();
  await prisma.newsletterIssue.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.newsletterCategory.deleteMany();
  await prisma.newsletterContentType.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.tourRequest.deleteMany();
  await prisma.propertyInquiry.deleteMany();
  await prisma.propertyReview.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.associate.deleteMany();
  await prisma.personPermission.deleteMany();
  await prisma.personRole.deleteMany();
  await prisma.authAccount.deleteMany();
  await prisma.video.deleteMany();
  await prisma.image.deleteMany();
  await prisma.person.deleteMany();
  await prisma.office.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.address.deleteMany();
}

export async function seedLookupTables() {
  for (const name of ['CLIENT', 'AGENT', 'BROKER', 'REALTOR', 'VP', 'OWNER', 'EXTERNAL_AGENT']) {
    await prisma.personType.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.replace(/_/g, ' ').toLowerCase()} type` } });
  }

  for (const name of ['house', 'condo', 'villa', 'townhouse', 'penthouse', 'land']) {
    await prisma.propertyType.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name} property type` } });
  }

  for (const name of ['for_sale', 'for_rent', 'sold', 'pending']) {
    await prisma.propertyStatus.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.replace(/_/g, ' ')} property status` } });
  }

  await prisma.country.upsert({
    where: { codenum: '840' },
    update: {},
    create: { codenum: '840', name: 'United States', code002: 'US', code003: 'USA', tld: '.us' }
  });
  await prisma.country.upsert({
    where: { codenum: '484' },
    update: {},
    create: { codenum: '484', name: 'Mexico', code002: 'MX', code003: 'MEX', tld: '.mx' }
  });

  const usa = await prisma.country.findUnique({ where: { codenum: '840' } });
  await prisma.state.upsert({
    where: { uq_country_state: { countryId: usa!.id, stateCode: 'CA' } },
    update: {},
    create: { countryId: usa!.id, stateCode: 'CA', territory: 'California' }
  });
  await prisma.state.upsert({
    where: { uq_country_state: { countryId: usa!.id, stateCode: 'FL' } },
    update: {},
    create: { countryId: usa!.id, stateCode: 'FL', territory: 'Florida' }
  });

  for (const name of ['AGENT', 'BROKER', 'REALTOR', 'ASSISTANT']) {
    await prisma.associateType.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.toLowerCase()} role` } });
  }

  const TOUR_TYPES = [
    { code: 'in_person', name: 'In-Person Tour', description: 'In-Person Tour' },
    { code: 'virtual', name: 'Virtual Tour', description: 'Virtual Tour' },
    { code: 'private_showing', name: 'Private Showing', description: 'Private Showing' },
    { code: 'open_house', name: 'Open House Visit', description: 'Open House Visit' },
    { code: 'broker_tour', name: 'Broker Tour', description: 'Broker Tour' },
    { code: 'video_walkthrough', name: 'Video Walkthrough', description: 'Video Walkthrough' },
    { code: 'new_construction', name: 'New Construction Tour', description: 'New Construction Tour' },
    { code: 'investment', name: 'Investment Property Tour', description: 'Investment Property Tour' },
  ];
  for (const tt of TOUR_TYPES) {
    await prisma.tourType.upsert({ where: { code: tt.code }, update: {}, create: tt });
  }

  for (const name of ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']) {
    await prisma.tourStatus.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.toLowerCase().replace(/_/g, ' ')} tour status` } });
  }

  for (const name of ['GENERAL', 'SALES', 'SUPPORT', 'PARTNERSHIP']) {
    await prisma.requestType.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.toLowerCase()} request type` } });
  }

  for (const name of ['NEW', 'OPEN', 'HOLD', 'CLOSED']) {
    await prisma.requestStatus.upsert({ where: { code: name }, update: {}, create: { code: name, name, description: `${name.toLowerCase()} request status` } });
  }

  for (const cm of [
    { code: 'EMAIL', name: 'Email', description: 'Email communication' },
    { code: 'PHONE', name: 'Phone', description: 'Phone call' },
    { code: 'SMS', name: 'SMS', description: 'Text message (SMS)' },
    { code: 'WHATSAPP', name: 'WhatsApp', description: 'WhatsApp messaging' },
    { code: 'TELEGRAM', name: 'Telegram', description: 'Telegram messaging' },
    { code: 'PORTAL', name: 'Portal', description: 'Client portal' },
  ]) {
    await prisma.contactMethod.upsert({ where: { code: cm.code }, update: {}, create: cm });
  }

  for (const ls of [
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
  ]) {
    await prisma.leadSource.upsert({ where: { code: ls.code }, update: {}, create: ls });
  }
}

export async function lookupPersonTypeId(name: string) {
  return (await prisma.personType.findUniqueOrThrow({ where: { code: name } })).id;
}

export async function lookupPropertyTypeId(name: string) {
  return (await prisma.propertyType.findUniqueOrThrow({ where: { code: name } })).id;
}

export async function lookupPropertyStatusId(name: string) {
  return (await prisma.propertyStatus.findUniqueOrThrow({ where: { code: name } })).id;
}

export async function lookupAssociateTypeId(name: string) {
  return (await prisma.associateType.findUniqueOrThrow({ where: { code: name } })).id;
}

export async function createTestPerson(overrides = {}) {
  await seedLookupTables();
  const clientType = await prisma.personType.findUniqueOrThrow({ where: { code: 'CLIENT' } });
  return prisma.person.create({
    data: {
      firstName: 'Test',
      lastName: 'Person',
      email: `test-${Date.now()}@example.com`,
      personTypeId: clientType.id,
      ...overrides,
    },
  });
}

export async function createTestAddress(overrides = {}) {
  await seedLookupTables();
  const usa = await prisma.country.findUniqueOrThrow({ where: { codenum: '840' } });
  const caState = await prisma.state.findFirstOrThrow({ where: { stateCode: 'CA' } });
  const city = await prisma.city.create({
    data: { countryId: usa.id, stateId: caState.id, cityName: 'TestCity' },
  });
  return prisma.address.create({
    data: {
      addressStreet: '123 Test St',
      addressCityId: city.id,
      addressRegionId: caState.id,
      postalCode: '12345',
      addressCountryId: usa.id,
      ...overrides,
    },
  });
}

export async function createTestImage(overrides = {}) {
  return prisma.image.create({
    data: {
      uri: `https://example.com/img-${Date.now()}.jpg`,
      isPersonal: false,
      ...overrides,
    },
  });
}

export async function createTestVideo(overrides = {}) {
  return prisma.video.create({
    data: {
      uri: `https://example.com/vid-${Date.now()}.mp4`,
      isPersonal: false,
      ...overrides,
    },
  });
}

export async function createTestOffice(overrides = {}) {
  return prisma.office.create({
    data: {
      phone: '555-1234',
      ...overrides,
    },
  });
}

export async function seedAdminUser() {
  await seedLookupTables();

  const allPermCodes = [
    'person:read', 'person:create', 'person:update', 'person:delete',
    'property:read', 'property:create', 'property:update', 'property:delete',
    'associate:read', 'associate:create', 'associate:update', 'associate:delete',
    'agency:read', 'agency:create', 'agency:update', 'agency:delete',
    'blog:read', 'blog:create', 'blog:update', 'blog:delete',
    'office:read', 'office:create', 'office:update', 'office:delete',
    'image:read', 'image:create', 'image:update', 'image:delete',
    'video:read', 'video:create', 'video:update', 'video:delete',
    'review:moderate', 'review:delete',
    'admin:access',
  ];

  for (const code of allPermCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { name: code, code, description: code },
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { name: 'Administrator', code: 'ADMIN', description: 'System admin' },
  });

  for (const code of allPermCodes) {
    const perm = await prisma.permission.findUniqueOrThrow({ where: { code } });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  const clientTypeId = await lookupPersonTypeId('CLIENT');
  const person = await prisma.person.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: `admin-${Date.now()}@test.com`,
      personTypeId: clientTypeId,
    },
  });

  await prisma.personRole.create({
    data: { personId: person.id, roleId: adminRole.id },
  });

  return person.id;
}

export async function createTestProperty(overrides = {}) {
  await seedLookupTables();
  const houseType = await prisma.propertyType.findUniqueOrThrow({ where: { code: 'house' } });
  const forSaleStatus = await prisma.propertyStatus.findUniqueOrThrow({ where: { code: 'for_sale' } });
  return prisma.property.create({
    data: {
      name: 'Test Property',
      description: 'Test description',
      summary: 'Test summary',
      propertyTypeId: houseType.id,
      propertyStatusId: forSaleStatus.id,
      addressLocality: 'TestCity',
      addressRegion: 'TC',
      addressCountry: 'US',
      postalCode: '12345',
      ...overrides,
    },
  });
}
