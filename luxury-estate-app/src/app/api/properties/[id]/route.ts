import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/api-helpers';
import { toPropertyDTO } from '@/lib/dtos';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const where = Number.isNaN(numId) ? { seoUrl: id } : { id: numId };

    const property = await prisma.property.findFirst({
      where,
      include: {
        propertyType: true,
        propertyStatus: true,
        agent: true,
        address: true,
        bannerImage: true,
        propertyImages: { include: { image: true } },
      },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: toPropertyDTO(property),
    });
  } catch (error) { return handlePrismaError(error); }
}
