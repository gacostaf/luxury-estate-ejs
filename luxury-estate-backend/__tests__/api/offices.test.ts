import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listOffices, POST as createOffice } from '@/app/api/offices/route';
import { GET as getOffice, PATCH as updateOffice, DELETE as deleteOffice } from '@/app/api/offices/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, createTestOffice } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Offices API', () => {
  let adminPersonId: number;

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  describe('GET /api/offices', () => {
    it('should return empty list when no offices exist', async () => {
      const res = await listOffices();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should return all offices', async () => {
      await createTestOffice({ phone: '555-1111' });
      await createTestOffice({ phone: '555-2222' });
      const res = await listOffices();
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
    });
  });

  describe('POST /api/offices', () => {
    it('should create a new office', async () => {
      const payload = { phone: '555-0000' };
      const req = createMockRequest(payload, 'http://localhost/api/offices', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createOffice(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.phone).toBe('555-0000');
    });
  });

  describe('GET /api/offices/[id]', () => {
    it('should return office by id', async () => {
      const office = await createTestOffice();
      const res = await getOffice(createMockRequest(), params(String(office.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(office.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getOffice(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/offices/[id]', () => {
    it('should update an office', async () => {
      const office = await createTestOffice();
      const req = createMockRequest(
        { phone: '555-9999' },
        'http://localhost/api/offices/1',
        'PATCH',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateOffice(req, params(String(office.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.phone).toBe('555-9999');
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(
        { phone: '555-0000' },
        'http://localhost/api/offices/99999',
        'PATCH',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateOffice(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/offices/[id]', () => {
    it('should delete an office', async () => {
      const office = await createTestOffice();
      const res = await deleteOffice(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params(String(office.id)));
      expect(res.status).toBe(204);

      const deleted = await prisma.office.findUnique({ where: { id: office.id } });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const res = await deleteOffice(createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) }), params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
