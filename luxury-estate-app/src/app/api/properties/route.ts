import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags: [Properties]
 *     summary: List properties with filters
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of properties }
 *   post:
 *     tags: [Properties]
 *     summary: Create property
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyInput' } } }
 *     responses:
 *       201: { description: Property created }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const city = searchParams.get('city');

    const where: any = {};
    if (status) where.propertyStatus = { name: status };
    if (city) where.addressLocality = city;

    const properties = await prisma.property.findMany({
      where,
      include: { propertyType: true, propertyStatus: true, agent: true, address: true },
      orderBy: { publishDate: 'desc' }
    });
    return successResponse(properties);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = propertySchema.parse(body);
    const property = await prisma.property.create({ data, include: { propertyType: true, propertyStatus: true } });
    return successResponse(property, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}