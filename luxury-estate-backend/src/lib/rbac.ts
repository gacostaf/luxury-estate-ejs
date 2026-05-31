import { prisma } from '@/lib/prisma';

export const Permissions = {
  PERSON_READ: 'person:read',
  PERSON_CREATE: 'person:create',
  PERSON_UPDATE: 'person:update',
  PERSON_DELETE: 'person:delete',
  PROPERTY_READ: 'property:read',
  PROPERTY_CREATE: 'property:create',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  ASSOCIATE_READ: 'associate:read',
  ASSOCIATE_CREATE: 'associate:create',
  ASSOCIATE_UPDATE: 'associate:update',
  ASSOCIATE_DELETE: 'associate:delete',
  AGENCY_READ: 'agency:read',
  AGENCY_CREATE: 'agency:create',
  AGENCY_UPDATE: 'agency:update',
  AGENCY_DELETE: 'agency:delete',
  BLOG_READ: 'blog:read',
  BLOG_CREATE: 'blog:create',
  BLOG_UPDATE: 'blog:update',
  BLOG_DELETE: 'blog:delete',
  OFFICE_READ: 'office:read',
  OFFICE_CREATE: 'office:create',
  OFFICE_UPDATE: 'office:update',
  OFFICE_DELETE: 'office:delete',
  IMAGE_READ: 'image:read',
  IMAGE_CREATE: 'image:create',
  IMAGE_UPDATE: 'image:update',
  IMAGE_DELETE: 'image:delete',
  VIDEO_READ: 'video:read',
  VIDEO_CREATE: 'video:create',
  VIDEO_UPDATE: 'video:update',
  VIDEO_DELETE: 'video:delete',
  REVIEW_MODERATE: 'review:moderate',
  REVIEW_DELETE: 'review:delete',
  ADMIN_ACCESS: 'admin:access',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const Roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT: 'AGENT',
  BROKER: 'BROKER',
  REALTOR: 'REALTOR',
  CLIENT: 'CLIENT',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const RolePermissions: Record<string, Permission[]> = {
  ADMIN: Object.values(Permissions),
  MANAGER: [
    Permissions.PERSON_READ, Permissions.PERSON_CREATE, Permissions.PERSON_UPDATE,
    Permissions.PROPERTY_READ, Permissions.PROPERTY_CREATE, Permissions.PROPERTY_UPDATE, Permissions.PROPERTY_DELETE,
    Permissions.ASSOCIATE_READ, Permissions.ASSOCIATE_CREATE, Permissions.ASSOCIATE_UPDATE,
    Permissions.AGENCY_READ, Permissions.AGENCY_CREATE, Permissions.AGENCY_UPDATE,
    Permissions.BLOG_READ, Permissions.BLOG_CREATE, Permissions.BLOG_UPDATE,
    Permissions.OFFICE_READ, Permissions.OFFICE_CREATE, Permissions.OFFICE_UPDATE,
    Permissions.IMAGE_READ, Permissions.IMAGE_CREATE,
    Permissions.VIDEO_READ, Permissions.VIDEO_CREATE,
    Permissions.REVIEW_MODERATE,
  ],
  AGENT: [
    Permissions.PERSON_READ,
    Permissions.PROPERTY_READ, Permissions.PROPERTY_CREATE, Permissions.PROPERTY_UPDATE,
    Permissions.ASSOCIATE_READ,
    Permissions.AGENCY_READ,
    Permissions.BLOG_READ,
    Permissions.OFFICE_READ,
    Permissions.IMAGE_READ, Permissions.IMAGE_CREATE,
    Permissions.VIDEO_READ, Permissions.VIDEO_CREATE,
  ],
  BROKER: [
    Permissions.PERSON_READ,
    Permissions.PROPERTY_READ, Permissions.PROPERTY_CREATE, Permissions.PROPERTY_UPDATE,
    Permissions.ASSOCIATE_READ,
    Permissions.AGENCY_READ,
    Permissions.BLOG_READ,
    Permissions.OFFICE_READ,
    Permissions.IMAGE_READ, Permissions.IMAGE_CREATE,
    Permissions.VIDEO_READ, Permissions.VIDEO_CREATE,
  ],
  REALTOR: [
    Permissions.PERSON_READ,
    Permissions.PROPERTY_READ, Permissions.PROPERTY_CREATE, Permissions.PROPERTY_UPDATE,
    Permissions.ASSOCIATE_READ,
    Permissions.AGENCY_READ,
    Permissions.BLOG_READ,
    Permissions.OFFICE_READ,
  ],
  CLIENT: [
    Permissions.PERSON_READ,
    Permissions.PROPERTY_READ,
    Permissions.AGENCY_READ,
    Permissions.ASSOCIATE_READ,
    Permissions.BLOG_READ,
    Permissions.OFFICE_READ,
    Permissions.IMAGE_READ,
    Permissions.VIDEO_READ,
  ],
};

export interface RBACUser {
  personId: number;
  email: string;
  tenantId: number;
  roles: string[];
  permissions: Permission[];
}

export async function getPersonPermissions(personId: number, tenantId?: number): Promise<Permission[]> {
  const wherePersonRole: any = { personId };
  if (tenantId) wherePersonRole.tenantId = tenantId;

  const [personRoles, personPermissions] = await Promise.all([
    prisma.personRole.findMany({
      where: wherePersonRole,
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    }),
    prisma.personPermission.findMany({
      where: { personId },
      include: { permission: true },
    }),
  ]);

  const permSet = new Set<string>();

  for (const pr of personRoles) {
    for (const rp of pr.role.rolePermissions) {
      permSet.add(rp.permission.code);
    }
  }

  for (const pp of personPermissions) {
    permSet.add(pp.permission.code);
  }

  return Array.from(permSet) as Permission[];
}

export async function getPersonRoles(personId: number, tenantId?: number): Promise<string[]> {
  const where: any = { personId };
  if (tenantId) where.tenantId = tenantId;

  const roles = await prisma.personRole.findMany({
    where,
    include: { role: true },
  });
  return roles.map(pr => pr.role.code);
}

export async function getRBACUser(personId: number): Promise<RBACUser> {
  const person = await prisma.person.findUnique({ where: { id: personId } });
  if (!person) throw new Error('Person not found');
  
  const [roles, permissions] = await Promise.all([
    getPersonRoles(personId, person.tenantId),
    getPersonPermissions(personId, person.tenantId),
  ]);

  return {
    personId,
    email: person.email ?? '',
    tenantId: person.tenantId,
    roles,
    permissions,
  };
}

export async function hasPermission(personId: number, permission: Permission): Promise<boolean> {
  const permissions = await getPersonPermissions(personId);
  return permissions.includes(permission);
}

export async function hasAnyPermission(personId: number, required: Permission[]): Promise<boolean> {
  if (required.length === 0) return true;
  const permissions = await getPersonPermissions(personId);
  return required.some(p => permissions.includes(p));
}

export async function hasAllPermissions(personId: number, required: Permission[]): Promise<boolean> {
  if (required.length === 0) return true;
  const permissions = await getPersonPermissions(personId);
  return required.every(p => permissions.includes(p));
}
