import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';
import { toAddressDTO } from '@/lib/dtos';
import { requireAuth, requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     tags: [Addresses]
 *     summary: Get address by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Address details }
 *   put:
 *     tags: [Addresses]
 *     summary: Update address
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AddressInput' } } }
 *     responses:
 *       200: { description: Address updated }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete address
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Address deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantId = getTenantId(req)!;
    const address = await prisma.address.findFirst({
      where: { id: parseInt(id), tenantId },
      include: { city: true, region: true, country: true },
    });
    if (!address) return handlePrismaError({ code: 'P2025' });
    return successResponse(toAddressDTO(address));
  } catch (error) { return handlePrismaError(error); }
}

export const PUT = requireAuth()(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = addressSchema.parse(body);
    const tenantId = getTenantId(req)!;
    const existing = await prisma.address.findFirst({ where: { id: parseInt(id), tenantId } });
    if (!existing) return handlePrismaError({ code: 'P2025' });
    const address = await prisma.address.update({
      where: { id: parseInt(id) },
      data,
      include: { city: true, region: true, country: true },
    });
    return successResponse(toAddressDTO(address));
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
});

export const DELETE = requireAuth()(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const tenantId = getTenantId(req)!;
    const existing = await prisma.address.findFirst({ where: { id: parseInt(id), tenantId } });
    if (!existing) return handlePrismaError({ code: 'P2025' });
    await prisma.address.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
});