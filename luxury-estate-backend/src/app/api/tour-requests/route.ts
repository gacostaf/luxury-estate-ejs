import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tourRequestSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toTourRequestDTO, toTourRequestDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

const tourIncludes = {
  property: true,
  clientPerson: true,
  tourType: true,
  tourStatus: true,
  primaryAssociate: { include: { person: true } },
  secondaryAssociate: { include: { person: true } },
  contactMethod: true,
  leadSource: true,
} as const;

/**
 * @swagger
 * /api/tour-requests:
 *   get:
 *     tags: [TourRequests]
 *     summary: List tour requests, optionally filtered by propertyId or status
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of tour requests }
 *   post:
 *     tags: [TourRequests]
 *     summary: Create a tour request
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourRequestInput'
 *     responses:
 *       201: { description: Tour request created }
 *       401: { description: Unauthorized }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const tourStatusId = searchParams.get('tourStatusId');
    const tenantId = getTenantId(req)!;
    const where: any = { tenantId };
    if (propertyId) where.propertyId = parseInt(propertyId);
    if (tourStatusId) where.tourStatusId = parseInt(tourStatusId);
    const tours = await prisma.tourRequest.findMany({
      where,
      include: tourIncludes,
      orderBy: { scheduledDate: 'asc' },
    });
    return successResponse(toTourRequestDTOList(tours));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = tourRequestSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const tour = await prisma.tourRequest.create({
      data: {
        tenantId,
        ...data,
        scheduledDate: new Date(data.scheduledDate),
      },
      include: tourIncludes,
    });
    return successResponse(toTourRequestDTO(tour), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
