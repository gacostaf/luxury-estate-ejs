// prisma.config.ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
    // ✅ Seed configuration (Prisma 7+)
    migrations: {
        seed: 'tsx ./prisma/seed.ts', // Use 'node', 'bun', or 'deno run' as needed
    },

    datasource: {
        db: {
            provider: 'mysql',
            url: process.env.DATABASE_URL,
        },
    },
});