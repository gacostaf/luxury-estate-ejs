import { config } from 'dotenv';
config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_TENANT_ID = 1;

const CITIES = [
  { name: 'Los Angeles',   lat: 34.0522,  lng: -118.2437, state: 'CA', stateCode: 'CA', zips: ['90001', '90012', '90024', '90036', '90049', '90064', '90066', '90069', '90077', '90210'] },
  { name: 'Malibu',        lat: 34.0259,  lng: -118.7798, state: 'CA', stateCode: 'CA', zips: ['90265', '90263', '90264'] },
  { name: 'Santa Monica',  lat: 34.0195,  lng: -118.4912, state: 'CA', stateCode: 'CA', zips: ['90401', '90403', '90404', '90405'] },
  { name: 'Beverly Hills', lat: 34.0736,  lng: -118.4004, state: 'CA', stateCode: 'CA', zips: ['90210', '90211', '90212'] },
  { name: 'Newport Beach', lat: 33.6189,  lng: -117.9289, state: 'CA', stateCode: 'CA', zips: ['92657', '92660', '92661', '92662', '92663'] },
  { name: 'San Diego',     lat: 32.7157,  lng: -117.1611, state: 'CA', stateCode: 'CA', zips: ['92101', '92103', '92109', '92130', '92131'] },
  { name: 'Miami',         lat: 25.7617,  lng: -80.1918,  state: 'FL', stateCode: 'FL', zips: ['33101', '33109', '33139', '33140', '33154'] },
  { name: 'Miami Beach',   lat: 25.7907,  lng: -80.1300,  state: 'FL', stateCode: 'FL', zips: ['33109', '33139', '33140', '33141'] },
  { name: 'Fort Lauderdale', lat: 26.1224, lng: -80.1373, state: 'FL', stateCode: 'FL', zips: ['33301', '33304', '33308', '33316'] },
  { name: 'Palm Beach',    lat: 26.7056,  lng: -80.0364,  state: 'FL', stateCode: 'FL', zips: ['33401', '33480', '33406'] },
];

const STREETS: Record<string, string[]> = {
  'Los Angeles':   ['Sunset Blvd', 'Wilshire Blvd', 'Mulholland Dr', 'Ocean Ave', 'Beverly Dr', 'La Cienega Blvd', 'Melrose Ave', 'Robertson Blvd'],
  'Malibu':        ['Pacific Coast Hwy', 'Malibu Rd', 'Broad Beach Rd', 'Zuma Beach Rd', 'Point Dume Rd', 'Morning View Dr'],
  'Santa Monica':  ['Ocean Park Blvd', 'Main St', 'Montana Ave', 'Santa Monica Blvd', 'Arizona Ave', 'Wilshire Blvd'],
  'Beverly Hills': ['Rodeo Dr', 'Beverly Dr', 'Canon Dr', 'Sunset Blvd', 'Santa Monica Blvd', 'Olympic Blvd'],
  'Newport Beach': ['Pacific Coast Hwy', 'Newport Blvd', 'Balboa Blvd', 'Coast Hwy', 'Bayside Dr', 'Ocean Blvd'],
  'San Diego':     ['La Jolla Blvd', 'Torrey Pines Rd', 'Mission Blvd', 'Pacific Beach Dr', 'Grand Ave', 'Coast Blvd'],
  'Miami':         ['Ocean Dr', 'Collins Ave', 'Brickell Ave', 'Coral Way', 'Flagler St', 'Biscayne Blvd'],
  'Miami Beach':   ['Ocean Dr', 'Collins Ave', 'Washington Ave', 'Lincoln Rd', 'Meridian Ave', 'Pine Tree Dr'],
  'Fort Lauderdale': ['Las Olas Blvd', 'A1A', 'Sunrise Blvd', 'Commercial Blvd', 'Federal Hwy', 'Ocean Blvd'],
  'Palm Beach':    ['Worth Ave', 'Royal Palm Way', 'Ocean Blvd', 'S County Rd', 'N County Rd', 'South Ocean Blvd'],
};

const FEATURES = [
  'Infinity Pool', 'Smart Home', 'Home Theater', 'Wine Cellar', 'Private Gym',
  'Ocean View', 'Mountain View', 'City Skyline', 'Private Beach Access',
  'Rooftop Terrace', 'Outdoor Kitchen', 'Fire Pit', 'Spa Bathroom',
  'Walk-in Closets', 'Chef Kitchen', 'EV Charger', 'Solar Panels',
  'Gated Community', 'Security System', 'Central AC',
];

const PROPERTY_NAMES = [
  'Modern Villa', 'Coastal Retreat', 'Skyline Penthouse', 'Mediterranean Estate',
  'Contemporary Home', 'Beachfront Villa', 'Hilltop Residence', 'Luxury Condo',
  'Spanish Colonial', 'Mid-Century Modern', 'Tropical Oasis', 'Executive Home',
  'Waterfront Property', 'Garden Estate', 'Penthouse Suite', 'Designer Home',
  'Custom Residence', 'Panoramic Views', 'Private Estate', 'Grand Mansion',
];

const IMAGE_DIR = '/images/seeds';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDecimal(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function toSlug(name: string, id: number): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${id}`;
}

async function main() {
  console.log('Seeding 100 properties with local images...\n');

  const propTypes = await prisma.propertyType.findMany({ where: { tenantId: DEFAULT_TENANT_ID } });
  const propStatuses = await prisma.propertyStatus.findMany({ where: { tenantId: DEFAULT_TENANT_ID } });
  const agent = await prisma.person.findFirst({ where: { tenantId: DEFAULT_TENANT_ID, isAssociate: true } });

  if (!propTypes.length) throw new Error('Run seed.ts first — no property types found');
  if (!propStatuses.length) throw new Error('Run seed.ts first — no property statuses found');
  if (!agent) throw new Error('Run seed.ts first — no associate agent found');

  const country = await prisma.country.findUnique({ where: { code002: 'US' } });
  if (!country) throw new Error('Run seed.ts first — US country not found');

  const existingCount = await prisma.property.count({ where: { tenantId: DEFAULT_TENANT_ID } });
  if (existingCount >= 100) {
    console.log(`Already have ${existingCount} properties, skipping.`);
    return;
  }

  const neededCount = 100 - existingCount;
  console.log(`Creating ${neededCount} properties...`);

  const now = new Date();

  for (let i = 0; i < neededCount; i++) {
    const idx = existingCount + i;
    const cityInfo = pick(CITIES);
    const street = pick(STREETS[cityInfo.name]);
    const streetNum = randInt(100, 9999);
    const bedrooms = randInt(2, 6);
    const bathrooms = bedrooms - randInt(0, 1);
    const areaSqft = randDecimal(1200, 6000, 0);
    const price = randInt(500000, 8000000);
    const builtYear = randInt(1985, 2025);
    const garageSpaces = randInt(1, 4);
    const nameTemplate = pick(PROPERTY_NAMES);
    const features = [...new Set(Array.from({ length: randInt(3, 6) }, () => pick(FEATURES)))];
    const latOffset = randDecimal(-0.04, 0.04, 6);
    const lngOffset = randDecimal(-0.04, 0.04, 6);

    const imageStart = (idx * 3) % 300;
    const imageFiles = [
      `house_${String(imageStart + 1).padStart(3, '0')}.jpg`,
      `house_${String(imageStart + 2).padStart(3, '0')}.jpg`,
      `house_${String(imageStart + 3).padStart(3, '0')}.jpg`,
    ];

    const images = await Promise.all(
      imageFiles.map((file, imgIdx) =>
        prisma.image.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            uri: `${IMAGE_DIR}/${file}`,
            isPersonal: false,
          },
        })
      )
    );

    const bannerImage = images[0];

    await prisma.property.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        name: `${nameTemplate} in ${cityInfo.name}`,
        description: `Stunning ${bedrooms}-bedroom ${nameTemplate.toLowerCase()} located in the prestigious ${cityInfo.name} area. Features include: ${features.join(', ')}. This beautifully designed home offers ${areaSqft} sq ft of living space with ${garageSpaces} garage spaces. Built in ${builtYear}.`,
        summary: `${bedrooms}BR ${nameTemplate} in ${cityInfo.name}`,
        slug: toSlug(`${nameTemplate} ${cityInfo.name}`, idx),
        publishDate: new Date(now.getTime() - idx * 3600000),
        price,
        bedrooms,
        bathrooms,
        areaSqft,
        garageSpaces,
        builtYear,
        streetAddress: `${streetNum} ${street}`,
        addressLocality: cityInfo.name,
        addressRegion: cityInfo.stateCode,
        postalCode: pick(cityInfo.zips),
        addressCountry: 'US',
        propertyTypeId: pick(propTypes).id,
        propertyStatusId: pick(propStatuses).id,
        agentId: agent.id,
        latitude: parseFloat((cityInfo.lat + latOffset).toFixed(6)),
        longitude: parseFloat((cityInfo.lng + lngOffset).toFixed(6)),
        mlsId: `ML-CA-${String(1000 + idx)}`,
        isPublished: true,
        bannerImageId: bannerImage.id,
        propertyImages: {
          create: images.map((img, imgIdx) => ({
            tenantId: DEFAULT_TENANT_ID,
            imageId: img.id,
            isBanner: imgIdx === 0,
          })),
        },
      },
    });

    if ((i + 1) % 25 === 0) {
      console.log(`  Created ${i + 1} / ${neededCount} properties`);
    }
  }

  const total = await prisma.property.count({ where: { tenantId: DEFAULT_TENANT_ID } });
  console.log(`\nDone! Total properties: ${total}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
