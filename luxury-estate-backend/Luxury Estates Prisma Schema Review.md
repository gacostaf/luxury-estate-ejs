# Luxury Estates — Prisma Schema Review

**Date:** 2026-05-30  
**Scope:** Full `schema.prisma` analysis for SaaS multi-tenancy, security, and RBAC.

---

## 1. Multi-Tenancy Issues

### 1.1 Missing `tenantId` (data leak risk)

These models lack tenant isolation. Data from one tenant could leak to another via queries that don't filter by tenant:

| Model | Tenant ID | Risk |
|---|---|---|
| `Image` | ❌ None | Images accessible across tenants |
| `Video` | ❌ None | Videos accessible across tenants |
| `PropertyVideo` | ❌ None | Property-video joins not scoped |
| `PersonPermission` | ❌ None | Direct permissions bypass tenant entirely |
| `NewsletterContent` | ❌ None | Content visible across tenants |
| `NewsletterSection` | ❌ None | Sections visible across tenants |
| `NewsletterSubscriptionCategory` | ❌ None | Join record not scoped |

**Fix:** Add `tenantId` + `@@index([tenantId])` to each, and a `@relation` back to `Tenant`.

### 1.2 Global email uniqueness (cross-tenant collision)

```prisma
// Person — line 267
email   String?  @unique @map("EMAIL") @db.VarChar(254)

// AuthAccount — line 335
email   String   @unique @map("EMAIL") @db.VarChar(254)
```

Two tenants cannot have a person (or auth account) with the same email address. In a multi-tenant SaaS, different tenants should own their own namespace.

**Fix:** Replace `@unique` with `@@unique([tenantId, email])` on both models.

---

## 2. RBAC & Security Issues

### 2.1 `PersonPermission` lacks tenant scope (lines 522–532)

```prisma
model PersonPermission {
  id           Int @id @default(autoincrement())
  personId     Int
  permissionId Int
  person     Person     @relation(fields: [personId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])
  @@unique([personId, permissionId])
}
```

- No `tenantId` field or relation.
- No `@@unique([tenantId, personId, permissionId])`.
- Direct permissions can be assigned across tenant boundaries.

### 2.2 No audit/log table

No model records who created/updated/deleted what on sensitive entities (e.g., Person, Property, Role). Essential for compliance (SOC2, GDPR) and incident investigation in a multi-tenant system.

**Recommendation:** Add an `AuditLog` model with `tenantId`, `actorPersonId`, `action`, `entityType`, `entityId`, `oldValues`, `newValues`, `ipAddress`, `timestamp`.

### 2.3 AuthAccount lacks modern security fields

```prisma
model AuthAccount {
  passwordHash        String?
  emailVerified       Boolean
  failedLoginAttempts Int
  lockedUntil         DateTime?
  lastLoginAt         DateTime?
  passwordChangedAt   DateTime?
  isActive            Boolean
}
```

Missing:
- `mfaSecret` / `mfaEnabled` — no MFA support
- `refreshToken` / `refreshTokenExpires` — no refresh token rotation
- `passwordResetToken` / `passwordResetExpires` — no self-service reset tracking
- `oauthProvider` / `oauthId` — no SSO/OAuth support

---

## 3. Schema Conflicts & Inconsistencies

### 3.1 Misnamed fields

| Model | Field | References | Should be |
|---|---|---|---|
| `Agency` (381) | `managerAssociateId` | `Person` (385) | `managerPersonId` |
| `Office` (561) | `managerAssociateId` | `Person` (565) | `managerPersonId` |

The field name implies it stores an `Associate.id`, but the relation points to `Person`.

### 3.2 `Address` — Agency dual relation conflict

```prisma
// Agency — line 369-370 (primary, unique)
addressId Int?   @unique
address    Address? @relation("AgencyAddress", ...)

// Agency — line 392 (secondary, has-many)
addresses  Address[] @relation("AgencyAddresses")

// Address — line 245-246
agency   Agency?  @relation("AgencyAddress")
agencies Agency[] @relation("AgencyAddresses")
```

An `Address` can simultaneously be the **primary** unique address AND one of many **secondary** addresses for the same agency. This is ambiguous and a data integrity risk.

**Fix:** Choose one pattern — either a single primary address (`@unique`) or a has-many relationship, not both.

### 3.3 Property address duplication

Property stores address **inline**:
```prisma
streetAddress   String?
addressLocality String?
addressRegion   String?
postalCode      String?
addressCountry  String?
```

AND optionally via a relational `Address`:
```prisma
addressId Int?
address    Address? @relation("PropertyAddress", ...)
```

Two sources of truth for the same data — they can diverge.

**Recommendation:** Remove the inline address fields from Property and rely solely on the `Address` relation, or vice versa.

### 3.4 Missing `onDelete: Cascade`

| Relation | Behavior | Problem |
|---|---|---|
| `PropertyImage.property` | `Restrict` | Can't delete property without manually removing images |
| `PropertyImage.image` | `Restrict` | Can't delete image without removing joins |
| `PropertyVideo.property` | `Restrict` | Same issue |
| `PropertyVideo.video` | `Restrict` | Same issue |
| `Tenant → *` (most children) | Not specified | Deleting a tenant fails if related records exist |
| `PersonRole.role` | Not specified | Deleting a role leaves orphaned mappings |
| `PersonRole.person` | Not specified | Same |

### 3.5 `updatedAt` uses `@default(now())` instead of `@updatedAt`

Prisma's `@updatedAt` automatically sets the field on every update. Using `@default(now())` means the field is only set on creation:

| Model | Line | Current | Should be |
|---|---|---|---|
| `Property.updatedAt` | 709 | `@default(now())` | `@updatedAt` |
| `Office.updatedAt` | 573 | `@default(now())` | `@updatedAt` |
| `Image.updatedAt` | 601 | `@default(now())` | `@updatedAt` |
| `Video.updatedAt` | 642 | `@default(now())` | `@updatedAt` |

### 3.6 Missing timestamps

- `DisqualificationReason` — no `createdAt` / `updatedAt` at all
- `PropertyImage` — no `createdAt`
- `PropertyVideo` — no `createdAt`

---

## 4. Other Observations

### 4.1 Correct patterns

- All lookup tables (PersonType, PropertyType, PropertyStatus, etc.) consistently use `@@unique([tenantId, code])` — **good**.
- `Permission` is intentionally system-wide (no tenantId) — **correct** for a SaaS where permissions are defined once.
- `Country` / `State` / `City` are not tenant-scoped — **correct** as shared reference data.
- Most core entities (Person, Property, Agency, Office, Associate, BlogPost, etc.) have `tenantId` + `@@index([tenantId])` — **good**.
- Slugs consistently use `@@unique([tenantId, slug])` — **good**.

### 4.2 Missing soft-delete

No model has `deletedAt` or `isDeleted`. For a multi-tenant SaaS, soft-delete enables:
- Data recovery after accidental deletion
- Audit trails
- Tenant data retention policies

### 4.3 Index opportunities

- `PersonRole` — missing index on `roleId` alone (finding all persons with a role requires a scan)
- `Person` — missing index on `email` alone (tenant-scoped lookups by email)
- `NewsletterContent` — missing index on `referenceId` (lookups by referenced entity)

### 4.4 Data type notes

- `AuthAccount.passwordHash`: `VarChar(255)` — fine for bcrypt (60 chars), tight for Argon2
- `Person.notes`: `@db.Text` (unbounded) — consider a max length

---

## 5. Priority Action Items

| Priority | Item |
|---|---|
| 🔴 HIGH | Add `tenantId` to `Image`, `Video`, `PropertyVideo`, `PersonPermission` |
| 🔴 HIGH | Change `Person.email` and `AuthAccount.email` from `@unique` to `@@unique([tenantId, email])` |
| 🔴 HIGH | Rename `managerAssociateId` → `managerPersonId` on `Agency` and `Office` |
| 🔴 HIGH | Fix `updatedAt` from `@default(now())` to `@updatedAt` on Property, Office, Image, Video |
| 🟡 MEDIUM | Resolve Agency-Address dual relation (pick one pattern) |
| 🟡 MEDIUM | Add `onDelete: Cascade` to Tenant relations and join tables |
| 🟡 MEDIUM | Add `AuditLog` model |
| 🟡 MEDIUM | Remove duplicate Property address fields or consolidate with Address relation |
| 🟢 LOW | Add soft-delete columns to core entities |
| 🟢 LOW | Add security fields to AuthAccount (MFA, refresh token, password reset) |
| 🟢 LOW | Add missing indexes and timestamps |
