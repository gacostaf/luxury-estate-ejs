import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { POST as createAssociate } from '@/app/api/associates/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, seedAdminUser, lookupPersonTypeId } from '../utils/test-helpers';

describe('Associates API', () => {
  let agentTypeId: number;
  let associateTypeId: number;
  let adminPersonId: number;

  beforeAll(async () => {
    agentTypeId = await lookupPersonTypeId('AGENT');
    const at = await prisma.associateType.upsert({
      where: { name: 'AGENT' },
      update: {},
      create: { name: 'AGENT', description: 'Real estate agent' },
    });
    associateTypeId = at.id;
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
    adminPersonId = await seedAdminUser();
  });

  it('should create an associate for an existing person', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Test', lastName: 'Agent', email: `agent-${Date.now()}@test.com`, personTypeId: agentTypeId, isAssociate: true },
    });

    const payload = {
      personId: person.id,
      associateTypeId,
      department: 'Luxury Sales',
    };

    const req = createMockRequest(payload, 'http://localhost/api/associates', 'POST', { 'x-user-id': String(adminPersonId) });
    const res = await createAssociate(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.personId).toBe(person.id);
    expect(json.data.department).toBe('Luxury Sales');
  });

  it('should return 404 if person not found', async () => {
    const payload = { personId: 99999, associateTypeId };
    const req = createMockRequest(payload, 'http://localhost/api/associates', 'POST', { 'x-user-id': String(adminPersonId) });
    const res = await createAssociate(req);

    expect(res.status).toBe(404);
  });
});
