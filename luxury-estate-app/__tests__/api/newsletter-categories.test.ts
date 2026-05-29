import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listCategories, POST as createCategory } from '@/app/api/newsletter-categories/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser } from '../utils/test-helpers';

describe('Newsletter Categories API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/newsletter-categories', () => {
    it('should return empty list when no categories exist', async () => {
      const res = await listCategories();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return categories ordered by name', async () => {
      await prisma.newsletterCategory.createMany({
        data: [
          { name: 'Zeta' },
          { name: 'Alpha' },
        ],
      });
      const res = await listCategories();
      const json = await res.json();
      expect(json.data).toHaveLength(2);
      expect(json.data[0].name).toBe('Alpha');
      expect(json.data[1].name).toBe('Zeta');
    });
  });

  describe('POST /api/newsletter-categories', () => {
    it('should create a category', async () => {
      const payload = { name: 'Market Reports' };
      const req = createMockRequest(payload, undefined, 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createCategory(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.name).toBe('Market Reports');
    });

    it('should return 401 without auth', async () => {
      const payload = { name: 'Test' };
      const req = createMockRequest(payload, undefined, 'POST');
      const res = await createCategory(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing name', async () => {
      const req = createMockRequest({}, undefined, 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createCategory(req);
      expect(res.status).toBe(400);
    });
  });
});
