import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listRelations, POST as createRelation } from '@/app/api/property-videos/route';
import { GET as getRelation, PUT as updateRelation, DELETE as deleteRelation } from '@/app/api/property-videos/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, createTestProperty, createTestVideo } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Property-Videos API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/property-videos', () => {
    it('should return empty list when no relations exist', async () => {
      const req = createMockRequest(undefined, 'http://localhost/api/property-videos');
      const res = await listRelations(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by propertyId', async () => {
      const prop = await createTestProperty();
      const vid = await createTestVideo();
      await prisma.propertyVideo.create({ data: { propertyId: prop.id, videoId: vid.id } });
      const req = createMockRequest(undefined, `http://localhost/api/property-videos?propertyId=${prop.id}`);
      const res = await listRelations(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].propertyId).toBe(prop.id);
    });
  });

  describe('POST /api/property-videos', () => {
    it('should create a relation between property and video', async () => {
      const prop = await createTestProperty();
      const vid = await createTestVideo();
      const payload = { propertyId: prop.id, videoId: vid.id };
      const req = createMockRequest(payload, 'http://localhost/api/property-videos', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createRelation(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.propertyId).toBe(prop.id);
      expect(json.data.videoId).toBe(vid.id);
    });

    it('should return 404 when property does not exist', async () => {
      const vid = await createTestVideo();
      const payload = { propertyId: 99999, videoId: vid.id };
      const req = createMockRequest(payload, 'http://localhost/api/property-videos', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createRelation(req);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/property-videos/[id]', () => {
    it('should return relation by id', async () => {
      const prop = await createTestProperty();
      const vid = await createTestVideo();
      const rel = await prisma.propertyVideo.create({ data: { propertyId: prop.id, videoId: vid.id } });
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

  describe('PUT /api/property-videos/[id]', () => {
    it('should update a relation', async () => {
      const prop = await createTestProperty();
      const vid1 = await createTestVideo();
      const vid2 = await createTestVideo();
      const rel = await prisma.propertyVideo.create({ data: { propertyId: prop.id, videoId: vid1.id } });
      const req = createMockRequest(
        { propertyId: prop.id, videoId: vid2.id },
        'http://localhost/api/property-videos/1',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateRelation(req, params(String(rel.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.videoId).toBe(vid2.id);
    });

    it('should return 404 for non-existent id', async () => {
      const prop = await createTestProperty();
      const vid = await createTestVideo();
      const req = createMockRequest(
        { propertyId: prop.id, videoId: vid.id },
        'http://localhost/api/property-videos/99999',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateRelation(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/property-videos/[id]', () => {
    it('should delete a relation', async () => {
      const prop = await createTestProperty();
      const vid = await createTestVideo();
      const rel = await prisma.propertyVideo.create({ data: { propertyId: prop.id, videoId: vid.id } });
      const res = await deleteRelation(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params(String(rel.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.propertyVideo.findUnique({ where: { id: rel.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteRelation(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
