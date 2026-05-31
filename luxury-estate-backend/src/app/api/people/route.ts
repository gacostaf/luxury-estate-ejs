import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { personSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPersonDTO, toPersonDTOList } from '@/lib/dtos';
import { requireAuth } from '@/lib/auth/middleware';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/people:
 *   get:
 *     tags: [People]
 *     summary: List people with optional filter
 *     parameters:
 *       - in: query
 *         name: isAssociate
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of people }
 *   post:
 *     tags: [People]
 *     summary: Create a person
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PersonInput' } } }
 *     responses:
 *       201: { description: Person created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAssociate = searchParams.get('isAssociate');
    const tenantId = getTenantId(req)!;
    const where: any = { tenantId };
    if (isAssociate !== null) where.isAssociate = isAssociate === 'true';
    const people = await prisma.person.findMany({ where, include: { personType: true, associate: true } });
    return successResponse(toPersonDTOList(people));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = personSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const { personTypeId, disqualificationStatusId, disqualificationReasonId, addressId, ...rest } = data;
    const person = await prisma.person.create({
      data: {
        tenant: { connect: { id: tenantId } },
        personType: { connect: { id: personTypeId } },
        ...(disqualificationStatusId != null ? { disqualificationStatus: { connect: { id: disqualificationStatusId } } } : {}),
        ...(disqualificationReasonId != null ? { disqualificationReason: { connect: { id: disqualificationReasonId } } } : {}),
        ...(addressId != null ? { address: { connect: { id: addressId } } } : {}),
        ...rest,
      },
      include: { personType: true }
    });
    return successResponse(toPersonDTO(person), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
