// jest.setup.ts
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// ✅ Load test environment variables
config({ path: '.env.test' });

// ✅ Set global test timeout
jest.setTimeout(30000);

// ✅ Suppress React 19 peer dependency warnings
if (typeof window === 'undefined' && process.env.NODE_ENV === 'test') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('UNSAFE_componentWillReceiveProps') ||
        args[0].includes('ModelCollapse') ||
        args[0].includes('react-copy-to-clipboard'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

// ✅ Seed lookup tables before all tests
beforeAll(async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL },
    },
  });

  try {
    // Person Types
    for (const name of ['CLIENT', 'AGENT', 'BROKER', 'REALTOR', 'VP', 'OWNER', 'EXTERNAL_AGENT']) {
      await prisma.personType.upsert({ where: { code: name }, update: {}, create: { code: name, name } });
    }

    // Property Types
    for (const name of ['house', 'condo', 'villa', 'townhouse', 'penthouse', 'land']) {
      await prisma.propertyType.upsert({ where: { code: name }, update: {}, create: { code: name, name } });
    }

    // Property Status
    for (const name of ['for_sale', 'for_rent', 'sold', 'pending']) {
      await prisma.propertyStatus.upsert({ where: { code: name }, update: {}, create: { code: name, name } });
    }

    // Disqualification Statuses
    for (const name of [
      'NOT A FIT/BUDGET',
      'LOST TO COMPETITION',
      'UNRESPONSIVE / DEAD',
      'POSTPONED (NURTURE)'
    ]) {
      const code = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      await prisma.disqualificationStatus.upsert({ where: { code }, update: {}, create: { code, name } });
    }

    // Countries
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

    // States
    const usa = await prisma.country.findUnique({ where: { codenum: '840' } });
    const mexico = await prisma.country.findUnique({ where: { codenum: '484' } });

    if (usa) {
      await prisma.state.upsert({
        where: { uq_country_state: { countryId: usa.id, stateCode: 'CA' } },
        update: {},
        create: { countryId: usa.id, stateCode: 'CA', territory: 'California' }
      });
      await prisma.state.upsert({
        where: { uq_country_state: { countryId: usa.id, stateCode: 'FL' } },
        update: {},
        create: { countryId: usa.id, stateCode: 'FL', territory: 'Florida' }
      });
    }
    if (mexico) {
      await prisma.state.upsert({
        where: { uq_country_state: { countryId: mexico.id, stateCode: 'BCN' } },
        update: {},
        create: { countryId: mexico.id, stateCode: 'BCN', territory: 'Baja California Norte' }
      });
    }

    console.log('✅ Lookup tables seeded for tests');
  } catch (error) {
    console.error('❌ Failed to seed lookup tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});

// ✅ Cleanup after all tests
afterAll(async () => {
  // Prisma client disconnect handled by test helpers or singleton
});