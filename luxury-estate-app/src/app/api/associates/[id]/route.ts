import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { associateSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAssociateDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/associates/{id}:
 *   get:
 *     tags: [Associates]
 *     summary: Get associate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Associate details }
 *   patch:
 *     tags: [Associates]
 *     summary: Update associate
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AssociateInput' } } }
 *     responses:
 *       200: { description: Associate updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Associates]
 *     summary: Delete associate
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Associate deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const associate = await prisma.associate.findUnique({
      where: { id },
      include: { person: true, associateType: true, agency: true, office: true, supervisor: true, subordinates: true },
    });
    if (!associate) return NextResponse.json({ error: 'Associate not found' }, { status: 404 });
    return successResponse(toAssociateDTO(associate));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.ASSOCIATE_UPDATE)(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const data = associateSchema.partial().parse(body);
    const associate = await prisma.associate.update({ where: { id }, data });
    return successResponse(toAssociateDTO(associate));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.ASSOCIATE_DELETE)(async(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.associate.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
