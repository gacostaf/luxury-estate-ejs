import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleZodError(error: ZodError) {
  return NextResponse.json(
    { error: 'Validation failed', details: error.errors },
    { status: 400 }
  );
}

export function handlePrismaError(error: any) {
  if (error.code === 'P2002') {
    return NextResponse.json({ error: 'Unique constraint violation', field: error.meta?.target }, { status: 409 });
  }
  if (error.code === 'P2025') {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }
  console.error('Prisma Error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}