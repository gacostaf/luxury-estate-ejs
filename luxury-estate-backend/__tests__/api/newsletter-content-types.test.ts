import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listContentTypes } from '@/app/api/newsletter-content-types/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData } from '../utils/test-helpers';

describe('Newsletter Content Types API', () => {
  beforeEach(async () => {
    await clearTransactionalData();
  });

  describe('GET /api/newsletter-content-types', () => {
    it('should return empty list when no types exist', async () => {
      const res = await listContentTypes(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return content types ordered by name', async () => {
      await prisma.newsletterContentType.createMany({
        data: [
          { code: 'property', name: 'Property', tenantId: 1 },
          { code: 'blog_post', name: 'Blog Post', tenantId: 1 },
        ],
      });
      const res = await listContentTypes(createMockRequest());
      const json = await res.json();
      expect(json.data).toHaveLength(2);
    });
  });
});
