import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactRequestSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toContactRequestDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

const contactRequestIncludes = {
  requestType: true,
  requestStatus: true,
  contactMethod: true,
  leadSource: true,
  assignedTo: { select: { id: true, personId: true } },
} as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const contactReq = await prisma.contactRequest.findUnique({
      where: { id },
      include: contactRequestIncludes,
    });
    if (!contactReq) return NextResponse.json({ error: 'Contact request not found' }, { status: 404 });
    return successResponse(toContactRequestDTO(contactReq));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = contactRequestSchema.partial().parse(body);
    const contactReq = await prisma.contactRequest.update({
      where: { id },
      data,
      include: contactRequestIncludes,
    });
    return successResponse(toContactRequestDTO(contactReq));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.REVIEW_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    await prisma.contactRequest.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
