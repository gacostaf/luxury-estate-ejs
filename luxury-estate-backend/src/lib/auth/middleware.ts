import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { prisma } from '@/lib/prisma';
import { getPersonPermissions, getPersonRoles, Permission, Permissions, RBACUser } from '@/lib/rbac';
import { resolveTenantId } from './tenantContextMiddleware';

const userContext = new WeakMap<NextRequest, RBACUser>();

export function getCurrentUser(req: NextRequest): RBACUser | null {
  return userContext.get(req) ?? null;
}

export interface RBACOptions {
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  roles?: string[];
}

async function authenticate(req: NextRequest): Promise<RBACUser | null> {
  const tenantId = resolveTenantId(req);

  const devUserId = req.headers.get('x-user-id');
  if (devUserId && process.env.NODE_ENV !== 'production') {
    const personId = parseInt(devUserId, 10);
    if (isNaN(personId)) return null;
    const person = await prisma.person.findUnique({ where: { id: personId } });
    if (!person) return null;
    const [roles, permissions] = await Promise.all([
      getPersonRoles(personId),
      getPersonPermissions(personId),
    ]);
    return { personId, email: person.email ?? '', tenantId: tenantId ?? 1, roles, permissions };
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload) return null;

  const [roles, permissions] = await Promise.all([
    getPersonRoles(payload.personId),
    getPersonPermissions(payload.personId),
  ]);

  return {
    personId: payload.personId,
    email: payload.email,
    tenantId: payload.tenantId,
    roles,
    permissions,
  };
}

function checkAccess(user: RBACUser, options: RBACOptions): string | null {
  if (options.roles && options.roles.length > 0) {
    const hasRole = options.roles.some(role => user.roles.includes(role));
    if (!hasRole) return 'Required role not found';
  }

  if (options.permissions && options.permissions.length > 0) {
    if (options.requireAllPermissions) {
      const all = options.permissions.every(p => user.permissions.includes(p));
      if (!all) return 'Missing required permissions';
    } else {
      const any = options.permissions.some(p => user.permissions.includes(p));
      if (!any) return 'Required permission not found';
    }
  }

  return null;
}

export function requireAuth(options: RBACOptions = {}) {
  return function wrap<T extends (...args: any[]) => Promise<NextResponse>>(handler: T): T {
    return (async (...args: any[]) => {
      const req = args[0] as NextRequest;

      const user = await authenticate(req);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const accessError = checkAccess(user, options);
      if (accessError) {
        return NextResponse.json({ error: 'Forbidden', detail: accessError }, { status: 403 });
      }

      userContext.set(req, user);

      return handler(...args);
    }) as T;
  };
}

export function requirePermission(...permissions: Permission[]) {
  return requireAuth({ permissions, requireAllPermissions: false });
}

export function requireAllPermissions(...permissions: Permission[]) {
  return requireAuth({ permissions, requireAllPermissions: true });
}

export function requireRole(...roles: string[]) {
  return requireAuth({ roles });
}
