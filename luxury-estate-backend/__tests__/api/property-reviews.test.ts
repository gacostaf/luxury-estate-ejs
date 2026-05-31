import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listReviews, POST as createReview } from '@/app/api/property-reviews/route';
import { GET as getReview, PATCH as updateReview, DELETE as deleteReview } from '@/app/api/property-reviews/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, createTestProperty, lookupPersonTypeId } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Property Reviews API', () => {
  let adminPersonId: number;
  let propertyId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
    const prop = await createTestProperty();
    propertyId = prop.id;
  });

  describe('GET /api/property-reviews', () => {
    it('should return empty list when no reviews exist', async () => {
      const res = await listReviews(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by propertyId', async () => {
      await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 5, comment: 'Great!', tenantId: 1 },
      });
      const req = createMockRequest(undefined, 'http://localhost/api/property-reviews?propertyId=' + propertyId, 'GET');
      const res = await listReviews(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
    });
  });

  describe('POST /api/property-reviews', () => {
    it('should create a review', async () => {
      const payload = { propertyId, personId: adminPersonId, rating: 5, title: 'Amazing', comment: 'Loved it!' };
      const req = createMockRequest(payload, 'http://localhost/api/property-reviews', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await createReview(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.rating).toBe(5);
      expect(json.data.comment).toBe('Loved it!');
    });

    it('should return 401 without auth', async () => {
      const payload = { propertyId, personId: adminPersonId, rating: 5 };
      const req = createMockRequest(payload, 'http://localhost/api/property-reviews', 'POST');
      const res = await createReview(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid rating', async () => {
      const req = createMockRequest(
        { propertyId, personId: adminPersonId, rating: 0 },
        'http://localhost/api/property-reviews', 'POST',
        { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }
      );
      const res = await createReview(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/property-reviews/[id]', () => {
    it('should return review by id', async () => {
      const rev = await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 4, title: 'Nice', tenantId: 1 },
      });
      const res = await getReview(createMockRequest(), params(String(rev.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(rev.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getReview(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/property-reviews/[id] (moderate)', () => {
    it('should update a review', async () => {
      const rev = await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 3, comment: 'OK', tenantId: 1 },
      });
      const req = createMockRequest(
        { isPublished: true, isVerified: true },
        'http://localhost/api/property-reviews/' + rev.id, 'PATCH',
        { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' }
      );
      const res = await updateReview(req, params(String(rev.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.isPublished).toBe(true);
      expect(json.data.isVerified).toBe(true);
    });

    it('should return 403 for user without moderate permission', async () => {
      const rev = await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 3, tenantId: 1 },
      });
      const clientTypeId = await lookupPersonTypeId('CLIENT');
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `noperms-${Date.now()}` },
      });
      const req = createMockRequest(
        { isPublished: true },
        'http://localhost/api/property-reviews/' + rev.id, 'PATCH',
        { 'x-user-id': String(unauthPerson.id), 'x-tenant-id': '1' }
      );
      const res = await updateReview(req, params(String(rev.id)));
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/property-reviews/[id]', () => {
    it('should delete a review', async () => {
      const rev = await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 5, tenantId: 1 },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await deleteReview(req, params(String(rev.id)));
      expect(res.status).toBe(200);

      const deleted = await prisma.propertyReview.findUnique({ where: { id: rev.id } });
      expect(deleted).toBeNull();
    });

    it('should return 403 for user without delete permission', async () => {
      const rev = await prisma.propertyReview.create({
        data: { propertyId, personId: adminPersonId, rating: 5, tenantId: 1 },
      });
      const clientTypeId = await lookupPersonTypeId('CLIENT');
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}-del@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `noperms-${Date.now()}` },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(unauthPerson.id), 'x-tenant-id': '1' });
      const res = await deleteReview(req, params(String(rev.id)));
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await deleteReview(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
