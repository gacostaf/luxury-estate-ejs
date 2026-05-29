import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyDTO, toPropertyDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

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
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PropertyInput' } } }
 *     responses:
 *       201: { description: Property created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const propertyTypeId = searchParams.get('propertyTypeId');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '12', 10)));

    const where: any = {};
    if (status) where.propertyStatus = { name: status };
    if (city) where.addressLocality = city;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { addressLocality: { contains: search } },
        { streetAddress: { contains: search } },
      ];
    }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms, 10) };
    if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms, 10) };
    if (propertyTypeId) where.propertyTypeId = parseInt(propertyTypeId, 10);

    const [properties, totalItems] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { propertyType: true, propertyStatus: true, agent: true, address: true, bannerImage: true, propertyImages: { include: { image: true } } },
        orderBy: { publishDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: toPropertyDTOList(properties),
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.PROPERTY_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = propertySchema.parse(body);
    const property = await prisma.property.create({ data, include: { propertyType: true, propertyStatus: true } });
    return successResponse(toPropertyDTO(property), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});