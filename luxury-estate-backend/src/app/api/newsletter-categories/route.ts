import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterCategorySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterCategoryDTO, toNewsletterCategoryDTOList } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/newsletter-categories:
 *   get:
 *     tags: [NewsletterCategories]
 *     summary: List newsletter categories
 *     responses:
 *       200: { description: List of categories }
 *   post:
 *     tags: [NewsletterCategories]
 *     summary: Create a newsletter category
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsletterCategoryInput'
 *     responses:
 *       201: { description: Category created }
 *       401: { description: Unauthorized }
 */
export async function GET() {
  try {
    const categories = await prisma.newsletterCategory.findMany({ orderBy: { name: 'asc' } });
    return successResponse(toNewsletterCategoryDTOList(categories));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = newsletterCategorySchema.parse(body);
    const category = await prisma.newsletterCategory.create({ data });
    return successResponse(toNewsletterCategoryDTO(category), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
