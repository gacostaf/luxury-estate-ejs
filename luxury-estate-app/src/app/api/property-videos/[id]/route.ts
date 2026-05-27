import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyVideoSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *   delete:
 *     tags: [PropertyVideos]
 *     summary: Unlink video from property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Relation removed }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const relation = await prisma.propertyVideo.findUnique({
      where: { id: parseInt(id) },
      include: { property: { select: { name: true } }, video: true },
    });
    if (!relation) return handlePrismaError({ code: 'P2025' });
    return successResponse(relation);
  } catch (error) { return handlePrismaError(error); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = propertyVideoSchema.parse(body);
    
    const relation = await prisma.propertyVideo.update({
      where: { id: parseInt(id) },
      data,
      include: { video: true },
    });
    return successResponse(relation);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.propertyVideo.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
}