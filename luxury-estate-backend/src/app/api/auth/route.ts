import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';
import { signToken } from '@/lib/auth/jwt';
import { verifyPassword } from '@/lib/auth/password';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password, returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoginResponse'
 *       401: { description: Invalid credentials or account locked }
 *       404: { description: Account not found }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const account = await prisma.authAccount.findUnique({ where: { email } });
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const tenantId = getTenantId(req)!;
    const person = await prisma.person.findFirst({ where: { id: account.personId, tenantId } });
    if (!person) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (!account.isActive) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    if (account.lockedUntil && account.lockedUntil > new Date()) {
      return NextResponse.json({ error: 'Account is temporarily locked' }, { status: 401 });
    }

    if (!account.passwordHash) {
      return NextResponse.json({ error: 'Account has no password set' }, { status: 401 });
    }

    const valid = verifyPassword(password, account.passwordHash);
    if (!valid) {
      await prisma.authAccount.update({
        where: { id: account.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await prisma.authAccount.update({
      where: { id: account.id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0 },
    });

    const token = await signToken({ personId: account.personId, email: account.email, tenantId });

    return NextResponse.json({
      success: true,
      data: { token, personId: account.personId, email: account.email },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
