import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterContentTypeDTOList } from '@/lib/dtos';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/newsletter-content-types:
 *   get:
 *     tags: [NewsletterContentTypes]
 *     summary: List newsletter content types
 *     responses:
 *       200: { description: List of content types }
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const types = await prisma.newsletterContentType.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
    return successResponse(toNewsletterContentTypeDTOList(types));
  } catch (error) { return handlePrismaError(error); }
}
