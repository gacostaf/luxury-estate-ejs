import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { POST as createPerson } from '@/app/api/people/route';
import { POST as createOffice } from '@/app/api/offices/route';
import { POST as createProperty } from '@/app/api/properties/route';
import { POST as createAssociate } from '@/app/api/associates/route';
import { POST as createAgency } from '@/app/api/agencies/route';
import { POST as createBlogPost } from '@/app/api/blog-posts/route';
import { POST as createContactMethod } from '@/app/api/contact-methods/route';
import { POST as createImage } from '@/app/api/images/route';
import { POST as createVideo } from '@/app/api/videos/route';
import { POST as createPropertyImage } from '@/app/api/property-images/route';
import { clearTransactionalData, seedLookupTables, lookupPersonTypeId, lookupAssociateTypeId, lookupPropertyTypeId, lookupPropertyStatusId } from '../utils/test-helpers';
import { createMockRequest } from '../utils/mock-request';
import { signToken } from '@/lib/auth/jwt';
import { Permissions } from '@/lib/rbac';

describe('RBAC End-to-End Enforcement', () => {
  let unauthPersonId: number;
  let adminPersonId: number;
  let adminToken: string;
  let agentPersonId: number;
  let agentToken: string;
  let associateTypeId: number;
  let clientTypeId: number;
  let houseTypeId: number;
  let forSaleStatusId: number;

  beforeAll(async () => {
    await clearTransactionalData();
    const tenantId = 1;
    associateTypeId = await lookupAssociateTypeId('AGENT');
    clientTypeId = await lookupPersonTypeId('CLIENT');
    houseTypeId = await lookupPropertyTypeId('house');
    forSaleStatusId = await lookupPropertyStatusId('for_sale');

    // Create permissions needed by actual route handlers
    const perms = [
      { code: 'property:create', name: 'Property Create' },
      { code: 'office:create', name: 'Office Create' },
      { code: 'associate:create', name: 'Associate Create' },
      { code: 'agency:create', name: 'Agency Create' },
      { code: 'blog:create', name: 'Blog Create' },
      { code: 'image:create', name: 'Image Create' },
      { code: 'video:create', name: 'Video Create' },
    ];
    for (const p of perms) {
      await prisma.permission.upsert({
        where: { code: p.code },
        update: {},
        create: { name: p.name, code: p.code, description: p.name },
      });
    }

    // Create roles
    const adminRole = await prisma.role.upsert({
      where: { tenantId_code: { tenantId, code: 'ADMIN' } },
      update: {},
      create: { tenantId, name: 'Administrator', code: 'ADMIN', description: 'Has all permissions' },
    });

    const agentRole = await prisma.role.upsert({
      where: { tenantId_code: { tenantId, code: 'AGENT' } },
      update: {},
      create: { tenantId, name: 'Agent', code: 'AGENT', description: 'Limited permissions' },
    });

    // Assign all permissions to admin
    for (const p of perms) {
      const perm = await prisma.permission.findUniqueOrThrow({ where: { code: p.code } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id, tenantId },
      });
    }

    // Assign only property:create and image:create to agent
    const agentPerms = ['property:create', 'image:create'];
    for (const code of agentPerms) {
      const perm = await prisma.permission.findUniqueOrThrow({ where: { code } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: agentRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: agentRole.id, permissionId: perm.id, tenantId },
      });
    }
  });

  beforeEach(async () => {
    const clientTypeId = await lookupPersonTypeId('CLIENT');

    // Unauthenticated person (no roles)
    const unauthPerson = await prisma.person.create({
      data: { firstName: 'Unauth', lastName: 'User', email: `unauth-${Date.now()}@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `unauth-${Date.now()}` },
    });
    unauthPersonId = unauthPerson.id;

    // Admin person
    const adminPerson = await prisma.person.create({
      data: { firstName: 'Admin', lastName: 'User', email: `admin-${Date.now()}-${Math.random()}@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `admin-${Date.now()}` },
    });
    adminPersonId = adminPerson.id;
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { tenantId_code: { tenantId: 1, code: 'ADMIN' } } });
    await prisma.personRole.create({ data: { personId: adminPersonId, roleId: adminRole.id, tenantId: 1 } });
    adminToken = await signToken({ personId: adminPersonId, email: `admin-${Date.now()}@test.com` });

    // Agent person (limited permissions)
    const agentPerson = await prisma.person.create({
      data: { firstName: 'Agent', lastName: 'User', email: `agent-${Date.now()}-${Math.random()}@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `agent-${Date.now()}` },
    });
    agentPersonId = agentPerson.id;
    const agentRole = await prisma.role.findUniqueOrThrow({ where: { tenantId_code: { tenantId: 1, code: 'AGENT' } } });
    await prisma.personRole.create({ data: { personId: agentPersonId, roleId: agentRole.id, tenantId: 1 } });
    agentToken = await signToken({ personId: agentPersonId, email: `agent-${Date.now()}@test.com` });
  });

  // --- requireAuth endpoints (any authenticated user) ---

  describe('POST /api/people (requireAuth)', () => {
    it('should return 401 without auth', async () => {
      const req = createMockRequest(
        { firstName: 'Test', lastName: 'User', personTypeId: clientTypeId },
        'http://localhost/api/people', 'POST'
      );
      const res = await createPerson(req);
      expect(res.status).toBe(401);
    });

    it('should return 201 with valid auth', async () => {
      const req = createMockRequest(
        { firstName: 'Test', lastName: 'User', personTypeId: clientTypeId, slug: `test-user-${Date.now()}` },
        'http://localhost/api/people', 'POST',
        { 'x-user-id': String(unauthPersonId) }
      );
      const res = await createPerson(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/contact-methods (requireAuth)', () => {
    it('should return 401 without auth', async () => {
      const req = createMockRequest(
        { code: 'sms', name: 'SMS' },
        'http://localhost/api/contact-methods', 'POST'
      );
      const res = await createContactMethod(req);
      expect(res.status).toBe(401);
    });

    it('should return 201 with valid auth', async () => {
      const req = createMockRequest(
        { code: `sms-${Date.now()}`, name: `SMS ${Date.now()}` },
        'http://localhost/api/contact-methods', 'POST',
        { 'x-user-id': String(unauthPersonId) }
      );
      const res = await createContactMethod(req);
      expect(res.status).toBe(201);
    });
  });

  // --- requirePermission endpoints ---

  describe('POST /api/offices (OFFICE_CREATE)', () => {
    it('should return 403 for user without OFFICE_CREATE', async () => {
      const req = createMockRequest(
        { phone: '555-1234', name: 'RBAC Office', slug: 'rbac-office' },
        'http://localhost/api/offices', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createOffice(req);
      expect(res.status).toBe(403);
    });

    it('should return 201 for admin with OFFICE_CREATE', async () => {
      const req = createMockRequest(
        { phone: '555-1234', name: 'RBAC Office', slug: 'rbac-office' },
        'http://localhost/api/offices', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createOffice(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/associates (ASSOCIATE_CREATE)', () => {
    it('should return 403 for user without ASSOCIATE_CREATE', async () => {
      const tag = Date.now();
      const req = createMockRequest(
        { personId: unauthPersonId, associateTypeId, slug: `assoc-${tag}` },
        'http://localhost/api/associates', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createAssociate(req);
      expect(res.status).toBe(403);
    });

    it('should return 201 for admin with ASSOCIATE_CREATE', async () => {
      const tag = Date.now();
      const req = createMockRequest(
        { personId: adminPersonId, associateTypeId, slug: `assoc-${tag}` },
        'http://localhost/api/associates', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createAssociate(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/agencies (AGENCY_CREATE)', () => {
    it('should return 403 for agent without AGENCY_CREATE', async () => {
      const tag = `${Date.now()}`;
      const req = createMockRequest(
        { name: `Test Agency ${tag}`, slug: `test-agency-${tag}` },
        'http://localhost/api/agencies', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createAgency(req);
      expect(res.status).toBe(403);
    });

    it('should return 201 for admin with AGENCY_CREATE', async () => {
      const tag = `${Date.now()}`;
      const req = createMockRequest(
        { name: `Admin Agency ${tag}`, slug: `admin-agency-${tag}` },
        'http://localhost/api/agencies', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createAgency(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/blog-posts (BLOG_CREATE)', () => {
    it('should return 403 for agent without BLOG_CREATE', async () => {
      const req = createMockRequest(
        { title: 'Test', slug: `test-${Date.now()}`, content: 'Content', authorPersonId: agentPersonId },
        'http://localhost/api/blog-posts', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createBlogPost(req);
      expect(res.status).toBe(403);
    });

    it('should return 201 for admin with BLOG_CREATE', async () => {
      const req = createMockRequest(
        { title: 'Admin Post', slug: `admin-${Date.now()}`, content: 'Content', authorPersonId: adminPersonId },
        'http://localhost/api/blog-posts', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createBlogPost(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/videos (VIDEO_CREATE)', () => {
    it('should return 403 for agent without VIDEO_CREATE', async () => {
      const req = createMockRequest(
        { uri: 'https://example.com/v.mp4' },
        'http://localhost/api/videos', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createVideo(req);
      expect(res.status).toBe(403);
    });

    it('should return 201 for admin with VIDEO_CREATE', async () => {
      const req = createMockRequest(
        { uri: 'https://example.com/admin-v.mp4' },
        'http://localhost/api/videos', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createVideo(req);
      expect(res.status).toBe(201);
    });
  });

  // --- Endpoints where agent HAS the permission ---

  describe('POST /api/properties (PROPERTY_CREATE) — agent has this permission', () => {
    it('should return 201 for agent with PROPERTY_CREATE', async () => {
      const req = createMockRequest(
        { name: 'Agent Property', description: 'Test', slug: 'agent-property', propertyTypeId: houseTypeId, propertyStatusId: forSaleStatusId },
        'http://localhost/api/properties', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createProperty(req);
      expect(res.status).toBe(201);
    });

    it('should return 201 for admin with PROPERTY_CREATE', async () => {
      const req = createMockRequest(
        { name: 'Admin Property', description: 'Test', slug: 'admin-property', propertyTypeId: houseTypeId, propertyStatusId: forSaleStatusId },
        'http://localhost/api/properties', 'POST',
        { authorization: `Bearer ${adminToken}` }
      );
      const res = await createProperty(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/images (IMAGE_CREATE) — agent has this permission', () => {
    it('should return 201 for agent', async () => {
      const req = createMockRequest(
        { uri: 'https://example.com/agent.jpg' },
        'http://localhost/api/images', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createImage(req);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/property-images (IMAGE_CREATE) — agent has this permission', () => {
    it('should return 201 for agent', async () => {
      // First create a property and image
      const prop = await prisma.property.create({
        data: { name: 'PI Test', description: 'Test', slug: 'pi-test', tenant: { connect: { id: 1 } }, propertyType: { connect: { id: houseTypeId } }, propertyStatus: { connect: { id: forSaleStatusId } } },
      });
      const img = await prisma.image.create({
        data: { uri: 'https://example.com/pi.jpg' },
      });

      const req = createMockRequest(
        { propertyId: prop.id, imageId: img.id },
        'http://localhost/api/property-images', 'POST',
        { 'x-user-id': String(agentPersonId) }
      );
      const res = await createPropertyImage(req);
      expect(res.status).toBe(201);
    });
  });
});
