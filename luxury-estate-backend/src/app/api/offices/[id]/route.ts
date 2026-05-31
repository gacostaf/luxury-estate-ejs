import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { officeSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toOfficeDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/offices/{id}:
 *   get:
 *     tags: [Offices]
 *     summary: Get office by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Office details }
 *   patch:
 *     tags: [Offices]
 *     summary: Update office
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OfficeInput' } } }
 *     responses:
 *       200: { description: Office updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Offices]
 *     summary: Delete office
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Office deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const tenantId = getTenantId(req)!;
    if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const office = await prisma.office.findFirst({
      where: { id: numId, tenantId },
      include: { address: true, associates: { include: { person: true } } },
    });
    if (!office) return NextResponse.json({ error: 'Office not found' }, { status: 404 });
    return successResponse(toOfficeDTO(office));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}

export const PATCH = requirePermission(Permissions.OFFICE_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = officeSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.office.findFirst({ where: { id: parseInt(id), tenantId } });
    if (!existing) return NextResponse.json({ error: 'Office not found' }, { status: 404 });
    const office = await prisma.office.update({
      where: { id: parseInt(id) },
      data,
      include: { address: true },
    });
    return successResponse(toOfficeDTO(office));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.OFFICE_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const tenantId = getTenantId(req)!;
    const existing = await prisma.office.findFirst({ where: { id: parseInt(id), tenantId } });
    if (!existing) return NextResponse.json({ error: 'Office not found' }, { status: 404 });
    await prisma.office.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
});