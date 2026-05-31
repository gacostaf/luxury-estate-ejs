import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listVideos, POST as createVideo } from '@/app/api/videos/route';
import { GET as getVideo, PUT as updateVideo, DELETE as deleteVideo } from '@/app/api/videos/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, createTestVideo } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Videos API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/videos', () => {
    it('should return empty list when no videos exist', async () => {
      const res = await listVideos();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return all videos', async () => {
      await createTestVideo({ uri: 'https://example.com/1.mp4' });
      await createTestVideo({ uri: 'https://example.com/2.mp4' });
      const res = await listVideos();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
    });
  });

  describe('POST /api/videos', () => {
    it('should create a new video', async () => {
      const payload = { uri: 'https://example.com/new.mp4', isPersonal: false };
      const req = createMockRequest(payload, 'http://localhost/api/videos', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createVideo(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.uri).toBe('https://example.com/new.mp4');
    });

    it('should return 400 for missing uri', async () => {
      const req = createMockRequest({}, 'http://localhost/api/videos', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createVideo(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/videos/[id]', () => {
    it('should return video by id', async () => {
      const vid = await createTestVideo();
      const res = await getVideo(createMockRequest(undefined, undefined, undefined, { 'x-tenant-id': '1' }), params(String(vid.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(vid.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getVideo(createMockRequest(undefined, undefined, undefined, { 'x-tenant-id': '1' }), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/videos/[id]', () => {
    it('should update a video', async () => {
      const vid = await createTestVideo();
      const req = createMockRequest(
        { uri: 'https://example.com/updated.mp4', isPersonal: true },
        'http://localhost/api/videos/1',
        'PUT',
        { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }
      );
      const res = await updateVideo(req, params(String(vid.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.uri).toBe('https://example.com/updated.mp4');
      expect(json.data.isPersonal).toBe(true);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(
        { uri: 'https://example.com/x.mp4', isPersonal: false },
        'http://localhost/api/videos/99999',
        'PUT',
        { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }
      );
      const res = await updateVideo(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/videos/[id]', () => {
    it('should delete a video', async () => {
      const vid = await createTestVideo();
      const res = await deleteVideo(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }), params(String(vid.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.video.findUnique({ where: { id: vid.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteVideo(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
