# 1. Install/verify Prisma 7+
npm install prisma@latest @prisma/client@latest

# 2. Generate client (now reads from prisma.config.ts)
npx prisma generate

# 3. Push schema to MySQL
npx prisma db push

# 4. Run seed
npx prisma db seed

# 5. Verify
npx prisma studio