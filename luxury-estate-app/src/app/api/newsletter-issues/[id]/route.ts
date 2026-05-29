import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterIssueSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterIssueDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

const issueIncludes = {
  coverImage: true,
  createdBy: true,
  sections: { orderBy: { sortOrder: 'asc' as const } },
  contents: { include: { newsletterContentType: true }, orderBy: { sortOrder: 'asc' as const } },
  campaigns: true,
} as const;

/**
 * @swagger
 * /api/newsletter-issues/{id}:
 *   get:
 *     tags: [NewsletterIssues]
 *     summary: Get newsletter issue by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Newsletter issue details }
 *   patch:
 *     tags: [NewsletterIssues]
 *     summary: Update a newsletter issue
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
 *             $ref: '#/components/schemas/NewsletterIssueInput'
 *     responses:
 *       200: { description: Newsletter issue updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [NewsletterIssues]
 *     summary: Delete a newsletter issue
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Newsletter issue deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const issue = await prisma.newsletterIssue.findUnique({
      where: { id },
      include: issueIncludes,
    });
    if (!issue) return NextResponse.json({ error: 'Newsletter issue not found' }, { status: 404 });
    return successResponse(toNewsletterIssueDTO(issue));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = newsletterIssueSchema.partial().parse(body);
    const updateData: any = { ...data };
    if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
    const issue = await prisma.newsletterIssue.update({
      where: { id },
      data: updateData,
      include: issueIncludes,
    });
    return successResponse(toNewsletterIssueDTO(issue));
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
    await prisma.newsletterIssue.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
