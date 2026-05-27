import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyImageSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/property-images:
 *   get:
 *     tags: [PropertyImages]
 *     summary: List all property-image relations
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of property-image relations }
 *   post:
 *     tags: [PropertyImages]
 *     summary: Link an image to a property
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyImageInput' } } }
 *     responses:
 *       201: { description: Relation created }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    
    const where = propertyId ? { propertyId: parseInt(propertyId) } : {};
    const relations = await prisma.propertyImage.findMany({
      where,
      include: { property: { select: { name: true } }, image: true },
      orderBy: { isBanner: 'desc' },
    });
    return successResponse(relations);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = propertyImageSchema.parse(body);
    
    // Verify property and image exist
    const [property, image] = await Promise.all([
      prisma.property.findUnique({ where: { id: data.propertyId } }),
      prisma.image.findUnique({ where: { id: data.imageId } }),
    ]);
    if (!property || !image) return handlePrismaError({ code: 'P2025' });

    // If isBanner=true, unset other banners for this property first
    if (data.isBanner) {
      await prisma.propertyImage.updateMany({
        where: { propertyId: data.propertyId, isBanner: true },
        data: { isBanner: false },
      });
    }

    const relation = await prisma.propertyImage.create({
      data,
      include: { image: true },
    });
    return successResponse(relation, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}