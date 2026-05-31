import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactMethodSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toContactMethodDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/contact-methods:
 *   get:
 *     tags: [ContactMethods]
 *     summary: List all contact methods
 *     responses:
 *       200: { description: List of contact methods }
 *   post:
 *     tags: [ContactMethods]
 *     summary: Create a contact method
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/ContactMethodInput' } } }
 *     responses:
 *       201: { description: Contact method created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const methods = await prisma.contactMethod.findMany({ where: { tenantId } });
    return successResponse(methods.map(toContactMethodDTO));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = contactMethodSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const method = await prisma.contactMethod.create({ data: { tenantId, ...data } });
    return successResponse(toContactMethodDTO(method), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
