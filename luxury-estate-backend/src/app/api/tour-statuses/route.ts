import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handlePrismaError, successResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET() {
  try {
    const statuses = await prisma.tourStatus.findMany({ orderBy: { sortOrder: 'asc' } });
    return successResponse(statuses);
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const status = await prisma.tourStatus.create({ data: body });
    return successResponse(status, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
