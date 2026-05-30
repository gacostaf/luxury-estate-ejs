import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listInquiries, POST as createInquiry } from '@/app/api/property-inquiries/route';
import { GET as getInquiry, PATCH as updateInquiry, DELETE as deleteInquiry } from '@/app/api/property-inquiries/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser, createTestProperty, lookupAssociateTypeId, lookupPersonTypeId } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('Property Inquiries API', () => {
  let adminPersonId: number;
  let adminAssociateId: number;
  let propertyId: number;

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();
    const prop = await createTestProperty();
    propertyId = prop.id;

    const associateTypeId = await lookupAssociateTypeId('AGENT');
    const assoc = await prisma.associate.create({
      data: { personId: adminPersonId, associateTypeId },
    });
    adminAssociateId = assoc.id;
  });

  describe('GET /api/property-inquiries', () => {
    it('should return empty list when no inquiries exist', async () => {
      const res = await listInquiries(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by propertyId', async () => {
      await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@test.com',
        },
      });
      const req = createMockRequest(undefined, `http://localhost/api/property-inquiries?propertyId=${propertyId}`, 'GET');
      const res = await listInquiries(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].firstName).toBe('Jane');
    });

    it('should filter by associateId', async () => {
      await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@test.com',
        },
      });
      const req = createMockRequest(undefined, `http://localhost/api/property-inquiries?associateId=${adminAssociateId}`, 'GET');
      const res = await listInquiries(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
    });
  });

  describe('POST /api/property-inquiries', () => {
    it('should create a property inquiry', async () => {
      const payload = {
        propertyId,
        associateId: adminAssociateId,
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@test.com',
        phone: '555-0100',
        message: 'I am interested in this property.',
      };
      const req = createMockRequest(payload, 'http://localhost/api/property-inquiries', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createInquiry(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.firstName).toBe('Alice');
      expect(json.data.email).toBe('alice@test.com');
      expect(json.data.message).toBe('I am interested in this property.');
      expect(json.data.propertyId).toBe(propertyId);
      expect(json.data.associateId).toBe(adminAssociateId);
    });

    it('should create inquiry without auth (public endpoint)', async () => {
      const payload = {
        propertyId,
        associateId: adminAssociateId,
        firstName: 'Unauth',
        lastName: 'User',
        email: 'unauth@test.com',
      };
      const req = createMockRequest(payload, 'http://localhost/api/property-inquiries', 'POST');
      const res = await createInquiry(req);
      expect(res.status).toBe(201);
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest(
        { propertyId },
        'http://localhost/api/property-inquiries', 'POST',
        { 'x-user-id': String(adminPersonId) },
      );
      const res = await createInquiry(req);
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email', async () => {
      const payload = {
        propertyId,
        associateId: adminAssociateId,
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'not-an-email',
      };
      const req = createMockRequest(payload, 'http://localhost/api/property-inquiries', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createInquiry(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/property-inquiries/[id]', () => {
    it('should return inquiry by id', async () => {
      const inquiry = await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Dave',
          lastName: 'Wilson',
          email: 'dave@test.com',
        },
      });
      const res = await getInquiry(createMockRequest(), params(String(inquiry.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(inquiry.id);
      expect(json.data.firstName).toBe('Dave');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getInquiry(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/property-inquiries/[id]', () => {
    it('should update a property inquiry', async () => {
      const inquiry = await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Eve',
          lastName: 'Adams',
          email: 'eve@test.com',
          message: 'Original message',
        },
      });
      const req = createMockRequest(
        { message: 'Updated message' },
        `http://localhost/api/property-inquiries/${inquiry.id}`, 'PATCH',
        { 'x-user-id': String(adminPersonId) },
      );
      const res = await updateInquiry(req, params(String(inquiry.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.message).toBe('Updated message');
      expect(json.data.firstName).toBe('Eve');
    });

    it('should return 403 for user without moderate permission', async () => {
      const inquiry = await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Frank',
          lastName: 'Green',
          email: 'frank@test.com',
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { code: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(
        { message: 'Hacked' },
        `http://localhost/api/property-inquiries/${inquiry.id}`, 'PATCH',
        { 'x-user-id': String(unauthPerson.id) },
      );
      const res = await updateInquiry(req, params(String(inquiry.id)));
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/property-inquiries/[id]', () => {
    it('should delete a property inquiry', async () => {
      const inquiry = await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Grace',
          lastName: 'Hall',
          email: 'grace@test.com',
        },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteInquiry(req, params(String(inquiry.id)));
      expect(res.status).toBe(200);

      const deleted = await prisma.propertyInquiry.findUnique({ where: { id: inquiry.id } });
      expect(deleted).toBeNull();
    });

    it('should return 403 for user without delete permission', async () => {
      const inquiry = await prisma.propertyInquiry.create({
        data: {
          propertyId,
          associateId: adminAssociateId,
          firstName: 'Henry',
          lastName: 'Irving',
          email: 'henry@test.com',
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { code: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}-del@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(unauthPerson.id) });
      const res = await deleteInquiry(req, params(String(inquiry.id)));
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteInquiry(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
