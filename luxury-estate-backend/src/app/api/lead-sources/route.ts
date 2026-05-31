import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadSourceSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toLeadSourceDTO } from '@/lib/dtos';
import { requireAuth } from '@/lib/auth/middleware';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const sources = await prisma.leadSource.findMany({ where: { tenantId }, orderBy: { sortOrder: 'asc' } });
    return successResponse(sources.map(toLeadSourceDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = leadSourceSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const source = await prisma.leadSource.create({ data: { tenantId, ...data } });
    return successResponse(toLeadSourceDTO(source), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
