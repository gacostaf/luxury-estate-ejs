import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/ImageInput' } } }
 *     responses:
 *       201: { description: Image created }
 */
export async function GET() {
  try {
    const images = await prisma.image.findMany({ orderBy: { id: 'desc' } });
    return successResponse(images);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = imageSchema.parse(body);
    const image = await prisma.image.create({ data });
    return successResponse(image, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}