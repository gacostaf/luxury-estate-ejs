import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/AddressInput' } } }
 *     responses:
 *       201: { description: Address created }
 */
export async function GET() {
  try {
    const addresses = await prisma.address.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(addresses);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = addressSchema.parse(body);
    const address = await prisma.address.create({ data });
    return successResponse(address, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}