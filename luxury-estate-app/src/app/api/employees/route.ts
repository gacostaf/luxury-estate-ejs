import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { combinedEmployeeSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/employees:
 *   post:
 *     tags: [Employees]
 *     summary: Create Person + Employee + (Optional) Office in one transaction
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/CombinedEmployeeInput' } } }
 *     responses:
 *       201: { description: Employee created with linked person }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = combinedEmployeeSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Office if details provided
      let officeId = data.officeId;
      if (data.officeName && !officeId) {
        const office = await tx.office.create({
          data: { phone: data.officePhone, addressId: data.officeAddressId }
        });
        officeId = office.id;
      }

      // 2. Create Person
      const person = await tx.person.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          description: data.description,
          personTypeId: data.personTypeId,
          isLead: data.isLead,
          isClient: data.isClient,
          isEmployee: data.isEmployee,
          isDisqualified: data.isDisqualified,
          addressId: data.addressId,
        }
      });

      // 3. Create Employee linked to Person & Office
      const employee = await tx.employee.create({
        data: {
          personId: person.id,
          department: data.department,
          officeId,
          photoId: data.photoId,
          videoId: data.videoId,
          fbHandle: data.fbHandle,
          igHandle: data.igHandle,
          linkedinHandle: data.linkedinHandle,
        },
        include: { person: true, office: true }
      });

      return { person, employee };
    });

    return successResponse(result, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}