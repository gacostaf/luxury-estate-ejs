import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSubscriptionSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterSubscriptionDTO, toNewsletterSubscriptionDTOList } from '@/lib/dtos';
import { requireAuth } from '@/lib/auth/middleware';

const subscriptionIncludes = {
  person: true,
  categories: { include: { newsletterCategory: true } },
  leadSource: true,
} as const;

/**
 * @swagger
 * /api/newsletter-subscriptions:
 *   get:
 *     tags: [NewsletterSubscriptions]
 *     summary: List newsletter subscriptions
 *     parameters:
 *       - in: query
 *         name: isSubscribed
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: List of subscriptions }
 *   post:
 *     tags: [NewsletterSubscriptions]
 *     summary: Create or update a newsletter subscription
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsletterSubscriptionInput'
 *     responses:
 *       201: { description: Subscription created/updated }
 *       401: { description: Unauthorized }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isSubscribed = searchParams.get('isSubscribed');
    const where: any = {};
    if (isSubscribed !== null) where.isSubscribed = isSubscribed === 'true';
    const subs = await prisma.newsletterSubscription.findMany({
      where,
      include: subscriptionIncludes,
      orderBy: { subscribedAt: 'desc' },
    });
    return successResponse(toNewsletterSubscriptionDTOList(subs));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = newsletterSubscriptionSchema.parse(body);
    const { categoryIds, ...subData } = data;
    const sub = await prisma.newsletterSubscription.upsert({
      where: { personId: subData.personId },
      update: { isSubscribed: subData.isSubscribed, source: subData.source, leadSourceId: subData.leadSourceId },
      create: { personId: subData.personId, isSubscribed: subData.isSubscribed, source: subData.source, leadSourceId: subData.leadSourceId },
      include: subscriptionIncludes,
    });
    if (categoryIds && categoryIds.length > 0) {
      await prisma.newsletterSubscriptionCategory.deleteMany({ where: { newsletterSubscriptionId: sub.id } });
      await prisma.newsletterSubscriptionCategory.createMany({
        data: categoryIds.map((categoryId: number) => ({
          newsletterSubscriptionId: sub.id,
          newsletterCategoryId: categoryId,
        })),
      });
    }
    const updated = await prisma.newsletterSubscription.findUnique({
      where: { id: sub.id },
      include: subscriptionIncludes,
    });
    return successResponse(toNewsletterSubscriptionDTO(updated!), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
