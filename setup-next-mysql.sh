#!/usr/bin/env bash
set -e

# Use first argument as project name, or default to "luxury-estate-app"
PROJECT_NAME="${1:-luxury-estate-backend}"

echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f2)
REQUIRED_MAJOR=18
ACTUAL_MAJOR=$(echo "$NODE_VERSION" | cut -d '.' -f1)
if [ "$ACTUAL_MAJOR" -lt "$REQUIRED_MAJOR" ]; then
  echo "❌ Node.js v${REQUIRED_MAJOR}+ is required. You have v${NODE_VERSION}"
  exit 1
fi

echo "🏗️  Creating Next.js + TypeScript + Tailwind project: $PROJECT_NAME"
npx create-next-app@latest "$PROJECT_NAME" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

cd "$PROJECT_NAME"

echo "📦 Installing Prisma & MySQL adapter..."
npm install @prisma/client
npm install -D prisma

echo "🗄️  Initializing Prisma for MySQL..."
npx prisma init --datasource-provider mysql

echo "⚙️  Configuring Prisma schema..."
cat > prisma/schema.prisma << 'PRISMA_SCHEMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Example: Luxury Property model
model Property {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String?  @db.Text
  price       Float
  location    String   @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
PRISMA_SCHEMA

echo "🔌 Creating Prisma client singleton (Next.js optimized)..."
mkdir -p src/lib
cat > src/lib/prisma.ts << 'PRISMA_CLIENT'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
PRISMA_CLIENT

echo "🔑 Generating .env.example..."
cat > .env.example << 'ENV'
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/luxury_estate_db"
ENV

echo ""
echo "✅ Project scaffolded successfully!"
echo "📋 Next steps:"
echo "  cd $PROJECT_NAME"
echo "  cp .env.example .env.local          # 🔑 Replace with your real MySQL credentials"
echo "  npx prisma generate                 # 🧱 Generate TypeScript types"
echo "  npx prisma db push                  # 🗃️  Create tables in MySQL"
echo "  npm run dev                         # 🚀 Start dev server"
echo ""
echo "💡 Make sure your MySQL server is running before running 'prisma db push'."