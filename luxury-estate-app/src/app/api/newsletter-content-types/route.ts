import { prisma } from '@/lib/prisma';
import { handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toNewsletterContentTypeDTOList } from '@/lib/dtos';

/**
 * @swagger
 * /api/newsletter-content-types:
 *   get:
 *     tags: [NewsletterContentTypes]
 *     summary: List newsletter content types
 *     responses:
 *       200: { description: List of content types }
 */
export async function GET() {
  try {
    const types = await prisma.newsletterContentType.findMany({ orderBy: { name: 'asc' } });
    return successResponse(toNewsletterContentTypeDTOList(types));
  } catch (error) { return handlePrismaError(error); }
}
