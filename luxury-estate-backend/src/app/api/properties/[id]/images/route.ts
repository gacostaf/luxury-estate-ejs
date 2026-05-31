import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/api-helpers';
import { requirePermission } from '@/lib/auth/middleware';
import { Permissions } from '@/lib/rbac';
import { getTenantId } from '@/lib/auth/tenantContextMiddleware';
import { saveImageFile, getFileName, timestamp } from '@/lib/image-storage';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * @swagger
 * /api/properties/{id}/images:
 *   post:
 *     tags: [Property Images]
 *     summary: Upload property images (multipart/form-data, multiple files)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: Image files (jpeg, png, webp, gif, max 10MB each)
 *               isBanner:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: Set the first image as banner
 *     responses:
 *       201: { description: Images uploaded }
 *       400: { description: Invalid input }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Property not found }
 */
async function handler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id, 10);

    if (Number.isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Property ID must be a number' },
        { status: 400 },
      );
    }

    const tenantId = getTenantId(req)!;
    const property = await prisma.property.findFirst({ where: { id: propertyId, tenantId } });
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files').filter((v): v is File => v instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one file is required' },
        { status: 400 },
      );
    }

    const ts = timestamp();
    const results: any[] = [];
    let firstImageId: number | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type for ${file.name}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}. Maximum: ${MAX_FILE_SIZE / 1024 / 1024} MB` },
          { status: 400 },
        );
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const consecutive = i + 1;
      const buffer = Buffer.from(await file.arrayBuffer());

      const uri = saveImageFile(propertyId, ts, consecutive, ext, buffer);

      const image = await prisma.image.create({
        data: { uri, isPersonal: false, tenantId },
      });

      if (firstImageId === null) {
        firstImageId = image.id;
      }

      await prisma.propertyImage.create({
        data: {
          propertyId,
          imageId: image.id,
          isBanner: false,
          tenantId,
        },
      });

      results.push({
        id: image.id,
        uri,
        fileName: getFileName(propertyId, ts, consecutive, ext),
        consecutive,
      });
    }

    const rawBanner = formData.get('isBanner');
    const isBanner = rawBanner === 'true' || rawBanner === '1';

    if (isBanner && firstImageId !== null) {
      await prisma.propertyImage.updateMany({
        where: { propertyId, imageId: firstImageId },
        data: { isBanner: true },
      });
      await prisma.property.update({
        where: { id: propertyId },
        data: { bannerImageId: firstImageId },
      });
    }

    return NextResponse.json({
      success: true,
      data: results,
    }, { status: 201 });
  } catch (error) { return handlePrismaError(error); }
}

export const POST = requirePermission(Permissions.IMAGE_CREATE)(handler);
