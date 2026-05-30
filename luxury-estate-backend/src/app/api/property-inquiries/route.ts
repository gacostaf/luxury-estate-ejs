import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyInquirySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyInquiryDTO, toPropertyInquiryDTOList } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

const inquiryIncludes = {
  property: true,
  associate: { include: { person: true } },
  person: true,
} as const;

/**
 * @swagger
 * /api/property-inquiries:
 *   get:
 *     tags: [PropertyInquiries]
 *     summary: List property inquiries, optionally filtered by propertyId or associateId
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema: { type: integer }
 *       - in: query
 *         name: associateId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of property inquiries }
 *   post:
 *     tags: [PropertyInquiries]
 *     summary: Submit a property inquiry (contact agent)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInquiryInput'
 *     responses:
 *       201: { description: Inquiry created }
 *       400: { description: Validation error }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const associateId = searchParams.get('associateId');
    const where: any = {};
    if (propertyId) where.propertyId = parseInt(propertyId, 10);
    if (associateId) where.associateId = parseInt(associateId, 10);
    const inquiries = await prisma.propertyInquiry.findMany({
      where,
      include: inquiryIncludes,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(toPropertyInquiryDTOList(inquiries));
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = propertyInquirySchema.parse(body);
    const inquiry = await prisma.propertyInquiry.create({
      data,
      include: inquiryIncludes,
    });
    return successResponse(toPropertyInquiryDTO(inquiry), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}
