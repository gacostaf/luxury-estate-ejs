import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAddressDTO, toAddressDTOList } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';

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
export async function GET() {
  try {
    const addresses = await prisma.address.findMany({
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
    const address = await prisma.address.create({
      data,
      include: { city: true, region: true, country: true },
    });
    return successResponse(toAddressDTO(address), 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});