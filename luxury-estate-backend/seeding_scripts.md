# Seeding Scripts

All scripts live under `database/seeds/` and are run via `tsx`.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `seed.ts` | `npm run db:seed` | Core seed: creates tenant, lookup tables (person types, property types/statuses, tour types/statuses, contact methods, lead sources, etc.), roles & permissions, geographic data (US/Mexico countries, CA/FL states, cities), 3 addresses, 3 people (agent Sarah Johnson, external agent Michael Torres, client Marcus Chen), 6 media records (images + video), 1 office, 3 sample properties. |
| `seed-properties.ts` | `npm run db:seed-properties` | Bulk property seed: creates up to 100 properties with randomized data across CA and FL cities. Each property gets 3 local images from `public/images/seeds/` (first = banner). Uses 300 seed photos (`house_001.jpg`–`house_300.jpg`). Requires `seed.ts` to have been run first. |
| `seed-atlanta.ts` | `npm run db:seed-atlanta` | Atlanta metro properties: creates up to 100 properties in Atlanta-area cities using random street data and Unsplash image URLs. Requires `seed.ts` first. |

## Procedure

**First time or from scratch:**

```bash
npm run db:seed
npm run db:seed-properties
```

**To add Atlanta data (additional 100 properties):**

```bash
npm run db:seed-atlanta
```

**To reset and reseed:**

Drop the database or use `npx prisma db push --force-reset`, then re-run the commands above.

## Notes

- All scripts use a `DEFAULT_TENANT_ID` of `1`.
- `seed-properties.ts` is idempotent — if 100+ properties already exist, it skips.
- The main seed (`seed.ts`) uses `upsert` for lookup tables, so re-running it is safe.
- Image URIs in `seed-properties.ts` point to `/images/seeds/house_XXX.jpg` — served from `public/images/seeds/` by Next.js.
