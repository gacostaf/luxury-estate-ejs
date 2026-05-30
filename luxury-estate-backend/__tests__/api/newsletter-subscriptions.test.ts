import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listSubs, POST as createSub } from '@/app/api/newsletter-subscriptions/route';
import { GET as getSub, PATCH as updateSub, DELETE as deleteSub } from '@/app/api/newsletter-subscriptions/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Newsletter Subscriptions API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/newsletter-subscriptions', () => {
    it('should return empty list when no subscriptions exist', async () => {
      const res = await listSubs(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return list of subscriptions', async () => {
      await prisma.newsletterSubscription.create({
        data: { personId: adminPersonId },
      });
      const res = await listSubs(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].personId).toBe(adminPersonId);
    });
  });

  describe('POST /api/newsletter-subscriptions (upsert)', () => {
    it('should create a subscription', async () => {
      const payload = { personId: adminPersonId, isSubscribed: true, source: 'test' };
      const req = createMockRequest(payload, undefined, 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createSub(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.isSubscribed).toBe(true);
    });

    it('should upsert (update existing) subscription', async () => {
      await prisma.newsletterSubscription.create({
        data: { personId: adminPersonId, isSubscribed: false },
      });
      const payload = { personId: adminPersonId, isSubscribed: true };
      const req = createMockRequest(payload, undefined, 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createSub(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.isSubscribed).toBe(true);
    });

    it('should return 401 without auth', async () => {
      const payload = { personId: adminPersonId };
      const req = createMockRequest(payload, undefined, 'POST');
      const res = await createSub(req);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/newsletter-subscriptions/[id]', () => {
    it('should return subscription by id', async () => {
      const sub = await prisma.newsletterSubscription.create({ data: { personId: adminPersonId } });
      const res = await getSub(createMockRequest(), params(String(sub.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(sub.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getSub(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/newsletter-subscriptions/[id]', () => {
    it('should update a subscription', async () => {
      const sub = await prisma.newsletterSubscription.create({ data: { personId: adminPersonId } });
      const req = createMockRequest(
        { isSubscribed: false },
        undefined, 'PATCH',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateSub(req, params(String(sub.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.isSubscribed).toBe(false);
    });
  });

  describe('DELETE /api/newsletter-subscriptions/[id]', () => {
    it('should delete a subscription', async () => {
      const sub = await prisma.newsletterSubscription.create({ data: { personId: adminPersonId } });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteSub(req, params(String(sub.id)));
      expect(res.status).toBe(200);
      const deleted = await prisma.newsletterSubscription.findUnique({ where: { id: sub.id } });
      expect(deleted).toBeNull();
    });
  });
});
