import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { GET, POST } from '@/app/api/people/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, lookupPersonTypeId, createTestPerson } from '../utils/test-helpers';

describe('People API', () => {
  let clientTypeId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    clientTypeId = await lookupPersonTypeId('CLIENT');
  });

  describe('GET /api/people', () => {
    it('should return empty list when no people exist', async () => {
      const req = createMockRequest(undefined, 'http://localhost/api/people');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toHaveLength(0);
    });

    it('should return people with filters', async () => {
      await createTestPerson({ isAssociate: true, firstName: 'Agent', lastName: 'One' });
      await createTestPerson({ isAssociate: false, firstName: 'Client', lastName: 'One' });

      const req = createMockRequest(
        undefined,
        'http://localhost/api/people?isAssociate=true'
      );
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].firstName).toBe('Agent');
    });
  });

  describe('POST /api/people', () => {
    let adminPersonId: number;

    beforeEach(async () => {
      adminPersonId = await seedAdminUser();
    });

    it('should create a new person with valid data', async () => {
      const payload = {
        firstName: 'New',
        lastName: 'Person',
        email: 'new@example.com',
        slug: 'new-person',
        personTypeId: clientTypeId,
        isLead: true,
      };

      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.firstName).toBe('New');
      expect(json.data.email).toBe('new@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const payload = { firstName: 'Bad', lastName: 'Email', email: 'not-an-email', personTypeId: clientTypeId, slug: 'bad-email' };
      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it('should return 409 for duplicate email', async () => {
      await createTestPerson({ email: 'duplicate@example.com' });

      const payload = { firstName: 'Another', lastName: 'Person', email: 'duplicate@example.com', personTypeId: clientTypeId, slug: 'another-person' };
      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
      const res = await POST(req);

      expect(res.status).toBe(409);
    });
  });
});
