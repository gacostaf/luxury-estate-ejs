import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { POST as createCombined } from '@/app/api/employees/route';
import { POST as createStandard } from '@/app/api/employees/standard/route';
import { prisma } from '@/lib/prisma';
import { createMockRequest } from '../utils/mock-request';
import { clearTestDatabase, seedLookupTables, lookupPersonTypeId } from '../utils/test-helpers';

describe('Employees API', () => {
  let agentTypeId: number;

  beforeAll(async () => {
    agentTypeId = await lookupPersonTypeId('AGENT');
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await seedLookupTables();
  });

  it('should create person + employee + office in one transaction', async () => {
    const payload = {
      name: 'Test Agent',
      email: `agent-${Date.now()}@test.com`,
      personTypeId: agentTypeId,
      department: 'Luxury Sales',
      officeName: 'Test Office',
      officePhone: '555-0000',
    };

    const req = createMockRequest(payload, 'http://localhost/api/employees', 'POST');
    const res = await createCombined(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.person.name).toBe('Test Agent');
    expect(json.data.employee.department).toBe('Luxury Sales');
    expect(json.data.employee.office?.phone).toBe('555-0000');
  });

  it('should create standard employee for existing person', async () => {
    const person = await prisma.person.create({
      data: { name: 'Existing', email: 'ex@test.com', personTypeId: agentTypeId },
    });

    const payload = { personId: person.id, department: 'Management' };
    const req = createMockRequest(payload, 'http://localhost/api/employees/standard', 'POST');
    const res = await createStandard(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.personId).toBe(person.id);
    expect(json.data.department).toBe('Management');
  });

  it('should return 404 if person not found for standard employee', async () => {
    const payload = { personId: 99999, department: 'Test' };
    const req = createMockRequest(payload, 'http://localhost/api/employees/standard', 'POST');
    const res = await createStandard(req);

    expect(res.status).toBe(404);
  });
});