import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { personSchema } from '@/lib/validation';
import { handleZodError, handlePrismaError, successResponse } from '@/lib/api-helpers';

/**
 * @swagger
 * /api/people:
 *   get:
 *     tags: [People]
 *     summary: List all people
 *     parameters:
 *       - in: query
 *         name: isEmployee
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: List of people }
 *   post:
 *     tags: [People]
 *     summary: Create a new person
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { $ref: '#/components/schemas/PersonInput' } } }
 *     responses:
 *       201: { description: Person created }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isEmployee = searchParams.get('isEmployee');
    
    const where = isEmployee ? { isEmployee: isEmployee === 'true' } : {};
    const people = await prisma.person.findMany({ where, include: { personType: true, employee: true } });
    return successResponse(people);
  } catch (error) { return handlePrismaError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = personSchema.parse(body);
    const person = await prisma.person.create({ data, include: { personType: true } });
    return successResponse(person, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return handleZodError(error as any);
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    return handlePrismaError(error);
  }
}