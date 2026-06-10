# Sprint 3 Verified Seed Plan

Status: Local seed implemented, remote apply pending  
Date: 2026-06-10

## Decision

The user completed review of the 30-food capital-region draft. The reviewed
items are now treated as alpha seed candidates.

## Implemented Locally

`supabase/seed.sql` now includes:

```text
published regions: 23
published foods: 30
published region_foods links: 42
published places: 1
published route_guides: 1
```

Scope:

- Seoul
- Incheon
- Suwon
- Uijeongbu
- Anyang
- Icheon
- Pocheon
- Yangpyeong
- Gapyeong
- Namhansanseong
- Paju
- Ansan
- Yongin
- Gwangmyeong

## Local Verification

Local Supabase reset passed:

```bash
npx supabase db reset --local --workdir /Users/beat/Projects/kfood-commercial
```

Anonymous REST verification:

```text
regions: 23 published rows
foods: 30 published rows
region_foods: 42 public relationship rows
places: 1 published row
route_guides: 1 published row
```

Next.js build against local Supabase seed:

```text
npm run web:build: pass
generated routes: 80
/foods/[foodSlug]: 30 published food paths
/regions/[regionSlug]: 23 published region paths
/places/[placeSlug]: 1 published place path
/routes/[routeSlug]: 1 published route path
```

## Remote Staging Apply

Remote staging has not yet been updated with the expanded seed because the
database password was reset by the user and is not stored by Codex.

From the project root, the user should run:

```bash
cd /Users/beat/Projects/kfood-commercial
SUPABASE_DB_PASSWORD='YOUR_NEW_DB_PASSWORD' npx supabase db push --include-seed
```

Then Codex can re-run public REST verification against:

```text
https://gpwxiakwlghjzvoxwpnw.supabase.co
```

Expected staging result after apply:

```text
regions: 23
foods: 30
region_foods: 42
places: 1
route_guides: 1
```

## Important Limitation

Only food and region relationships have been expanded. Place-level detail is
still intentionally small until real place information is verified.

Next data work should focus on:

- verified place candidates
- map URLs
- last verified dates
- caution/trust tags
- route grouping
