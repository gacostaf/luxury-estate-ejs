import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete address
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Address deleted }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const address = await prisma.address.findUnique({ where: { id: parseInt(id) } });
    if (!address) return handlePrismaError({ code: 'P2025' });
    return successResponse(address);
  } catch (error) { return handlePrismaError(error); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = addressSchema.parse(body);
    const address = await prisma.address.update({
      where: { id: parseInt(id) },
      data,
    });
    return successResponse(address);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.address.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
}