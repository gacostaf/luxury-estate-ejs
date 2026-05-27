import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { officeSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

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
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OfficeInput' } } }
 *     responses:
 *       201: { description: Office created }
 */
export async function GET() {
  try {
    const offices = await prisma.office.findMany({ include: { address: true, employees: { include: { person: true } } } });
    return successResponse(offices);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = officeSchema.parse(body);
    const office = await prisma.office.create({ data, include: { address: true } });
    return successResponse(office, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}