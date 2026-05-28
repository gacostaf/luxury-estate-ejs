import { prisma } from '@/lib/prisma';

export async function clearTestDatabase() {
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
    await prisma.personType.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of ['house', 'condo', 'villa', 'townhouse', 'penthouse', 'land']) {
    await prisma.propertyType.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of ['for_sale', 'for_rent', 'sold', 'pending']) {
    await prisma.propertyStatus.upsert({ where: { name }, update: {}, create: { name } });
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
}

export async function lookupPersonTypeId(name: string) {
  return (await prisma.personType.findUniqueOrThrow({ where: { name } })).id;
}

export async function lookupPropertyTypeId(name: string) {
  return (await prisma.propertyType.findUniqueOrThrow({ where: { name } })).id;
}

export async function lookupPropertyStatusId(name: string) {
  return (await prisma.propertyStatus.findUniqueOrThrow({ where: { name } })).id;
}

export async function createTestPerson(overrides = {}) {
  await seedLookupTables();
  const clientType = await prisma.personType.findUniqueOrThrow({ where: { name: 'CLIENT' } });
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
  return prisma.address.create({
    data: {
      streetAddress: '123 Test St',
      addressLocality: 'TestCity',
      addressRegion: 'TC',
      postalCode: '12345',
      addressCountry: 'US',
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
  const houseType = await prisma.propertyType.findUniqueOrThrow({ where: { name: 'house' } });
  const forSaleStatus = await prisma.propertyStatus.findUniqueOrThrow({ where: { name: 'for_sale' } });
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
