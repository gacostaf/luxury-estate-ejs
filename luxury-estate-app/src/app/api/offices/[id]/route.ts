import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { officeSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/offices/{id}:
 *   get:
 *     tags: [Offices]
 *     summary: Get office by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Office details }
 *   put:
 *     tags: [Offices]
 *     summary: Update office
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/OfficeInput' } } }
 *     responses:
 *       200: { description: Office updated }
 *   delete:
 *     tags: [Offices]
 *     summary: Delete office
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Office deleted }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const office = await prisma.office.findUnique({
      where: { id: parseInt(id) },
      include: { address: true, employees: { include: { person: true } } },
    });
    if (!office) return handlePrismaError({ code: 'P2025' });
    return successResponse(office);
  } catch (error) { return handlePrismaError(error); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = officeSchema.parse(body);
    const office = await prisma.office.update({
      where: { id: parseInt(id) },
      data,
      include: { address: true },
    });
    return successResponse(office);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.office.delete({ where: { id: parseInt(id) } });
    return new Response(null, { status: 204 });
  } catch (error) { return handlePrismaError(error); }
}