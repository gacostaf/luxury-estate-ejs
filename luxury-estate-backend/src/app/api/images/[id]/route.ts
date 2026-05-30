import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toImageDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     tags: [Images]
 *     summary: Get image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Image details }
 *   put:
 *     tags: [Images]
 *     summary: Update image
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/ImageInput' } } }
 *     responses:
 *       200: { description: Image updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Images]
 *     summary: Delete image (fails if referenced)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Image deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       409: { description: Cannot delete - image is referenced }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const image = await prisma.image.findUnique({ where: { id: parseInt(id) } });
    if (!image) return handlePrismaError({ code: 'P2025' });
    return successResponse(toImageDTO(image));
  } catch (error) { return handlePrismaError(error); }
}

export const PUT = requirePermission(Permissions.IMAGE_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = imageSchema.parse(body);
    const image = await prisma.image.update({
      where: { id: parseInt(id) },
      data,
    });
    return successResponse(toImageDTO(image));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.IMAGE_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    // onDelete: Restrict in schema prevents deletion if referenced
    await prisma.image.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return handlePrismaError({ code: 'P2003', message: 'Cannot delete: image is referenced by properties or associates' });
    }
    return handlePrismaError(error);
  }
});