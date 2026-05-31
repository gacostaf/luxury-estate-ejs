import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const tenantContext = new WeakMap<NextRequest, number>();

export function getTenantId(req: NextRequest): number | null {
  return tenantContext.get(req) ?? resolveTenantId(req);
}

export function requireTenant() {
  return function wrap<T extends (...args: any[]) => Promise<NextResponse>>(handler: T): T {
    return (async (...args: any[]) => {
      const req = args[0] as NextRequest;
      const tenantId = resolveTenantId(req);
      if (!tenantId) {
        return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
      }
      const tenant = await prisma.tenant.findUnique({ where: { id: tenantId, isActive: true } });
      if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found or inactive' }, { status: 404 });
      }
      tenantContext.set(req, tenantId);
      return handler(...args);
    }) as T;
  };
}

export function resolveTenantId(req: NextRequest): number | null {
  const headerTenant = req.headers.get('x-tenant-id');
  if (headerTenant) {
    const id = parseInt(headerTenant, 10);
    if (!isNaN(id)) return id;
  }
  if (process.env.NODE_ENV !== 'production') {
    return 1;
  }
  return null;
}
