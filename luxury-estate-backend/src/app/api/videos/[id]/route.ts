import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toVideoDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     tags: [Videos]
 *     summary: Get video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Video details }
 *   put:
 *     tags: [Videos]
 *     summary: Update video
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/VideoInput' } } }
 *     responses:
 *       200: { description: Video updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Videos]
 *     summary: Delete video (fails if referenced)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Video deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       409: { description: Cannot delete - video is referenced }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({ where: { id: parseInt(id) } });
    if (!video) return handlePrismaError({ code: 'P2025' });
    return successResponse(toVideoDTO(video));
  } catch (error) { return handlePrismaError(error); }
}

export const PUT = requirePermission(Permissions.VIDEO_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = videoSchema.parse(body);
    const video = await prisma.video.update({
      where: { id: parseInt(id) },
      data,
    });
    return successResponse(toVideoDTO(video));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.VIDEO_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await prisma.video.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return handlePrismaError({ code: 'P2003', message: 'Cannot delete: video is referenced by properties or associates' });
    }
    return handlePrismaError(error);
  }
});