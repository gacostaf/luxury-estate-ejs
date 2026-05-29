import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listContentTypes } from '@/app/api/newsletter-content-types/route';
import { prisma } from '@/lib/prisma';
import { clearTestDatabase, seedLookupTables } from '../utils/test-helpers';

describe('Newsletter Content Types API', () => {
  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  describe('GET /api/newsletter-content-types', () => {
    it('should return empty list when no types exist', async () => {
      const res = await listContentTypes();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return content types ordered by name', async () => {
      await prisma.newsletterContentType.createMany({
        data: [
          { name: 'Property' },
          { name: 'Blog Post' },
        ],
      });
      const res = await listContentTypes();
      const json = await res.json();
      expect(json.data).toHaveLength(2);
    });
  });
});
