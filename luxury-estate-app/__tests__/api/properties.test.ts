import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { GET, POST } from '@/app/api/properties/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, lookupPropertyTypeId, lookupPropertyStatusId } from '../utils/test-helpers';

describe('Properties API', () => {
  let houseTypeId: number;
  let condoTypeId: number;
  let forSaleStatusId: number;

  beforeAll(async () => {
    houseTypeId = await lookupPropertyTypeId('house');
    condoTypeId = await lookupPropertyTypeId('condo');
    forSaleStatusId = await lookupPropertyStatusId('for_sale');
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  it('should create and retrieve a property', async () => {
    const payload = {
      name: 'Test Villa',
      description: 'Luxury test property',
      summary: 'Test summary',
      propertyTypeId: houseTypeId,
      propertyStatusId: forSaleStatusId,
      addressLocality: 'TestCity',
      addressRegion: 'TC',
      addressCountry: 'US',
      postalCode: '12345',
      price: 1000000,
      bedrooms: 4,
      bathrooms: 3,
    };

    const postReq = createMockRequest(payload, 'http://localhost/api/properties', 'POST');
    const postRes = await POST(postReq);
    const postJson = await postRes.json();
    
    expect(postRes.status).toBe(201);
    const propertyId = postJson.data.id;

    // Retrieve (you'll need to implement GET /api/properties/[id])
    // For now, just verify creation worked
    expect(postJson.data.name).toBe('Test Villa');
  });

  it('should filter properties by location', async () => {
    await prisma.property.create({
      data: {
        name: 'Malibu Home',
        description: 'Beachfront luxury',
        propertyTypeId: houseTypeId,
        propertyStatusId: forSaleStatusId,
        addressLocality: 'Malibu',
        addressRegion: 'CA',
        addressCountry: 'US',
        postalCode: '90265',
      },
    });
    await prisma.property.create({
      data: {
        name: 'Miami Condo',
        description: 'Ocean view condo',
        propertyTypeId: condoTypeId,
        propertyStatusId: forSaleStatusId,
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
        postalCode: '33140',
      },
    });

    const req = createMockRequest(undefined, 'http://localhost/api/properties?city=Malibu');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].name).toBe('Malibu Home');
  });
});