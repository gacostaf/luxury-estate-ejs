import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSubscriptionSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterSubscriptionDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

const subscriptionIncludes = {
  person: true,
  categories: { include: { newsletterCategory: true } },
  leadSource: true,
} as const;

/**
 * @swagger
 * /api/newsletter-subscriptions/{id}:
 *   get:
 *     tags: [NewsletterSubscriptions]
 *     summary: Get subscription by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Subscription details }
 *   patch:
 *     tags: [NewsletterSubscriptions]
 *     summary: Update a subscription
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Subscription updated }
 *       401: { description: Unauthorized }
 *   delete:
 *     tags: [NewsletterSubscriptions]
 *     summary: Delete a subscription
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Subscription deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const sub = await prisma.newsletterSubscription.findFirst({
      where: { id, tenantId },
      include: subscriptionIncludes,
    });
    if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    return successResponse(toNewsletterSubscriptionDTO(sub));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = newsletterSubscriptionSchema.partial().parse(body);
    const { categoryIds, ...subData } = data;
    const tenantId = getTenantId(req)!;
    const existing = await prisma.newsletterSubscription.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    const sub = await prisma.newsletterSubscription.update({
      where: { id },
      data: subData,
      include: subscriptionIncludes,
    });
    if (categoryIds) {
      const tenantId = sub.tenantId;
      await prisma.newsletterSubscriptionCategory.deleteMany({ where: { newsletterSubscriptionId: sub.id } });
      await prisma.newsletterSubscriptionCategory.createMany({
        data: categoryIds.map((categoryId: number) => ({
          newsletterSubscriptionId: sub.id,
          newsletterCategoryId: categoryId,
          tenantId,
        })),
      });
    }
    const updated = await prisma.newsletterSubscription.findUnique({
      where: { id: sub.id },
      include: subscriptionIncludes,
    });
    return successResponse(toNewsletterSubscriptionDTO(updated!));
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
    const tenantId = getTenantId(req)!;
    const existing = await prisma.newsletterSubscription.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    await prisma.newsletterSubscription.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
