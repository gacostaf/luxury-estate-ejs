import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listRelations, POST as createRelation } from '@/app/api/property-images/route';
import { GET as getRelation, PUT as updateRelation, DELETE as deleteRelation } from '@/app/api/property-images/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, createTestProperty, createTestImage } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Property-Images API', () => {
  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  describe('GET /api/property-images', () => {
    it('should return empty list when no relations exist', async () => {
      const req = createMockRequest(undefined, 'http://localhost/api/property-images');
      const res = await listRelations(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by propertyId', async () => {
      const prop = await createTestProperty();
      const img = await createTestImage();
      await prisma.propertyImage.create({ data: { propertyId: prop.id, imageId: img.id } });

      const req = createMockRequest(undefined, `http://localhost/api/property-images?propertyId=${prop.id}`);
      const res = await listRelations(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].propertyId).toBe(prop.id);
    });
  });

  describe('POST /api/property-images', () => {
    it('should create a relation between property and image', async () => {
      const prop = await createTestProperty();
      const img = await createTestImage();
      const payload = { propertyId: prop.id, imageId: img.id, isBanner: false };
      const req = createMockRequest(payload, 'http://localhost/api/property-images', 'POST');
      const res = await createRelation(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.propertyId).toBe(prop.id);
      expect(json.data.imageId).toBe(img.id);
    });

    it('should return 404 when property does not exist', async () => {
      const img = await createTestImage();
      const payload = { propertyId: 99999, imageId: img.id, isBanner: false };
      const req = createMockRequest(payload, 'http://localhost/api/property-images', 'POST');
      const res = await createRelation(req);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/property-images/[id]', () => {
    it('should return relation by id', async () => {
      const prop = await createTestProperty();
      const img = await createTestImage();
      const rel = await prisma.propertyImage.create({ data: { propertyId: prop.id, imageId: img.id } });
      const res = await getRelation(createMockRequest(), params(String(rel.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(rel.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getRelation(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/property-images/[id]', () => {
    it('should update a relation', async () => {
      const prop = await createTestProperty();
      const img1 = await createTestImage();
      const img2 = await createTestImage();
      const rel = await prisma.propertyImage.create({ data: { propertyId: prop.id, imageId: img1.id } });
      const req = createMockRequest(
        { propertyId: prop.id, imageId: img2.id, isBanner: true },
        'http://localhost/api/property-images/1',
        'PUT'
      );
      const res = await updateRelation(req, params(String(rel.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.imageId).toBe(img2.id);
    });

    it('should return 404 for non-existent id', async () => {
      const prop = await createTestProperty();
      const img = await createTestImage();
      const req = createMockRequest(
        { propertyId: prop.id, imageId: img.id, isBanner: false },
        'http://localhost/api/property-images/99999',
        'PUT'
      );
      const res = await updateRelation(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/property-images/[id]', () => {
    it('should delete a relation', async () => {
      const prop = await createTestProperty();
      const img = await createTestImage();
      const rel = await prisma.propertyImage.create({ data: { propertyId: prop.id, imageId: img.id } });
      const res = await deleteRelation(createMockRequest(), params(String(rel.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.propertyImage.findUnique({ where: { id: rel.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteRelation(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
