import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { associateSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAssociateDTO, toAssociateDTOList } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/associates:
 *   get:
 *     tags: [Associates]
 *     summary: List all associates
 *     responses:
 *       200: { description: List of associates }
 *   post:
 *     tags: [Associates]
 *     summary: Create a new associate
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AssociateInput' } } }
 *     responses:
 *       201: { description: Associate created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const associates = await prisma.associate.findMany({
      where: { tenantId },
      include: { person: true, associateType: true, agency: true, office: true },
    });
    return successResponse(toAssociateDTOList(associates));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.ASSOCIATE_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = associateSchema.parse(body);
    const tenantId = getTenantId(req)!;

    const person = await prisma.person.findFirst({ where: { id: data.personId, tenantId } });
    if (!person) return NextResponse.json({ error: 'Person not found' }, { status: 404 });

    const associate = await prisma.associate.create({
      data: { tenantId, ...data },
      include: { person: true, associateType: true },
    });
    return successResponse(toAssociateDTO(associate), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
