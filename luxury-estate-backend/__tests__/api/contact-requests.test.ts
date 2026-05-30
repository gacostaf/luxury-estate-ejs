import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listRequests, POST as createRequest } from '@/app/api/contact-requests/route';
import { GET as getRequest, PATCH as updateRequest, DELETE as deleteRequest } from '@/app/api/contact-requests/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser, lookupAssociateTypeId } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

async function lookupRequestTypeId(code: string): Promise<number> {
  return (await prisma.requestType.findUniqueOrThrow({ where: { code } })).id;
}

async function lookupRequestStatusId(code: string): Promise<number> {
  return (await prisma.requestStatus.findUniqueOrThrow({ where: { code } })).id;
}

describe('Contact Requests API', () => {
  let adminPersonId: number;
  let adminAssociateId: number;
  let generalTypeId: number;
  let salesTypeId: number;
  let newStatusId: number;
  let openStatusId: number;

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();

    const associateTypeId = await lookupAssociateTypeId('AGENT');
    const assoc = await prisma.associate.create({
      data: { personId: adminPersonId, associateTypeId },
    });
    adminAssociateId = assoc.id;

    generalTypeId = await lookupRequestTypeId('GENERAL');
    salesTypeId = await lookupRequestTypeId('SALES');
    newStatusId = await lookupRequestStatusId('NEW');
    openStatusId = await lookupRequestStatusId('OPEN');
  });

  describe('GET /api/contact-requests', () => {
    it('should return empty list when no requests exist', async () => {
      const res = await listRequests(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by email', async () => {
      await prisma.contactRequest.create({
        data: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Hello',
        },
      });
      await prisma.contactRequest.create({
        data: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Hi',
        },
      });
      const req = createMockRequest(undefined, 'http://localhost/api/contact-requests?email=jane@test.com', 'GET');
      const res = await listRequests(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].email).toBe('jane@test.com');
    });

    it('should filter by requestTypeId', async () => {
      await prisma.contactRequest.create({
        data: {
          firstName: 'Alice',
          lastName: 'Brown',
          email: 'alice@test.com',
          requestType: { connect: { id: salesTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Sales inquiry',
        },
      });
      const req = createMockRequest(undefined, `http://localhost/api/contact-requests?requestTypeId=${salesTypeId}`, 'GET');
      const res = await listRequests(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
    });
  });

  describe('POST /api/contact-requests', () => {
    it('should create a contact request (public endpoint)', async () => {
      const payload = {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@test.com',
        requestTypeId: generalTypeId,
        message: 'I would like more information.',
      };
      const req = createMockRequest(payload, 'http://localhost/api/contact-requests', 'POST');
      const res = await createRequest(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.firstName).toBe('Bob');
      expect(json.data.email).toBe('bob@test.com');
      expect(json.data.message).toBe('I would like more information.');
      expect(json.data.requestTypeId).toBe(generalTypeId);
      expect(json.data.requestStatusId).toBe(newStatusId);
    });

    it('should create with contactMethodId and leadSourceId', async () => {
      const cm = await prisma.contactMethod.findUniqueOrThrow({ where: { code: 'EMAIL' } });
      const ls = await prisma.leadSource.findUniqueOrThrow({ where: { code: 'REFERRAL' } });
      const payload = {
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol@test.com',
        requestTypeId: generalTypeId,
        message: 'Interested in partnership.',
        contactMethodId: cm.id,
        leadSourceId: ls.id,
      };
      const req = createMockRequest(payload, 'http://localhost/api/contact-requests', 'POST');
      const res = await createRequest(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.contactMethodId).toBe(cm.id);
      expect(json.data.leadSourceId).toBe(ls.id);
      expect(json.data.contactMethod).toBeDefined();
      expect(json.data.contactMethod.code).toBe('EMAIL');
      expect(json.data.leadSource).toBeDefined();
      expect(json.data.leadSource.code).toBe('REFERRAL');
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest(
        { firstName: 'Incomplete' },
        'http://localhost/api/contact-requests', 'POST',
      );
      const res = await createRequest(req);
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email', async () => {
      const payload = {
        firstName: 'Dan',
        lastName: 'Lee',
        email: 'not-an-email',
        requestTypeId: generalTypeId,
        message: 'Hello',
      };
      const req = createMockRequest(payload, 'http://localhost/api/contact-requests', 'POST');
      const res = await createRequest(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/contact-requests/[id]', () => {
    it('should return request by id', async () => {
      const cr = await prisma.contactRequest.create({
        data: {
          firstName: 'Eve',
          lastName: 'Adams',
          email: 'eve@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Test message',
        },
      });
      const res = await getRequest(createMockRequest(), params(String(cr.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(cr.id);
      expect(json.data.firstName).toBe('Eve');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getRequest(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/contact-requests/[id]', () => {
    it('should update a contact request', async () => {
      const cr = await prisma.contactRequest.create({
        data: {
          firstName: 'Frank',
          lastName: 'Green',
          email: 'frank@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Original message',
        },
      });
      const req = createMockRequest(
        { message: 'Updated message', requestStatusId: openStatusId },
        `http://localhost/api/contact-requests/${cr.id}`, 'PATCH',
        { 'x-user-id': String(adminPersonId) },
      );
      const res = await updateRequest(req, params(String(cr.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.message).toBe('Updated message');
      expect(json.data.requestStatusId).toBe(openStatusId);
      expect(json.data.firstName).toBe('Frank');
    });

    it('should return 403 for user without moderate permission', async () => {
      const cr = await prisma.contactRequest.create({
        data: {
          firstName: 'Grace',
          lastName: 'Hall',
          email: 'grace@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Test',
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { code: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(
        { message: 'Hacked' },
        `http://localhost/api/contact-requests/${cr.id}`, 'PATCH',
        { 'x-user-id': String(unauthPerson.id) },
      );
      const res = await updateRequest(req, params(String(cr.id)));
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/contact-requests/[id]', () => {
    it('should delete a contact request', async () => {
      const cr = await prisma.contactRequest.create({
        data: {
          firstName: 'Henry',
          lastName: 'Irving',
          email: 'henry@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Delete me',
        },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteRequest(req, params(String(cr.id)));
      expect(res.status).toBe(200);

      const deleted = await prisma.contactRequest.findUnique({ where: { id: cr.id } });
      expect(deleted).toBeNull();
    });

    it('should return 403 for user without delete permission', async () => {
      const cr = await prisma.contactRequest.create({
        data: {
          firstName: 'Ivy',
          lastName: 'Jones',
          email: 'ivy@test.com',
          requestType: { connect: { id: generalTypeId } },
          requestStatus: { connect: { id: newStatusId } },
          message: 'Test',
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { code: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}-del@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(unauthPerson.id) });
      const res = await deleteRequest(req, params(String(cr.id)));
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteRequest(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
