import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tourRequestSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toTourRequestDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

const tourIncludes = {
  property: true,
  clientPerson: true,
  tourStatus: true,
  primaryAssociate: { include: { person: true } },
  secondaryAssociate: { include: { person: true } },
  contactMethod: true,
  leadSource: true,
} as const;

/**
 * @swagger
 * /api/tour-requests/{id}:
 *   get:
 *     tags: [TourRequests]
 *     summary: Get tour request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour request details }
 *   patch:
 *     tags: [TourRequests]
 *     summary: Update a tour request (status, notes, etc.)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourRequestInput'
 *     responses:
 *       200: { description: Tour request updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [TourRequests]
 *     summary: Delete a tour request
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour request deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const tour = await prisma.tourRequest.findFirst({
      where: { id, tenantId },
      include: tourIncludes,
    });
    if (!tour) return NextResponse.json({ error: 'Tour request not found' }, { status: 404 });
    return successResponse(toTourRequestDTO(tour));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = tourRequestSchema.partial().parse(body);
    const updateData: any = { ...data };
    if (data.scheduledDate) updateData.scheduledDate = new Date(data.scheduledDate);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.tourRequest.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Tour request not found' }, { status: 404 });
    const tour = await prisma.tourRequest.update({
      where: { id },
      data: updateData,
      include: tourIncludes,
    });
    return successResponse(toTourRequestDTO(tour));
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
    const tenantId = getTenantId(req)!;
    const existing = await prisma.tourRequest.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Tour request not found' }, { status: 404 });
    await prisma.tourRequest.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
