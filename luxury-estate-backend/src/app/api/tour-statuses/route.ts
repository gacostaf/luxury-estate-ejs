import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handlePrismaError, successResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth/middleware';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const statuses = await prisma.tourStatus.findMany({ where: { tenantId }, orderBy: { sortOrder: 'asc' } });
    return successResponse(statuses);
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const tenantId = getTenantId(req)!;
    const status = await prisma.tourStatus.create({ data: { tenantId, ...body } });
    return successResponse(status, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
