import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  { name: 'Atlanta',     lat: 33.7490,  lng: -84.3880,  zips: ['30301', '30302', '30303', '30305', '30306', '30307', '30308', '30309', '30310', '30312', '30313', '30314', '30315', '30316', '30317', '30318', '30319', '30322', '30324', '30326', '30327', '30328', '30329', '30331', '30332', '30334', '30336', '30337', '30338', '30339', '30340', '30341', '30342', '30344', '30345', '30346', '30349', '30350', '30354', '30360', '30363'] },
  { name: 'Alpharetta',  lat: 34.0754,  lng: -84.2941,  zips: ['30004', '30005', '30009', '30022', '30023'] },
  { name: 'Marietta',    lat: 33.9526,  lng: -84.5496,  zips: ['30006', '30007', '30008', '30060', '30061', '30062', '30063', '30064', '30065', '30066', '30067', '30068', '30069'] },
  { name: 'Roswell',     lat: 34.0232,  lng: -84.3616,  zips: ['30075', '30076', '30077'] },
  { name: 'Sandy Springs', lat: 33.9307, lng: -84.3736, zips: ['30328', '30338', '30342', '30350', '30358'] },
  { name: 'Johns Creek', lat: 34.0259,  lng: -84.1981,  zips: ['30005', '30022', '30024', '30097'] },
  { name: 'Decatur',     lat: 33.7748,  lng: -84.2963,  zips: ['30030', '30031', '30032', '30033'] },
  { name: 'Smyrna',      lat: 33.8839,  lng: -84.5144,  zips: ['30080', '30081', '30082'] },
  { name: 'Brookhaven',  lat: 33.8590,  lng: -84.3392,  zips: ['30319', '30341'] },
  { name: 'Dunwoody',    lat: 33.9466,  lng: -84.3349,  zips: ['30338', '30346', '30356', '30360'] },
];

const STREETS = {
  'Atlanta': [
    'Peachtree St NE', 'Peachtree Rd NW', 'Boulevard SE', 'Piedmont Ave NE',
    'Moreland Ave NE', 'Ponce de Leon Ave NE', 'Howell Mill Rd NW',
    'North Highland Ave NE', 'Virginia Ave NE', 'Memorial Dr SE',
    'Cascade Rd SW', 'Fulton Industrial Blvd SW', 'Campbellton Rd SW',
    'Capitol Ave SE', 'Martin Luther King Jr Dr SW', 'Auburn Ave NE',
    'Edgewood Ave SE', 'Marietta St NW', 'Spring St NW', 'West Peachtree St NW',
  ],
  'Alpharetta': [
    'Old Milton Pkwy', 'North Point Pkwy', 'Haynes Bridge Rd',
    'Windward Pkwy', 'Kimball Bridge Rd', 'Jones Bridge Rd',
    'Mansell Rd', 'Rucker Rd', 'McFarland Pkwy', 'Webb Bridge Rd',
  ],
  'Marietta': [
    'Roswell Rd', 'Canton Rd', 'South Marietta Pkwy',
    'Powder Springs St', 'Austell Rd', 'Whitlock Ave',
    'Church St', 'Delk Rd', 'Barrett Pkwy', 'Terrell Mill Rd',
  ],
  'Roswell': [
    'Holcomb Bridge Rd', 'Alpharetta Hwy', 'Crabapple Rd',
    'Old Roswell Rd', 'Grimes Bridge Rd', 'Houze Rd',
    'Crossville Rd', 'Coleman Rd', 'Mountain Park Rd', 'Riverside Rd',
  ],
  'Sandy Springs': [
    'Roswell Rd', 'Mount Vernon Hwy', 'Dunwoody Club Dr',
    'Peachtree-Dunwoody Rd', 'Aberdeen Way', 'Hammond Dr',
    'Barfield Rd', 'Glenridge Dr', 'Johnson Ferry Rd', 'Northside Dr',
  ],
  'Johns Creek': [
    'Medlock Bridge Rd', 'State Bridge Rd', 'Abbotts Bridge Rd',
    'Old Alabama Rd', 'Peachtree Pkwy', 'Brumbelow Rd',
    'Jones Bridge Rd', 'McFarland Pkwy', 'Bell Rd', 'Taylor Rd',
  ],
  'Decatur': [
    'Ponce de Leon Pl', 'Church St', 'W Trinity Pl',
    'Commerce Dr', 'Clairemont Ave', 'Scott Blvd',
    'N Decatur Rd', 'E College Ave', 'S Candler St', 'W Ponce de Leon Ave',
  ],
  'Smyrna': [
    'Atlanta Rd', 'Cobb Pkwy', 'Spring Rd',
    'Windy Hill Rd', 'Concord Rd', 'South Cobb Dr',
    'Pat Mell Rd', 'Paces Ferry Rd', 'Nickajack Rd', 'Campbell Rd',
  ],
  'Brookhaven': [
    'Peachtree Rd NE', 'Briarcliff Rd NE', 'Buford Hwy NE',
    'Ashford Dunwoody Rd', 'Osborne Rd', 'Appalachee Dr',
    'Rainbow Dr', 'Chestnut Lake Dr', 'Bent Creek Dr', 'Dresden Dr',
  ],
  'Dunwoody': [
    'Chamblee Dunwoody Rd', 'Mount Vernon Rd', 'Tilly Mill Rd',
    'N Peachtree Rd', 'Roberts Dr', 'Jett Ferry Rd',
    'Womack Rd', 'Dunwoody Village Pkwy', 'Perimiter Center W', 'Ashford Center Pkwy',
  ],
};

const AMENITIES = ['Pool', 'Gym', 'Ocean View', 'Smart Home', 'Elevator', 'Home Theater'];

const PROPERTY_TYPES_MAP = {
  'apartment': { minArea: 760, maxArea: 1500 },
  'condo':     { minArea: 760, maxArea: 1500 },
  'villa':     { minArea: 1500, maxArea: 5000 },
  'house':     { minArea: 1500, maxArea: 5000 },
};

const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600566753086-00f18f6bae60?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1613977257363-707ba9348224?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1613977257592-4870e5dcd7d1?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600563444444-4d0e9b5e65d1?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600566753086-00f18f6bae60?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=2000',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=2000',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDecimal(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function toSlug(name: string, id: number): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + `-${id}`;
}

async function main() {
  console.log('🌱 Starting Atlanta property seed...\n');

  const us = await prisma.country.upsert({
    where: { code002: 'US' },
    update: {},
    create: { name: 'United States', code002: 'US', code003: 'USA', codenum: '840', tld: '.us' },
  });

  const gaState = await prisma.state.upsert({
    where: { uq_country_state: { countryId: us.id, stateCode: 'GA' } },
    update: {},
    create: { countryId: us.id, stateCode: 'GA', territory: 'Georgia' },
  });

  const getOrCreateCity = async (cityName: string) => {
    const existing = await prisma.city.findFirst({ where: { stateId: gaState.id, cityName } });
    if (existing) return existing;
    return prisma.city.create({ data: { countryId: us.id, stateId: gaState.id, cityName } });
  };

  const getOrCreatePropertyType = async (name: string) => {
    return prisma.propertyType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  };

  const forSaleStatus = await prisma.propertyStatus.findFirstOrThrow({ where: { name: 'for_sale' } });

  const houseType = await getOrCreatePropertyType('house');
  const condoType = await getOrCreatePropertyType('condo');
  const villaType = await getOrCreatePropertyType('villa');
  const aptType = await getOrCreatePropertyType('apartment');
  const typeIds = [houseType, condoType, villaType, aptType];
  const typeNames: (keyof typeof PROPERTY_TYPES_MAP)[] = ['house', 'condo', 'villa', 'apartment'];

  const existingAgent = await prisma.person.findFirst({ where: { email: 'sarah.j@luxuryrealty.com' } });

  let agent: { id: number };
  if (!existingAgent) {
    const agentPersonType = await prisma.personType.findFirstOrThrow({ where: { name: 'AGENT' } });
    agent = await prisma.person.create({
      data: {
        firstName: 'Atlanta',
        lastName: 'Agent',
        phone: '+1-404-555-0100',
        email: 'atlanta.agent@luxuryrealty.com',
        personTypeId: agentPersonType.id,
        isAssociate: true,
        slug: 'atlanta-agent',
      },
    });
  } else {
    agent = existingAgent;
  }

  console.log('📍 Creating cities and addresses...\n');

  const cityRecords: { name: string; record: { id: number } }[] = [];
  for (const c of CITIES) {
    const record = await getOrCreateCity(c.name);
    cityRecords.push({ name: c.name, record });
  }

  const propertyTypes = [houseType, condoType, villaType, aptType];

  const existingCount = await prisma.property.count({
    where: { addressLocality: { in: CITIES.map(c => c.name) } },
  });

  if (existingCount >= 100) {
    console.log(`  ✅ ${existingCount} Atlanta properties already exist, skipping.`);
    return;
  }

  const neededCount = 100 - existingCount;
  console.log(`  Creating ${neededCount} new Atlanta properties...\n`);

  const properties: {
    name: string;
    description: string;
    summary: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    garageSpaces: number;
    builtYear: number;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    propertyTypeId: number;
    propertyStatusId: number;
    agentId: number;
    latitude: number;
    longitude: number;
    images: { id: number }[];
  }[] = [];

  for (let i = 0; i < neededCount; i++) {
    const cityInfo = pick(cityRecords);
    const cityData = CITIES.find(c => c.name === cityInfo.name)!;
    const street = pick(STREETS[cityInfo.name as keyof typeof STREETS] || STREETS['Atlanta']);
    const streetNum = randInt(100, 9999);
    const typeIndex = i % typeNames.length;
    const typeName = typeNames[typeIndex];
    const areaRange = PROPERTY_TYPES_MAP[typeName];
    const bedrooms = randInt(1, 5);
    const bathrooms = bedrooms;
    const areaSqft = randDecimal(areaRange.minArea, areaRange.maxArea, 0);
    const price = randInt(250000, 1500000);
    const builtYear = randInt(1990, 2025);
    const garageSpaces = randInt(0, 4);

    const latOffset = randDecimal(-0.05, 0.05, 6);
    const lngOffset = randDecimal(-0.05, 0.05, 6);
    const latitude = parseFloat((cityData.lat + latOffset).toFixed(6));
    const longitude = parseFloat((cityData.lng + lngOffset).toFixed(6));

    const selectedAmenities = pickN(AMENITIES, 2, 4);
    const amenitiesText = selectedAmenities.join(', ');

    const typeLabel = typeName.charAt(0).toUpperCase() + typeName.slice(1);

    properties.push({
      name: `${typeLabel} in ${cityInfo.name}`,
      description: `Beautiful ${bedrooms}-bedroom ${typeName} in the heart of ${cityInfo.name}, GA. Features include: ${amenitiesText}. This well-maintained property offers ${areaSqft} sq ft of living space with ${garageSpaces} garage spaces. Built in ${builtYear}.`,
      summary: `${bedrooms}BR ${typeName} with ${amenitiesText.toLowerCase()} in ${cityInfo.name}`,
      price,
      bedrooms,
      bathrooms,
      areaSqft,
      garageSpaces,
      builtYear,
      streetAddress: `${streetNum} ${street}`,
      addressLocality: cityInfo.name,
      addressRegion: 'GA',
      postalCode: pick(cityData.zips),
      addressCountry: 'US',
      propertyTypeId: pick(propertyTypes).id,
      propertyStatusId: forSaleStatus.id,
      agentId: agent.id,
      latitude,
      longitude,
      images: [],
    });
  }

  const mlsCounter = 100000;
  const now = new Date();

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const idx = existingCount + i;

    const images: { id: number }[] = [];
    const numImages = randInt(2, 3);
    const selectedUrls = pickN(IMAGE_URLS, numImages, numImages);

    for (const url of selectedUrls) {
      const img = await prisma.image.create({
        data: { uri: url, isPersonal: false },
      });
      images.push(img);
    }

    const bannerImage = images[0];

    const property = await prisma.property.create({
      data: {
        name: p.name,
        description: p.description,
        summary: p.summary,
        slug: toSlug(p.name, mlsCounter + idx),
        publishDate: new Date(now.getTime() - idx * 3600000),
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        areaSqft: p.areaSqft,
        garageSpaces: p.garageSpaces,
        builtYear: p.builtYear,
        streetAddress: p.streetAddress,
        addressLocality: p.addressLocality,
        addressRegion: p.addressRegion,
        postalCode: p.postalCode,
        addressCountry: p.addressCountry,
        propertyTypeId: p.propertyTypeId,
        propertyStatusId: p.propertyStatusId,
        agentId: p.agentId,
        latitude: p.latitude,
        longitude: p.longitude,
        mlsId: `ML-ATL-${1000 + idx}`,
        isPublished: true,
        bannerImageId: bannerImage.id,
        propertyImages: {
          create: images.map((img, imgIdx) => ({
            imageId: img.id,
            isBanner: imgIdx === 0,
          })),
        },
      },
    });

    if ((i + 1) % 25 === 0) {
      console.log(`  ✅ Created ${i + 1} / ${properties.length} properties`);
    }
  }

  console.log(`\n✅ Atlanta seed complete!`);

  const total = await prisma.property.count({
    where: { addressLocality: { in: CITIES.map(c => c.name) } },
  });
  console.log(`  Total Atlanta properties: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
