import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { propertyInquirySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toPropertyInquiryDTO } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

const inquiryIncludes = {
  property: true,
  associate: { include: { person: true } },
  person: true,
  contactMethod: true,
  leadSource: true,
} as const;

/**
 * @swagger
 * /api/property-inquiries/{id}:
 *   get:
 *     tags: [PropertyInquiries]
 *     summary: Get property inquiry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Property inquiry details }
 *       404: { description: Not found }
 *   patch:
 *     tags: [PropertyInquiries]
 *     summary: Update a property inquiry
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
 *             $ref: '#/components/schemas/PropertyInquiryInput'
 *     responses:
 *       200: { description: Inquiry updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [PropertyInquiries]
 *     summary: Delete a property inquiry
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Inquiry deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const tenantId = getTenantId(req)!;
    const inquiry = await prisma.propertyInquiry.findFirst({
      where: { id, tenantId },
      include: inquiryIncludes,
    });
    if (!inquiry) return NextResponse.json({ error: 'Property inquiry not found' }, { status: 404 });
    return successResponse(toPropertyInquiryDTO(inquiry));
  } catch (error) { return handlePrismaError(error); }
}

export const PATCH = requirePermission(Permissions.REVIEW_MODERATE)(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const data = propertyInquirySchema.partial().parse(body);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.propertyInquiry.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Property inquiry not found' }, { status: 404 });
    const inquiry = await prisma.propertyInquiry.update({
      where: { id },
      data,
      include: inquiryIncludes,
    });
    return successResponse(toPropertyInquiryDTO(inquiry));
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
    const existing = await prisma.propertyInquiry.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: 'Property inquiry not found' }, { status: 404 });
    await prisma.propertyInquiry.delete({ where: { id } });
    return successResponse({ deleted: true });
  } catch (error) { return handlePrismaError(error); }
});
