import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAddressDTO, toAddressDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: List all addresses
 *     responses:
 *       200: { description: List of addresses }
 *   post:
 *     tags: [Addresses]
 *     summary: Create a new address
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AddressInput' } } }
 *     responses:
 *       201: { description: Address created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req)!;
    const addresses = await prisma.address.findMany({
      where: { tenantId },
      include: { city: true, region: true, country: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(toAddressDTOList(addresses));
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requireAuth()(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = addressSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const address = await prisma.address.create({
      data: { tenantId, ...data },
      include: { city: true, region: true, country: true },
    });
    return successResponse(toAddressDTO(address), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});