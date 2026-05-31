import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, verifyToken } from '@/lib/auth/jwt';
import { requireAuth, requirePermission, requireRole, getCurrentUser } from '@/lib/auth/middleware';
import { Permissions, getPersonPermissions, getPersonRoles, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/rbac';
import { createMockRequest } from '../utils/mock-request';
import { clearTransactionalData, seedLookupTables, lookupPersonTypeId } from '../utils/test-helpers';

describe('RBAC System', () => {
  let personId: number;
  let adminRoleId: number;
  let agentRoleId: number;
  let propertyReadPermId: number;
  let propertyCreatePermId: number;
  let adminPermId: number;

  beforeAll(async () => {
    await clearTransactionalData();
    const tenantId = 1;

    // Create permissions
    const p1 = await prisma.permission.upsert({
      where: { code: 'property:read' },
      update: {},
      create: { name: 'Property Read', code: 'property:read', description: 'Can read properties' },
    });
    propertyReadPermId = p1.id;

    const p2 = await prisma.permission.upsert({
      where: { code: 'property:create' },
      update: {},
      create: { name: 'Property Create', code: 'property:create', description: 'Can create properties' },
    });
    propertyCreatePermId = p2.id;

    const p3 = await prisma.permission.upsert({
      where: { code: 'admin:access' },
      update: {},
      create: { name: 'Admin Access', code: 'admin:access', description: 'Can access admin' },
    });
    adminPermId = p3.id;

    // Create roles
    const r1 = await prisma.role.upsert({
      where: { tenantId_code: { tenantId, code: 'ADMIN' } },
      update: {},
      create: { tenantId, name: 'Administrator', code: 'ADMIN', description: 'System admin' },
    });
    adminRoleId = r1.id;

    const r2 = await prisma.role.upsert({
      where: { tenantId_code: { tenantId, code: 'AGENT' } },
      update: {},
      create: { tenantId, name: 'Agent', code: 'AGENT', description: 'Real estate agent' },
    });
    agentRoleId = r2.id;

    // Assign all permissions to admin role
    await prisma.rolePermission.create({
      data: { roleId: adminRoleId, permissionId: propertyReadPermId, tenantId },
    }).catch(() => {});
    await prisma.rolePermission.create({
      data: { roleId: adminRoleId, permissionId: propertyCreatePermId, tenantId },
    }).catch(() => {});
    await prisma.rolePermission.create({
      data: { roleId: adminRoleId, permissionId: adminPermId, tenantId },
    }).catch(() => {});

    // Assign only property:read to agent role
    await prisma.rolePermission.create({
      data: { roleId: agentRoleId, permissionId: propertyReadPermId, tenantId },
    }).catch(() => {});
  });

  beforeEach(async () => {
    const clientTypeId = await lookupPersonTypeId('CLIENT');
    const person = await prisma.person.create({
      data: { firstName: 'RBAC', lastName: 'Test', email: `rbac-${Date.now()}@test.com`, personTypeId: clientTypeId, tenantId: 1, slug: `rbac-${Date.now()}` },
    });
    personId = person.id;
  });

  describe('JWT Token', () => {
    it('should sign and verify a token', async () => {
      const token = await signToken({ personId: 1, email: 'test@test.com' });
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const payload = await verifyToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.personId).toBe(1);
      expect(payload!.email).toBe('test@test.com');
    });

    it('should reject an invalid token', async () => {
      const payload = await verifyToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should reject a tampered token', async () => {
      const token = await signToken({ personId: 1, email: 'test@test.com' });
      const tampered = token.slice(0, -5) + 'xxxxx';
      const payload = await verifyToken(tampered);
      expect(payload).toBeNull();
    });
  });

  describe('getPersonPermissions', () => {
    it('should return empty permissions for a person with no roles', async () => {
      const permissions = await getPersonPermissions(personId);
      expect(permissions).toEqual([]);
    });

    it('should return permissions from assigned roles', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: agentRoleId, tenantId: 1 },
      });

      const permissions = await getPersonPermissions(personId);
      expect(permissions).toContain('property:read');
      expect(permissions).not.toContain('admin:access');
    });

    it('should include directly assigned permissions', async () => {
      await prisma.personPermission.create({
        data: { personId, permissionId: adminPermId, tenantId: 1 },
      });

      const permissions = await getPersonPermissions(personId);
      expect(permissions).toContain('admin:access');
    });

    it('should merge role-based and direct permissions', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: agentRoleId, tenantId: 1 },
      });
      await prisma.personPermission.create({
        data: { personId, permissionId: adminPermId, tenantId: 1 },
      });

      const permissions = await getPersonPermissions(personId);
      expect(permissions).toContain('property:read');
      expect(permissions).toContain('admin:access');
    });
  });

  describe('hasPermission / hasAnyPermission / hasAllPermissions', () => {
    it('hasPermission should return false when missing', async () => {
      const result = await hasPermission(personId, Permissions.PROPERTY_READ);
      expect(result).toBe(false);
    });

    it('hasPermission should return true when present via role', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: agentRoleId, tenantId: 1 },
      });
      const result = await hasPermission(personId, Permissions.PROPERTY_READ);
      expect(result).toBe(true);
    });

    it('hasAnyPermission should return true if any permission matches', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: agentRoleId, tenantId: 1 },
      });
      const result = await hasAnyPermission(personId, [
        Permissions.ADMIN_ACCESS,
        Permissions.PROPERTY_READ,
      ]);
      expect(result).toBe(true);
    });

    it('hasAnyPermission should return false if none match', async () => {
      const result = await hasAnyPermission(personId, [
        Permissions.ADMIN_ACCESS,
        Permissions.PROPERTY_CREATE,
      ]);
      expect(result).toBe(false);
    });

    it('hasAllPermissions should return true if all match', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: adminRoleId, tenantId: 1 },
      });
      const result = await hasAllPermissions(personId, [
        Permissions.PROPERTY_READ,
        Permissions.ADMIN_ACCESS,
      ]);
      expect(result).toBe(true);
    });

    it('hasAllPermissions should return false if missing any', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: agentRoleId, tenantId: 1 },
      });
      const result = await hasAllPermissions(personId, [
        Permissions.PROPERTY_READ,
        Permissions.ADMIN_ACCESS,
      ]);
      expect(result).toBe(false);
    });
  });

  describe('getPersonRoles', () => {
    it('should return empty for unassigned person', async () => {
      const roles = await getPersonRoles(personId);
      expect(roles).toEqual([]);
    });

    it('should return assigned role names', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: adminRoleId, tenantId: 1 },
      });
      const roles = await getPersonRoles(personId);
      expect(roles).toContain('ADMIN');
    });
  });

  describe('requireAuth middleware', () => {
    it('should return 401 when no auth provided', async () => {
      const handler = requireAuth()(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET');
      const res = await handler(req);
      expect(res.status).toBe(401);
    });

    it('should authenticate via X-User-ID header in test mode', async () => {
      const handler = requireAuth()(async (req: NextRequest) => {
        const user = getCurrentUser(req);
        return NextResponse.json({ success: true, personId: user?.personId });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        'x-user-id': String(personId),
      });
      const res = await handler(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.personId).toBe(personId);
    });

    it('should authenticate via Bearer token', async () => {
      const token = await signToken({ personId, email: 'test@test.com' });

      const handler = requireAuth()(async (req: NextRequest) => {
        const user = getCurrentUser(req);
        return NextResponse.json({ success: true, personId: user?.personId });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        authorization: `Bearer ${token}`,
      });
      const res = await handler(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.personId).toBe(personId);
    });

    it('should return 401 for invalid Bearer token', async () => {
      const handler = requireAuth()(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        authorization: 'Bearer invalid-token',
      });
      const res = await handler(req);
      expect(res.status).toBe(401);
    });
  });

  describe('requirePermission middleware', () => {
    it('should return 403 when user lacks required permission', async () => {
      const handler = requirePermission(Permissions.ADMIN_ACCESS)(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        'x-user-id': String(personId),
      });
      const res = await handler(req);
      expect(res.status).toBe(403);
    });

    it('should call handler when user has required permission', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: adminRoleId, tenantId: 1 },
      });

      const handler = requirePermission(Permissions.ADMIN_ACCESS)(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        'x-user-id': String(personId),
      });
      const res = await handler(req);
      expect(res.status).toBe(200);
    });
  });

  describe('requireRole middleware', () => {
    it('should return 403 when user lacks required role', async () => {
      const handler = requireRole('ADMIN')(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        'x-user-id': String(personId),
      });
      const res = await handler(req);
      expect(res.status).toBe(403);
    });

    it('should call handler when user has required role', async () => {
      await prisma.personRole.create({
        data: { personId, roleId: adminRoleId, tenantId: 1 },
      });

      const handler = requireRole('ADMIN')(async (req: NextRequest) => {
        return NextResponse.json({ success: true });
      });

      const req = createMockRequest(null, 'http://localhost/api/test', 'GET', {
        'x-user-id': String(personId),
      });
      const res = await handler(req);
      expect(res.status).toBe(200);
    });
  });
});
