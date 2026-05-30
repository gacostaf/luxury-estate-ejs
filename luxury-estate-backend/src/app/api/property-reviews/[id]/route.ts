import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyReviewSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyReviewDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

const reviewIncludes = {
  person: true,
  moderationStatus: true,
} as const;

/**
 * @swagger
 * /api/property-reviews/{id}:
 *   get:
 *     tags: [PropertyReviews]
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Review details }
 *   patch:
 *     tags: [PropertyReviews]
 *     summary: Update a review (moderation)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyReviewInput'
 *     responses:
 *       200: { description: Review updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [PropertyReviews]
 *     summary: Delete a review
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Review deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const review = await prisma.propertyReview.findUnique({
      where: { id },
      include: reviewIncludes,
    });
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    return successResponse(toPropertyReviewDTO(review));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = propertyReviewSchema.partial().parse(body);
    const review = await prisma.propertyReview.update({
      where: { id },
      data,
      include: reviewIncludes,
    });
    return successResponse(toPropertyReviewDTO(review));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.REVIEW_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    await prisma.propertyReview.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
