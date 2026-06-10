# Sprint 3 Verified Seed Quality Report

Status: Pass  
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

The user reported `db push` completion. The first REST check still showed the
previous small seed, so Codex executed the seed file directly against the linked
staging project:

```bash
npx supabase db query --linked --file supabase/seed.sql --workdir /Users/beat/Projects/kfood-commercial
```

Remote staging REST counts now match the local seed:

```text
regions: 23
foods: 30
region_foods: 42
places: 1
route_guides: 1
content_reports anon select: 0
admin_audit_logs anon select: 0
```

Next.js build against staging:

```text
npm run web:build: pass
generated routes: 80
```

## Decision

```text
READY FOR TRUST SURFACE / PLACE SEED WORK
```

## Residual Risk

- Food/region data is now locally seeded, but place-level details remain sparse.
- The 30 foods are alpha seed content, not final production editorial copy.
