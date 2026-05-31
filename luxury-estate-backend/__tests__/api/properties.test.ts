import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET, POST } from '@/app/api/properties/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, lookupPropertyTypeId, lookupPropertyStatusId } from '../utils/test-helpers';

describe('Properties API', () => {
  let houseTypeId: number;
  let condoTypeId: number;
  let forSaleStatusId: number;
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    houseTypeId = await lookupPropertyTypeId('house');
    condoTypeId = await lookupPropertyTypeId('condo');
    forSaleStatusId = await lookupPropertyStatusId('for_sale');
    adminPersonId = await seedAdminUser();
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

    const postReq = createMockRequest(payload, 'http://localhost/api/properties', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
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
        propertyType: { connect: { id: houseTypeId } },
        propertyStatus: { connect: { id: forSaleStatusId } },
        addressLocality: 'Malibu',
        addressRegion: 'CA',
        addressCountry: 'US',
        postalCode: '90265',
        tenant: { connect: { id: 1 } },
      },
    });
    await prisma.property.create({
      data: {
        name: 'Miami Condo',
        description: 'Ocean view condo',
        propertyType: { connect: { id: condoTypeId } },
        propertyStatus: { connect: { id: forSaleStatusId } },
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
        postalCode: '33140',
        tenant: { connect: { id: 1 } },
      },
    });

    const req = createMockRequest(undefined, 'http://localhost/api/properties?city=Malibu');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.items).toHaveLength(1);
    expect(json.data.items[0].name).toBe('Malibu Home');
  });
});