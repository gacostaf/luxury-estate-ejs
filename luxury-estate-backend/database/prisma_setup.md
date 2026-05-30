# The datbase must be created before running any of the following commands
CREATE DATABASE luxury_estate_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
  
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to MySQL
npx prisma db push

# 3. Run seed script
npx prisma db seed

# 4. Verify
npx prisma studio