import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadSourceSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toLeadSourceDTO } from '@/lib/dtos';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET() {
  try {
    const sources = await prisma.leadSource.findMany({ orderBy: { sortOrder: 'asc' } });
    return successResponse(sources.map(toLeadSourceDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = leadSourceSchema.parse(body);
    const source = await prisma.leadSource.create({ data });
    return successResponse(toLeadSourceDTO(source), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
