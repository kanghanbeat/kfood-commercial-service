# Sprint 3 Verified Seed Quality Report

Status: Local pass, staging pending  
Date: 2026-06-10

## Scope

The user completed review of the 30-food capital-region draft. The reviewed
items were added to `supabase/seed.sql` as local alpha seed content.

## Verification

Local Supabase reset:

```text
npx supabase db reset --local --workdir /Users/beat/Projects/kfood-commercial
Result: pass
```

Anonymous local REST checks:

```text
regions: 23 published rows
foods: 30 published rows
region_foods: 42 rows
places: 1 published row
route_guides: 1 published row
```

Next.js build against local Supabase seed:

```text
npm run web:build: pass
generated routes: 80
/foods/[foodSlug]: 30 paths
/regions/[regionSlug]: 23 paths
/places/[placeSlug]: 1 path
/routes/[routeSlug]: 1 path
```

Project checks:

```text
npm run check: pass
```

## Staging Status

Staging has not been updated with the expanded seed yet. The user reset the DB
password, so the user must run the remote push command locally:

```bash
cd /Users/beat/Projects/kfood-commercial
SUPABASE_DB_PASSWORD='YOUR_NEW_DB_PASSWORD' npx supabase db push --include-seed
```

After that, Codex should verify remote REST counts:

```text
regions: 23
foods: 30
region_foods: 42
places: 1
route_guides: 1
```

## Decision

```text
LOCAL READY / STAGING APPLY PENDING
```

## Residual Risk

- Food/region data is now locally seeded, but place-level details remain sparse.
- Remote staging still serves the previous smaller seed until the user runs
  `db push --include-seed`.
- The 30 foods are alpha seed content, not final production editorial copy.
