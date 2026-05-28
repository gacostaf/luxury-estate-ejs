import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { GET as listAddresses, POST as createAddress } from '@/app/api/addresses/route';
import { GET as getAddress, PUT as updateAddress, DELETE as deleteAddress } from '@/app/api/addresses/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser, createTestAddress } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Addresses API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/addresses', () => {
    it('should return empty list when no addresses exist', async () => {
      const res = await listAddresses();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return all addresses', async () => {
      await createTestAddress();
      await createTestAddress();
      const res = await listAddresses();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
    });
  });

  describe('POST /api/addresses', () => {
    let usaId: number;
    let caId: number;
    let cityId: number;

    beforeAll(async () => {
      await seedLookupTables();
      const usa = await prisma.country.findUniqueOrThrow({ where: { codenum: '840' } });
      usaId = usa.id;
      const ca = await prisma.state.findFirstOrThrow({ where: { stateCode: 'CA' } });
      caId = ca.id;
      const city = await prisma.city.create({
        data: { countryId: usaId, stateId: caId, cityName: 'Miami' },
      });
      cityId = city.id;
    });

    it('should create a new address', async () => {
      const payload = {
        addressStreet: '456 Oak Ave',
        addressCityId: cityId,
        addressRegionId: caId,
        postalCode: '33101',
        addressCountryId: usaId,
      };
      const req = createMockRequest(payload, 'http://localhost/api/addresses', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createAddress(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.addressStreet).toBe('456 Oak Ave');
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest({}, 'http://localhost/api/addresses', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createAddress(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/addresses/[id]', () => {
    it('should return address by id', async () => {
      const addr = await createTestAddress();
      const res = await getAddress(createMockRequest(), params(String(addr.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(addr.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getAddress(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/addresses/[id]', () => {
    let usaId: number;
    let caId: number;
    let orlandoCityId: number;

    beforeAll(async () => {
      const usa = await prisma.country.findUniqueOrThrow({ where: { codenum: '840' } });
      usaId = usa.id;
      const ca = await prisma.state.findFirstOrThrow({ where: { stateCode: 'CA' } });
      caId = ca.id;
      const fl = await prisma.state.findFirstOrThrow({ where: { stateCode: 'FL' } });
      const city = await prisma.city.create({
        data: { countryId: usaId, stateId: fl.id, cityName: 'Orlando' },
      });
      orlandoCityId = city.id;
    });

    it('should update an address', async () => {
      const addr = await createTestAddress();
      const req = createMockRequest(
        { addressStreet: '789 Pine St', addressCityId: orlandoCityId, addressRegionId: caId, postalCode: '32801', addressCountryId: usaId },
        'http://localhost/api/addresses/1',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateAddress(req, params(String(addr.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.addressStreet).toBe('789 Pine St');
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(
        { addressStreet: 'X', addressCityId: orlandoCityId, addressRegionId: caId, postalCode: '00000', addressCountryId: usaId },
        'http://localhost/api/addresses/99999',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateAddress(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/addresses/[id]', () => {
    it('should delete an address', async () => {
      const addr = await createTestAddress();
      const res = await deleteAddress(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params(String(addr.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.address.findUnique({ where: { id: addr.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteAddress(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
