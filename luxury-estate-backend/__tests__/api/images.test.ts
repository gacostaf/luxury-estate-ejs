import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listImages, POST as createImage } from '@/app/api/images/route';
import { GET as getImage, PUT as updateImage, DELETE as deleteImage } from '@/app/api/images/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, createTestImage } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Images API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/images', () => {
    it('should return empty list when no images exist', async () => {
      const res = await listImages();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return all images', async () => {
      await createTestImage({ uri: 'https://example.com/1.jpg' });
      await createTestImage({ uri: 'https://example.com/2.jpg' });
      const res = await listImages();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
    });
  });

  describe('POST /api/images', () => {
    it('should create a new image', async () => {
      const payload = { uri: 'https://example.com/new.jpg', isPersonal: false };
      const req = createMockRequest(payload, 'http://localhost/api/images', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createImage(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.uri).toBe('https://example.com/new.jpg');
    });

    it('should return 400 for missing uri', async () => {
      const req = createMockRequest({}, 'http://localhost/api/images', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createImage(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/images/[id]', () => {
    it('should return image by id', async () => {
      const img = await createTestImage();
      const res = await getImage(createMockRequest(), params(String(img.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(img.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getImage(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/images/[id]', () => {
    it('should update an image', async () => {
      const img = await createTestImage();
      const req = createMockRequest(
        { uri: 'https://example.com/updated.jpg', isPersonal: true },
        'http://localhost/api/images/1',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateImage(req, params(String(img.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.uri).toBe('https://example.com/updated.jpg');
      expect(json.data.isPersonal).toBe(true);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(
        { uri: 'https://example.com/x.jpg', isPersonal: false },
        'http://localhost/api/images/99999',
        'PUT',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateImage(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/images/[id]', () => {
    it('should delete an image', async () => {
      const img = await createTestImage();
      const res = await deleteImage(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params(String(img.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.image.findUnique({ where: { id: img.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteImage(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
