import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyImageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/property-images/{id}:
 *   get:
 *     tags: [PropertyImages]
 *     summary: Get property-image relation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Relation details }
 *   put:
 *     tags: [PropertyImages]
 *     summary: Update relation (e.g., toggle banner)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyImageInput' } } }
 *     responses:
 *       200: { description: Relation updated }
 *   delete:
 *     tags: [PropertyImages]
 *     summary: Unlink image from property
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
    const relation = await prisma.propertyImage.findUnique({
      where: { id: parseInt(id) },
      include: { property: { select: { name: true } }, image: true },
    });
    if (!relation) return handlePrismaError({ code: 'P2025' });
    return successResponse(relation);
  } catch (error) { return handlePrismaError(error); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = propertyImageSchema.parse(body);
    
    // Handle banner logic
    if (data.isBanner) {
      const existing = await prisma.propertyImage.findUnique({ where: { id: parseInt(id) } });
      if (existing) {
        await prisma.propertyImage.updateMany({
          where: { propertyId: existing.propertyId, isBanner: true, id: { not: parseInt(id) } },
          data: { isBanner: false },
        });
      }
    }
    
    const relation = await prisma.propertyImage.update({
      where: { id: parseInt(id) },
      data,
      include: { image: true },
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
    await prisma.propertyImage.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
}