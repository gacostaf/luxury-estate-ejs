import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toVideoDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/videos:
 *   get:
 *     tags: [Videos]
 *     summary: List all videos
 *     responses:
 *       200: { description: List of videos }
 *   post:
 *     tags: [Videos]
 *     summary: Create a new video record
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/VideoInput' } } }
 *     responses:
 *       201: { description: Video created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET() {
  try {
    const videos = await prisma.video.findMany({ orderBy: { id: 'desc' } });
    return successResponse(videos.map(toVideoDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.VIDEO_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = videoSchema.parse(body);
    const video = await prisma.video.create({
      data: { ...data, tenantId: getTenantId(req)! },
    });
    return successResponse(toVideoDTO(video), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});