import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogPostSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toBlogPostDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/blog-posts/{id}:
 *   get:
 *     tags: [BlogPosts]
 *     summary: Get blog post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog post details }
 *   patch:
 *     tags: [BlogPosts]
 *     summary: Update blog post
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/BlogPostInput' } } }
 *     responses:
 *       200: { description: Blog post updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [BlogPosts]
 *     summary: Delete blog post
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog post deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const post = await prisma.blogPost.findFirst({ where: { id, tenantId }, include: { authorPerson: true, featuredImage: true } });
    if (!post) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    return successResponse(toBlogPostDTO(post));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.BLOG_UPDATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = blogPostSchema.partial().parse(body);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.blogPost.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    const post = await prisma.blogPost.update({ where: { id }, data });
    return successResponse(toBlogPostDTO(post));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});

export const DELETE = requirePermission(Permissions.BLOG_DELETE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.blogPost.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    await prisma.blogPost.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
