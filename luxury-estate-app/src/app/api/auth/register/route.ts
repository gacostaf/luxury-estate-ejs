import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new auth account (creates password hash)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterInput'
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthRegisterResponse'
 *       400: { description: Validation error }
 *       404: { description: Person not found }
 *       409: { description: Email already in use }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personId, email, password } = registerSchema.parse(body);

    const person = await prisma.person.findUnique({ where: { id: personId } });
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const existing = await prisma.authAccount.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);

    const account = await prisma.authAccount.create({
      data: { personId, email, passwordHash },
    });

    return NextResponse.json({ success: true, data: { id: account.id, email: account.email } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
