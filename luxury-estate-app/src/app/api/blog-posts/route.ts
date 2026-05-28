import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogPostSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toBlogPostDTO, toBlogPostDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/blog-posts:
 *   get:
 *     tags: [BlogPosts]
 *     summary: List all blog posts
 *     responses:
 *       200: { description: List of blog posts }
 *   post:
 *     tags: [BlogPosts]
 *     summary: Create a blog post
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/BlogPostInput' } } }
 *     responses:
 *       201: { description: Blog post created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { author: true, featuredImage: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(toBlogPostDTOList(posts));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.BLOG_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = blogPostSchema.parse(body);
    const post = await prisma.blogPost.create({ data });
    return successResponse(toBlogPostDTO(post), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
