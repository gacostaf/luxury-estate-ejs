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

    // Contact Methods
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

    // Lead Sources
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