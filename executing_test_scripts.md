# Test Execution Scripts

## Overview

The test suite (199 tests across 21 suites) can run against **MySQL** (default) or **SQLite**. Both targets produce identical results — all 199 tests pass — but differ in setup requirements and execution speed.

## Prerequisites

```bash
cd luxury-estate-backend
npm install
```

## MySQL Target (Default)

The default target. Uses a MySQL database on `localhost:3306`.

### Setup

```bash
# Create the test database (one-time)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS luxury_estate_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Push the schema
npm run db:test:setup

# Regenerate Prisma Client
npx prisma generate
```

### Run

```bash
npm test
# or explicitly:
npm run test:mysql
```

### Configuration

- **Env file**: `.env.test` — `DATABASE_URL="mysql://root:Test1234$@localhost:3306/luxury_estate_test"`
- **Schema**: `prisma/schema.prisma` — `provider = "mysql"`
- **Prisma config**: `prisma.config.ts` — schema from `prisma/schema.prisma`

### Advantages

- **Faster execution** (~95s) — MySQL's InnoDB buffer cache keeps data in memory
- **Production parity** — same database engine as dev/staging/production
- **Full MySQL feature support** — no schema transformation needed

### Disadvantages

- **Requires MySQL server** — must have MySQL installed and running
- **Manual setup** — database must be created before first run
- **Heavier resource usage** — MySQL daemon consumes memory even when idle

---

## SQLite Target (Alternative)

Zero-configuration file-based database. The SQLite schema is auto-generated from the MySQL schema by stripping `@db.*` annotations.

### Setup

The `test:sqlite` script handles everything:

```bash
npm run test:sqlite
```

This runs:
1. `generate-sqlite-schema.js` — transforms `schema.prisma` → `schema.sqlite.prisma`
2. `prisma generate --schema=prisma/schema.sqlite.prisma` — generates the client
3. `prisma db push --schema=prisma/schema.sqlite.prisma` — creates `prisma/test.db`
4. `jest --runInBand` — runs all tests with `TEST_TARGET=sqlite`

### One-time commands (if needed)

```bash
# Generate schema and client
npm run db:sqlite:generate

# Push schema to create the SQLite database file
npm run db:sqlite:push
```

### Configuration

- **Env file**: `.env.test.sqlite` — `DATABASE_URL="file:./prisma/test.db"`
- **Schema**: `prisma/schema.sqlite.prisma` (auto-generated) — `provider = "sqlite"`
- **Prisma config**: `PRISMA_SCHEMA=prisma/schema.sqlite.prisma`

### Advantages

- **Zero configuration** — no database server needed
- **CI/CD friendly** — works in any environment without services
- **Portable** — single file, easy to reset (delete and re-push)
- **Consistent results** — all 199 tests pass identically to MySQL

### Disadvantages

- **Slower execution** (~129s) — file-based locking adds overhead for sequential writes
- **Generated schema** — must be regenerated when the MySQL schema changes
- **No production parity** — differences in SQL dialect and features

---

## Switching Between Targets

Each time you switch, the Prisma Client must be regenerated for the target database:

```bash
# Switch to MySQL
npx prisma generate

# Switch to SQLite
npm run db:sqlite:generate
```

The `test:sqlite` script auto-generates before running, so explicit regeneration is only needed when switching back to MySQL.

## Average Execution Times

All times are for `jest --runInBand` (single worker) on local hardware. Measured across multiple runs after warm-up.

| Target | Time | vs MySQL | Notes |
|-------|------|----------|-------|
| **MySQL** (optimized) | ~95s | baseline | Raw SQL `DELETE FROM` + global seeding |
| **SQLite** | ~129s | +36% | File I/O overhead for sequential writes |

### Optimization Notes

The test suite was optimized from an original ~136s (MySQL baseline) by:

1. **Raw SQL cleanup** — replaced 58 Prisma `deleteMany()` calls with raw `DELETE FROM` wrapped in `FOREIGN_KEY_CHECKS=0` and `$transaction`
2. **Global seeding** — lookup tables (personType, propertyType, etc.) are seeded once in `jest.setup.ts` `beforeAll` instead of per-suite
3. **Per-suite isolation** — `clearTransactionalData()` only clears transactional tables, preserving globally-seeded lookup data between suites

## Implementation Files

| File | Purpose |
|------|---------|
| `scripts/generate-sqlite-schema.js` | Transforms MySQL schema → SQLite schema |
| `.env.test` | MySQL test environment variables |
| `.env.test.sqlite` | SQLite test environment variables |
| `prisma/schema.prisma` | MySQL schema (source of truth) |
| `prisma/schema.sqlite.prisma` | SQLite schema (auto-generated) |
| `prisma.config.ts` | Prisma config with `PRISMA_SCHEMA` env override |
| `jest.setup.ts` | Global `beforeAll` seed + env file loading |
| `__tests__/utils/test-helpers.ts` | `clearTransactionalData()` with DB-agnostic FK disable |
