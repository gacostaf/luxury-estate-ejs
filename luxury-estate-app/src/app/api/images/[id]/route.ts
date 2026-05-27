import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *   delete:
 *     tags: [Images]
 *     summary: Delete image (fails if referenced)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Image deleted }
 *       409: { description: Cannot delete - image is referenced }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const image = await prisma.image.findUnique({ where: { id: parseInt(id) } });
    if (!image) return handlePrismaError({ code: 'P2025' });
    return successResponse(image);
  } catch (error) { return handlePrismaError(error); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = imageSchema.parse(body);
    const image = await prisma.image.update({
      where: { id: parseInt(id) },
      data,
    });
    return successResponse(image);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // onDelete: Restrict in schema prevents deletion if referenced
    await prisma.image.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return handlePrismaError({ code: 'P2003', message: 'Cannot delete: image is referenced by properties or employees' });
    }
    return handlePrismaError(error);
  }
}