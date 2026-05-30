import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactRequestSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toContactRequestDTO, toContactRequestDTOList } from '@/lib/dtos';

const contactRequestIncludes = {
  requestType: true,
  requestStatus: true,
  contactMethod: true,
  leadSource: true,
  assignedTo: { select: { id: true, personId: true } },
} as const;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestStatusId = searchParams.get('requestStatusId');
    const requestTypeId = searchParams.get('requestTypeId');
    const email = searchParams.get('email');
    const where: any = {};
    if (requestStatusId) where.requestStatusId = parseInt(requestStatusId, 10);
    if (requestTypeId) where.requestTypeId = parseInt(requestTypeId, 10);
    if (email) where.email = email;
    const requests = await prisma.contactRequest.findMany({
      where,
      include: contactRequestIncludes,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(toContactRequestDTOList(requests));
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactRequestSchema.parse(body);
    const contactReq = await prisma.contactRequest.create({
      data,
      include: contactRequestIncludes,
    });
    return successResponse(toContactRequestDTO(contactReq), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}
