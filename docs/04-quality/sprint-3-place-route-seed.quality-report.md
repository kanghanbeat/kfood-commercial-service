# Sprint 3 Place and Route Seed Quality Report

Status: Passed  
Date: 2026-06-10

## Scope

Promote user-verified place candidates into alpha seed data.

Implemented in:

```text
supabase/seed.sql
web/app/routes/[routeSlug]/page.tsx
docs/00-research/sprint-3-place-candidate-seed.research.md
docs/03-implementation/sprint-3-kickoff.md
```

## Seed Result

Local and staging now contain:

```text
published foods: 30
published places: 30
place_foods: 33
published route_guides: 5
route_guide_places: 15
```

The extra non-public food row remains `draft` and is not included in public
pages.

## Verification

Commands passed:

```text
npx supabase db reset --local --workdir /Users/beat/Projects/kfood-commercial
npm run check
npm run web:build
```

Staging seed apply passed:

```text
npx supabase db query --linked --file supabase/seed.sql --workdir /Users/beat/Projects/kfood-commercial
```

Staging count query confirmed:

```text
foods published: 30
places published: 30
place_foods: 33
route_guides published: 5
route_guide_places: 15
```

Staging-backed Next.js build generated:

```text
113 static/dynamic pages
30 food detail paths
30 place detail paths
23 region detail paths
5 route detail paths
```

## Notes

- Place pages are alpha editorial candidates, not final restaurant listings.
- Several entries are intentionally area-level places to reduce closure risk.
- Exact map URLs and current operation details should be added in a later
  verification pass.
- Route detail rendering now respects route step order instead of global place
  display order.

## Remaining Work

- Add `google_maps_url` or `naver_maps_url` after map verification.
- Split broad route concepts into shorter route pages if the public UX feels
  too wide.
- Add deployed report rate limiting before broad public alpha.
- Move future content edits into Admin MVP when CRUD and audit logs are ready.
