import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { employeeStandardSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/employees/standard:
 *   post:
 *     tags: [Employees]
 *     summary: Create employee record for an existing person
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/EmployeeStandardInput' } } }
 *     responses:
 *       201: { description: Employee linked to existing person }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = employeeStandardSchema.parse(body);

    // Verify person exists
    const person = await prisma.person.findUnique({ where: { id: data.personId } });
    if (!person) return NextResponse.json({ error: 'Person not found' }, { status: 404 });

    const employee = await prisma.employee.create({
      data: {
        personId: data.personId,
        department: data.department,
        officeId: data.officeId,
        photoId: data.photoId,
        videoId: data.videoId,
        fbHandle: data.fbHandle,
        igHandle: data.igHandle,
        linkedinHandle: data.linkedinHandle,
      },
      include: { person: true, office: true }
    });

    return successResponse(employee, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}