import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyVideoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyVideoDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/property-videos:
 *   get:
 *     tags: [PropertyVideos]
 *     summary: List all property-video relations
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of property-video relations }
 *   post:
 *     tags: [PropertyVideos]
 *     summary: Link a video to a property
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyVideoInput' } } }
 *     responses:
 *       201: { description: Relation created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    
    const where = propertyId ? { propertyId: parseInt(propertyId) } : {};
    const relations = await prisma.propertyVideo.findMany({
      where,
      include: { property: { select: { name: true } }, video: true },
    });
    return successResponse(relations.map(toPropertyVideoDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.VIDEO_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = propertyVideoSchema.parse(body);
    
    // Verify property and video exist
    const [property, video] = await Promise.all([
      prisma.property.findUnique({ where: { id: data.propertyId } }),
      prisma.video.findUnique({ where: { id: data.videoId } }),
    ]);
    if (!property || !video) return handlePrismaError({ code: 'P2025' });

    const relation = await prisma.propertyVideo.create({
      data,
      include: { video: true },
    });
    return successResponse(toPropertyVideoDTO(relation), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});