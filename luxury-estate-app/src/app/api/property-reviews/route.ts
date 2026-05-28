import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyReviewSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyReviewDTO, toPropertyReviewDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

const reviewIncludes = {
  person: true,
  moderationStatus: true,
} as const;

/**
 * @swagger
 * /api/property-reviews:
 *   get:
 *     tags: [PropertyReviews]
 *     summary: List reviews, optionally filtered by propertyId
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of reviews }
 *   post:
 *     tags: [PropertyReviews]
 *     summary: Create a property review
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyReviewInput'
 *     responses:
 *       201: { description: Review created }
 *       401: { description: Unauthorized }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const where = propertyId ? { propertyId: parseInt(propertyId) } : {};
    const reviews = await prisma.propertyReview.findMany({
      where,
      include: reviewIncludes,
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(toPropertyReviewDTOList(reviews));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = propertyReviewSchema.parse(body);
    const review = await prisma.propertyReview.create({
      data,
      include: reviewIncludes,
    });
    return successResponse(toPropertyReviewDTO(review), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
