import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const IMAGE_SOURCE_DIR = 'C:\\Users\\gerar\\Downloads\\real-estate-seed-images';
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '..', 'public', 'images');

const ATLANTA_CITIES = [
  'Atlanta', 'Alpharetta', 'Marietta', 'Roswell', 'Sandy Springs',
  'Johns Creek', 'Decatur', 'Smyrna', 'Brookhaven', 'Dunwoody',
];

async function main() {
  console.log('📸 Assigning images to Atlanta properties...\n');

  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }

  const sourceFiles = fs.readdirSync(IMAGE_SOURCE_DIR)
    .filter(f => /^house_\d+\.jpg$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)![0], 10);
      const nb = parseInt(b.match(/\d+/)![0], 10);
      return na - nb;
    });

  console.log(`  Found ${sourceFiles.length} source images\n`);

  const properties = await prisma.property.findMany({
    where: {
      addressLocality: { in: ATLANTA_CITIES },
    },
    orderBy: { id: 'asc' },
  });

  console.log(`  Found ${properties.length} Atlanta properties\n`);

  console.log('  Cleaning up existing images...');

  const propIds = properties.map(p => p.id);

  const existingPis = await prisma.propertyImage.findMany({
    where: { propertyId: { in: propIds } },
    select: { imageId: true },
  });
  const existingImageIds = existingPis.map(pi => pi.imageId);

  await prisma.property.updateMany({
    where: { bannerImageId: { in: existingImageIds } },
    data: { bannerImageId: null },
  });

  await prisma.propertyImage.deleteMany({
    where: { propertyId: { in: propIds } },
  });

  if (existingImageIds.length > 0) {
    await prisma.image.deleteMany({
      where: { id: { in: existingImageIds } },
    });
  }

  console.log(`  Removed ${existingImageIds.length} existing images\n`);

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const baseIdx = i * 3;

    const imageFiles = sourceFiles.slice(baseIdx, baseIdx + 3);

    if (imageFiles.length < 3) {
      console.warn(`  ⚠️  Not enough images for property ${prop.id}, skipping`);
      continue;
    }

    const imageRecords: { id: number }[] = [];

    for (let j = 0; j < imageFiles.length; j++) {
      const srcPath = path.join(IMAGE_SOURCE_DIR, imageFiles[j]);
      const destName = `prop_${prop.id}_${j + 1}.jpg`;
      const destPath = path.join(PUBLIC_IMAGES_DIR, destName);

      fs.copyFileSync(srcPath, destPath);

      const img = await prisma.image.create({
        data: {
          uri: `/images/${destName}`,
          isPersonal: false,
        },
      });

      imageRecords.push(img);
    }

    const [bannerImg, ...carouselImgs] = imageRecords;

    await prisma.property.update({
      where: { id: prop.id },
      data: {
        bannerImageId: bannerImg.id,
        propertyImages: {
          create: [
            { imageId: bannerImg.id, isBanner: true },
            ...carouselImgs.map(img => ({ imageId: img.id, isBanner: false })),
          ],
        },
      },
    });

    if ((i + 1) % 25 === 0) {
      console.log(`  ✅ Updated ${i + 1} / ${properties.length} properties`);
    }
  }

  console.log(`\n✅ Done! ${properties.length} properties updated with 3 images each`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
