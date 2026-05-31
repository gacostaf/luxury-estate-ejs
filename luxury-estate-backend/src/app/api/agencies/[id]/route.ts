import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agencySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAgencyDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/agencies/{id}:
 *   get:
 *     tags: [Agencies]
 *     summary: Get agency by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agency details }
 *   patch:
 *     tags: [Agencies]
 *     summary: Update agency
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AgencyInput' } } }
 *     responses:
 *       200: { description: Agency updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Agencies]
 *     summary: Delete agency
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Agency deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const agency = await prisma.agency.findFirst({
      where: { id, tenantId },
      include: { address: true, associates: { include: { person: true } }, properties: true },
    });
    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    return successResponse(toAgencyDTO(agency));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.AGENCY_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = agencySchema.partial().parse(body);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.agency.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    const agency = await prisma.agency.update({ where: { id }, data });
    return successResponse(toAgencyDTO(agency));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.AGENCY_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.agency.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    await prisma.agency.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
