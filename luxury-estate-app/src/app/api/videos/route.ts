import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/VideoInput' } } }
 *     responses:
 *       201: { description: Video created }
 */
export async function GET() {
  try {
    const videos = await prisma.video.findMany({ orderBy: { id: 'desc' } });
    return successResponse(videos);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = videoSchema.parse(body);
    const video = await prisma.video.create({ data });
    return successResponse(video, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}