import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { POST as login } from '@/app/api/auth/route';
import { POST as register } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, lookupPersonTypeId } from '../utils/test-helpers';
import { verifyToken } from '@/lib/auth/jwt';

describe('Auth API', () => {
  let personId: number;
  let testEmail: string;
  let testSeq = 0;
  const testPassword = 'testpassword123';

  beforeAll(async () => {
    await clearTransactionalData();
  });

  beforeEach(async () => {
    await clearTransactionalData();
    testSeq++;
    testEmail = `auth-${Date.now()}-${testSeq}@test.com`;
    const clientTypeId = await lookupPersonTypeId('CLIENT');
    const person = await prisma.person.create({
      data: { firstName: 'Auth', lastName: 'Test', email: testEmail, personTypeId: clientTypeId, tenantId: 1 },
    });
    personId = person.id;
  });

  describe('Register', () => {
    it('should register a new account', async () => {
      const req = createMockRequest(
        { personId, email: testEmail, password: testPassword },
        'http://localhost/api/auth/register',
        'POST'
      );
      const res = await register(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.email).toBe(testEmail);
    });

    it('should return 404 if person not found', async () => {
      const req = createMockRequest(
        { personId: 99999, email: 'nobody@test.com', password: testPassword },
        'http://localhost/api/auth/register',
        'POST'
      );
      const res = await register(req);
      expect(res.status).toBe(404);
    });

    it('should return 409 if email already exists', async () => {
      await register(createMockRequest(
        { personId, email: testEmail, password: testPassword },
        'http://localhost/api/auth/register',
        'POST'
      ));

      const res = await register(createMockRequest(
        { personId, email: testEmail, password: testPassword },
        'http://localhost/api/auth/register',
        'POST'
      ));
      expect(res.status).toBe(409);
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await register(createMockRequest(
        { personId, email: testEmail, password: testPassword },
        'http://localhost/api/auth/register',
        'POST'
      ));
    });

    it('should login with valid credentials and return a JWT token', async () => {
      const req = createMockRequest(
        { email: testEmail, password: testPassword },
        'http://localhost/api/auth',
        'POST'
      );
      const res = await login(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.token).toBeTruthy();
      expect(json.data.personId).toBe(personId);
      expect(json.data.email).toBe(testEmail);

      const payload = await verifyToken(json.data.token);
      expect(payload).not.toBeNull();
      expect(payload!.personId).toBe(personId);
    });

    it('should return 401 with wrong password', async () => {
      const req = createMockRequest(
        { email: testEmail, password: 'wrongpassword' },
        'http://localhost/api/auth',
        'POST'
      );
      const res = await login(req);
      expect(res.status).toBe(401);
    });

    it('should return 404 for unknown email', async () => {
      const req = createMockRequest(
        { email: 'unknown@test.com', password: testPassword },
        'http://localhost/api/auth',
        'POST'
      );
      const res = await login(req);
      expect(res.status).toBe(404);
    });

    it('should require email and password', async () => {
      const req = createMockRequest({}, 'http://localhost/api/auth', 'POST');
      const res = await login(req);
      expect(res.status).toBe(400);
    });
  });
});
