import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { GET as listAddresses, POST as createAddress } from '@/app/api/addresses/route';
import { GET as getAddress, PUT as updateAddress, DELETE as deleteAddress } from '@/app/api/addresses/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, createTestAddress } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Addresses API', () => {
  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  describe('GET /api/addresses', () => {
    it('should return empty list when no addresses exist', async () => {
      const res = await listAddresses();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return all addresses', async () => {
      await createTestAddress({ addressLocality: 'CityA' });
      await createTestAddress({ addressLocality: 'CityB' });
      const res = await listAddresses();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
    });
  });

  describe('POST /api/addresses', () => {
    it('should create a new address', async () => {
      const payload = {
        streetAddress: '456 Oak Ave',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        postalCode: '33101',
        addressCountry: 'US',
      };
      const req = createMockRequest(payload, 'http://localhost/api/addresses', 'POST');
      const res = await createAddress(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.streetAddress).toBe('456 Oak Ave');
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest({}, 'http://localhost/api/addresses', 'POST');
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
    it('should update an address', async () => {
      const addr = await createTestAddress();
      const req = createMockRequest(
        { streetAddress: '789 Pine St', addressLocality: 'Orlando', addressRegion: 'FL', postalCode: '32801', addressCountry: 'US' },
        'http://localhost/api/addresses/1',
        'PUT'
      );
      const res = await updateAddress(req, params(String(addr.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.streetAddress).toBe('789 Pine St');
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(
        { streetAddress: 'X', addressLocality: 'Y', addressRegion: 'Z', postalCode: '00000', addressCountry: 'US' },
        'http://localhost/api/addresses/99999',
        'PUT'
      );
      const res = await updateAddress(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/addresses/[id]', () => {
    it('should delete an address', async () => {
      const addr = await createTestAddress();
      const res = await deleteAddress(createMockRequest(), params(String(addr.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.address.findUnique({ where: { id: addr.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteAddress(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
