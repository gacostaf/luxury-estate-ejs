import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agencySchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAgencyDTO, toAgencyDTOList } from '@/lib/dtos';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

/**
 * @swagger
 * /api/agencies:
 *   get:
 *     tags: [Agencies]
 *     summary: List all agencies
 *     responses:
 *       200: { description: List of agencies }
 *   post:
 *     tags: [Agencies]
 *     summary: Create a new agency
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AgencyInput' } } }
 *     responses:
 *       201: { description: Agency created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET() {
  try {
    const agencies = await prisma.agency.findMany({ include: { address: true } });
    return successResponse(toAgencyDTOList(agencies));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.AGENCY_CREATE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = agencySchema.parse(body);
    const agency = await prisma.agency.create({ data });
    return successResponse(toAgencyDTO(agency), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
});
