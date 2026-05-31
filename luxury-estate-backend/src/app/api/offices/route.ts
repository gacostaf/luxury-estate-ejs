import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { officeSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toOfficeDTO, toOfficeDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/offices:
 *   get:
 *     tags: [Offices]
 *     summary: List all offices
 *     responses:
 *       200: { description: List of offices }
 *   post:
 *     tags: [Offices]
 *     summary: Create a new office
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OfficeInput' } } }
 *     responses:
 *       201: { description: Office created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const offices = await prisma.office.findMany({ where: { tenantId }, include: { address: true, associates: { include: { person: true } } } });
    return successResponse(toOfficeDTOList(offices));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.OFFICE_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = officeSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const office = await prisma.office.create({ data: { tenantId, ...data }, include: { address: true } });
    return successResponse(toOfficeDTO(office), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});