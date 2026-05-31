import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toImageDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/images:
 *   get:
 *     tags: [Images]
 *     summary: List all images
 *     responses:
 *       200: { description: List of images }
 *   post:
 *     tags: [Images]
 *     summary: Create a new image record
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/ImageInput' } } }
 *     responses:
 *       201: { description: Image created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET() {
  try {
    const images = await prisma.image.findMany({ orderBy: { id: 'desc' } });
    return successResponse(images.map(toImageDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.IMAGE_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = imageSchema.parse(body);
    const image = await prisma.image.create({
      data: { ...data, tenantId: getTenantId(req)! },
    });
    return successResponse(toImageDTO(image), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});