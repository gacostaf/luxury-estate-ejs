import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyVideoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyVideoDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/property-videos/{id}:
 *   get:
 *     tags: [PropertyVideos]
 *     summary: Get property-video relation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Relation details }
 *   put:
 *     tags: [PropertyVideos]
 *     summary: Update relation
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyVideoInput' } } }
 *     responses:
 *       200: { description: Relation updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [PropertyVideos]
 *     summary: Unlink video from property
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
    const relation = await prisma.propertyVideo.findUnique({
      where: { id: parseInt(id) },
      include: { property: { select: { name: true } }, video: true },
    });
    if (!relation) return handlePrismaError({ code: 'P2025' });
    return successResponse(toPropertyVideoDTO(relation));
  } catch (error) { return handlePrismaError(error); }
}

export const PUT = requirePermission(Permissions.VIDEO_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = propertyVideoSchema.parse(body);
    
    const relation = await prisma.propertyVideo.update({
      where: { id: parseInt(id) },
      data,
      include: { video: true },
    });
    return successResponse(toPropertyVideoDTO(relation));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.VIDEO_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await prisma.propertyVideo.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
});