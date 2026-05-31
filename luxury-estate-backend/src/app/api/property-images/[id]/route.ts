import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyImageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyImageDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/property-images/{id}:
 *   get:
 *     tags: [PropertyImages]
 *     summary: Get property-image relation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Relation details }
 *   put:
 *     tags: [PropertyImages]
 *     summary: Update relation (e.g., toggle banner)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyImageInput' } } }
 *     responses:
 *       200: { description: Relation updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [PropertyImages]
 *     summary: Unlink image from property
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Relation removed }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantId = getTenantId(req)!;
    const relation = await prisma.propertyImage.findFirst({
      where: { id: parseInt(id), property: { tenantId } },
      include: { property: { select: { name: true } }, image: true },
    });
    if (!relation) return handlePrismaError({ code: 'P2025' });
    return successResponse(toPropertyImageDTO(relation));
  } catch (error) { return handlePrismaError(error); }
}

export const PUT = requirePermission(Permissions.IMAGE_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = propertyImageSchema.parse(body);
    const tenantId = getTenantId(req)!;
    
    // Handle banner logic
    const existing = await prisma.propertyImage.findFirst({ where: { id: parseInt(id), property: { tenantId } } });
    if (!existing) return handlePrismaError({ code: 'P2025' });
    if (data.isBanner) {
      await prisma.propertyImage.updateMany({
        where: { propertyId: existing.propertyId, isBanner: true, id: { not: existing.id } },
        data: { isBanner: false },
      });
    }
    
    const relation = await prisma.propertyImage.update({
      where: { id: existing.id },
      data,
      include: { image: true },
    });
    return successResponse(toPropertyImageDTO(relation));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.IMAGE_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const tenantId = getTenantId(req)!;
    const existing = await prisma.propertyImage.findFirst({ where: { id: parseInt(id), property: { tenantId } } });
    if (!existing) return handlePrismaError({ code: 'P2025' });
    await prisma.propertyImage.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
});