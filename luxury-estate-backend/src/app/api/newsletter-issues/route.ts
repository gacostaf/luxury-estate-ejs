import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterIssueSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterIssueDTO, toNewsletterIssueDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

const issueIncludes = {
  coverImage: true,
  createdBy: true,
  sections: { orderBy: { sortOrder: 'asc' as const } },
  contents: { include: { newsletterContentType: true }, orderBy: { sortOrder: 'asc' as const } },
  campaigns: true,
} as const;

/**
 * @swagger
 * /api/newsletter-issues:
 *   get:
 *     tags: [NewsletterIssues]
 *     summary: List newsletter issues
 *     parameters:
 *       - in: query
 *         name: isPublished
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: List of newsletter issues }
 *   post:
 *     tags: [NewsletterIssues]
 *     summary: Create a newsletter issue
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsletterIssueInput'
 *     responses:
 *       201: { description: Newsletter issue created }
 *       401: { description: Unauthorized }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublished = searchParams.get('isPublished');
    const tenantId = getTenantId(req)!;
    const where: any = { tenantId };
    if (isPublished !== null) where.isPublished = isPublished === 'true';
    const issues = await prisma.newsletterIssue.findMany({
      where,
      include: issueIncludes,
      orderBy: { publishedAt: 'desc' },
    });
    return successResponse(toNewsletterIssueDTOList(issues));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = newsletterIssueSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const issue = await prisma.newsletterIssue.create({
      data: {
        tenantId,
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
      include: issueIncludes,
    });
    return successResponse(toNewsletterIssueDTO(issue), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
