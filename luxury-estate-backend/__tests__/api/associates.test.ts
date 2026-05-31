import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { POST as createAssociate } from '@/app/api/associates/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedAdminUser, lookupPersonTypeId } from '../utils/test-helpers';

describe('Associates API', () => {
  let adminPersonId: number;

  async function resolveIds() {
    const agentTypeId = await lookupPersonTypeId('AGENT');
    const at = await prisma.associateType.upsert({
      where: { tenantId_code: { tenantId: 1, code: 'AGENT' } },
      update: {},
      create: { tenantId: 1, code: 'AGENT', name: 'AGENT', description: 'Real estate agent' },
    });
    return { agentTypeId, associateTypeId: at.id };
  }

  beforeEach(async () => {
    await clearTransactionalData();
    adminPersonId = await seedAdminUser();
  });

  it('should create an associate for an existing person', async () => {
    const { agentTypeId, associateTypeId } = await resolveIds();
    const person = await prisma.person.create({
      data: { firstName: 'Test', lastName: 'Agent', email: `agent-${Date.now()}@test.com`, personTypeId: agentTypeId, isAssociate: true, tenantId: 1 },
    });

    const payload = {
      personId: person.id,
      associateTypeId,
      department: 'Luxury Sales',
    };

    const req = createMockRequest(payload, 'http://localhost/api/associates', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
    const res = await createAssociate(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.personId).toBe(person.id);
    expect(json.data.department).toBe('Luxury Sales');
  });

  it('should return 404 if person not found', async () => {
    const { associateTypeId } = await resolveIds();
    const payload = { personId: 99999, associateTypeId };
    const req = createMockRequest(payload, 'http://localhost/api/associates', 'POST', { 'x-user-id': String(adminPersonId), 'x-tenant-id': '1' });
    const res = await createAssociate(req);

    expect(res.status).toBe(404);
  });
});
