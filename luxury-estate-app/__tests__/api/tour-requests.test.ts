import { describe, it, expect, beforeEach } from '@jest/globals';
import { GET as listTours, POST as createTour } from '@/app/api/tour-requests/route';
import { GET as getTour, PATCH as updateTour, DELETE as deleteTour } from '@/app/api/tour-requests/[id]/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser, createTestProperty, lookupAssociateTypeId, lookupPersonTypeId } from '../utils/test-helpers';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

function futureDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
}

describe('Tour Requests API', () => {
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

  describe('GET /api/tour-requests', () => {
    it('should return empty list when no tours exist', async () => {
      const res = await listTours(createMockRequest());
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toEqual([]);
    });

    it('should filter by propertyId', async () => {
      await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Jane',
          clientLastName: 'Doe',
          clientEmail: 'jane@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const req = createMockRequest(undefined, 'http://localhost/api/tour-requests?propertyId=' + propertyId, 'GET');
      const res = await listTours(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
    });
  });

  describe('POST /api/tour-requests', () => {
    it('should create a tour request', async () => {
      const payload = {
        propertyId,
        clientFirstName: 'John',
        clientLastName: 'Smith',
        clientEmail: 'john@test.com',
        primaryAssociateId: adminAssociateId,
        scheduledDate: futureDate(),
        clientMessage: 'Looking forward to seeing this property!',
      };
      const req = createMockRequest(payload, 'http://localhost/api/tour-requests', 'POST', { 'x-user-id': String(adminPersonId) });
      const res = await createTour(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json.data.clientFirstName).toBe('John');
      expect(json.data.clientMessage).toBe('Looking forward to seeing this property!');
    });

    it('should return 401 without auth', async () => {
      const payload = {
        propertyId,
        clientFirstName: 'John',
        clientLastName: 'Smith',
        clientEmail: 'john@test.com',
        primaryAssociateId: adminAssociateId,
        scheduledDate: futureDate(),
      };
      const req = createMockRequest(payload, 'http://localhost/api/tour-requests', 'POST');
      const res = await createTour(req);
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const req = createMockRequest(
        { propertyId },
        'http://localhost/api/tour-requests', 'POST',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await createTour(req);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tour-requests/[id]', () => {
    it('should return tour by id', async () => {
      const tour = await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Alice',
          clientLastName: 'Brown',
          clientEmail: 'alice@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const res = await getTour(createMockRequest(), params(String(tour.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.id).toBe(tour.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await getTour(createMockRequest(), params('99999'));
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/tour-requests/[id]', () => {
    it('should update a tour request', async () => {
      const tour = await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Bob',
          clientLastName: 'Lee',
          clientEmail: 'bob@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const req = createMockRequest(
        { status: 'CONFIRMED', associateNotes: 'Confirmed with client' },
        'http://localhost/api/tour-requests/' + tour.id, 'PATCH',
        { 'x-user-id': String(adminPersonId) }
      );
      const res = await updateTour(req, params(String(tour.id)));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.status).toBe('CONFIRMED');
      expect(json.data.associateNotes).toBe('Confirmed with client');
    });

    it('should return 403 for user without moderate permission', async () => {
      const tour = await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Carol',
          clientLastName: 'Davis',
          clientEmail: 'carol@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { name: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(
        { status: 'CONFIRMED' },
        'http://localhost/api/tour-requests/' + tour.id, 'PATCH',
        { 'x-user-id': String(unauthPerson.id) }
      );
      const res = await updateTour(req, params(String(tour.id)));
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/tour-requests/[id]', () => {
    it('should delete a tour request', async () => {
      const tour = await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Dave',
          clientLastName: 'Wilson',
          clientEmail: 'dave@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteTour(req, params(String(tour.id)));
      expect(res.status).toBe(200);

      const deleted = await prisma.tourRequest.findUnique({ where: { id: tour.id } });
      expect(deleted).toBeNull();
    });

    it('should return 403 for user without delete permission', async () => {
      const tour = await prisma.tourRequest.create({
        data: {
          propertyId,
          clientFirstName: 'Eve',
          clientLastName: 'Adams',
          clientEmail: 'eve@test.com',
          primaryAssociateId: adminAssociateId,
          scheduledDate: new Date(futureDate()),
        },
      });
      const clientPersonType = await prisma.personType.findUnique({ where: { name: 'CLIENT' } });
      const unauthPerson = await prisma.person.create({
        data: { firstName: 'No', lastName: 'Perms', email: `noperms-${Date.now()}-del@test.com`, personTypeId: clientPersonType!.id },
      });
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(unauthPerson.id) });
      const res = await deleteTour(req, params(String(tour.id)));
      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent id', async () => {
      const req = createMockRequest(undefined, undefined, undefined, { 'x-user-id': String(adminPersonId) });
      const res = await deleteTour(req, params('99999'));
      expect(res.status).toBe(404);
    });
  });
});
