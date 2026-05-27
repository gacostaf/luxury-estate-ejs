import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { GET, POST } from '@/app/api/people/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, lookupPersonTypeId, createTestPerson } from '../utils/test-helpers';

describe('People API', () => {
  let clientTypeId: number;

  beforeAll(async () => {
    clientTypeId = await lookupPersonTypeId('CLIENT');
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  afterEach(async () => {
    await prisma.$disconnect();
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
      await createTestPerson({ isEmployee: true, name: 'Agent One' });
      await createTestPerson({ isEmployee: false, name: 'Client One' });

      const req = createMockRequest(
        undefined,
        'http://localhost/api/people?isEmployee=true'
      );
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].name).toBe('Agent One');
    });
  });

  describe('POST /api/people', () => {
    it('should create a new person with valid data', async () => {
      const payload = {
        name: 'New Person',
        email: 'new@example.com',
        personTypeId: clientTypeId,
        isLead: true,
      };

      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST');
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe('New Person');
      expect(json.data.email).toBe('new@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const payload = { name: 'Bad', email: 'not-an-email', personTypeId: clientTypeId };
      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST');
      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it('should return 409 for duplicate email', async () => {
      await createTestPerson({ email: 'duplicate@example.com' });

      const payload = { name: 'Another', email: 'duplicate@example.com', personTypeId: clientTypeId };
      const req = createMockRequest(payload, 'http://localhost/api/people', 'POST');
      const res = await POST(req);

      expect(res.status).toBe(409);
    });
  });
});