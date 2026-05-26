# 🛠️ Initial Setup Guide

Follow these steps to configure your local environment, scaffold the **Luxury Estate** application, and optionally containerize it with Docker.

> ⚠️ **Important:** Modern Prisma & Next.js 15 tooling require **Node.js ≥22.0.0**. We use `nvm` to guarantee version consistency across all developer machines and CI environments.

---

## 1️⃣ Install `nvm` & Node.js

### macOS / Linux
```bash
# 1. Install nvm (v0.40.3 stable)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2. Load nvm into current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 3. Install & set Node.js v22 (LTS)
nvm install 22
nvm use 22
nvm alias default 22

# 4. Verify
node -v  # ✅ Expected: v22.x.x
npm -v   # ✅ Expected: 10.x.x

Windows
Download nvm-windows: github.com/coreybutler/nvm-windows/releases
Install & restart terminal:

```bash
nvm install 22
nvm use 22
nvm alias default 22
node -v
```

---

2️⃣ Configure Project Version Lock
Inside the luxury-estate-app/ folder, create a .nvmrc so nvm auto-detects the correct version:

```bash
cd luxury-estate-app
echo "22" > .nvmrc
nvm use  # Switches to Node 22 automatically


✅ Commit .nvmrc to Git. Ignore .env.local and node_modules.

---

3️⃣ Run the Scaffold Script

```bash
chmod +x setup-next-mysql.sh
./setup-next-mysql.sh luxury-estate-app
cd luxury-estate-app

---

4️⃣ Configure Next.js for Docker (Required)
Add output: 'standalone' to next.config.ts so the Dockerfile builds correctly:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ⬅️ Required for Docker multi-stage builds
};
```

---

5️⃣ Environment & Database Setup

```bash
cp .env.example .env.local
```

Edit .env.local:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/luxury_estate_db"
```

💡 Create DB manually (Prisma doesn't auto-create databases):

```sql
CREATE DATABASE luxury_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

6️⃣ Sync Schema & Start

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

7️⃣ Optional: 🐳 Docker Workflow (Optional)
Local Dev (Recommended)
Run MySQL in Docker for isolation, keep Next.js local for hot-reloading:

🐳 Docker Workflow (Optional)
Local Dev (Recommended)
Run MySQL in Docker for isolation, keep Next.js local for hot-reloading:

```bash
docker compose up -d db
npm run dev
```

Full Docker (Production/Preview)
Builds & runs both app + database:

```bash
docker compose up --build
```

---

🔍 Troubleshooting


| Issue | Solution |
| :--- | :--- |
| **npm warn EBADENGINE** | Fixed by Node ≥22 via nvm. Verify with node -v. |
| **P1001: Can't reach database** | Check MySQL is running, verify DATABASE_URL, ensure port 3306 is free. |
| **Docker build fails on standalone** | Ensure output: "standalone" exists in next.config.ts. |
| **Prisma client out of sync** | Run npx prisma generate. Never commit node_modules/.prisma |

---

💡 Best Practices
Run npx prisma studio to visually manage data during dev.
Use npm run lint & tsc --noEmit before pushing.
Keep .nvmrc committed, keep .env.local ignored.


---

### 🐳 `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
```

---

🐳 docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: mysql:8.4
    container_name: luxury-estate-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${DB_NAME:-luxury_estate_db}
      MYSQL_USER: ${DB_USER:-appuser}
      MYSQL_PASSWORD: ${DB_PASSWORD:-apppassword}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: luxury-estate-app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=mysql://${DB_USER:-appuser}:${DB_PASSWORD:-apppassword}@db:3306/${DB_NAME:-luxury_estate_db}
      - NODE_ENV=production
    ports:
      - "3000:3000"

volumes:
  mysql_data:
```

---

🚫 .dockerignore

```gitignore
.env
.env*.local
.env.development.local
.env.test.local
.env.production.local
.git
.github
.gitignore
.idea
.next
.nvmrc
*.md
node_modules
docker-compose*.yml
Dockerfile
**/*.log
```

---

📌 Quick Usage Notes
1. Local Dev (Recommended): docker compose up -d db → npm run dev (keeps hot-reloading intact)

2. Full Docker: docker compose up --build (uses production build, no hot-reload)

3. Prisma in Docker: Run docker compose exec app npx prisma db push if managing schema inside containers.



