# Local Supabase Verification Report

Status: Pass  
Date: 2026-06-09

## Runtime

```text
Docker Desktop: running
Supabase Studio: http://127.0.0.1:54323
Supabase API: http://127.0.0.1:54321
Postgres: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Commands

```bash
npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial
npx supabase db reset --local --workdir /Users/beat/Projects/kfood-commercial
npx supabase db lint --local --workdir /Users/beat/Projects/kfood-commercial
```

Results:

```text
Migration up: pass
DB reset with seed: pass
DB lint: pass, no schema errors found
```

## RLS Checks

Anonymous REST checks confirmed:

```text
regions:      only myeongdong published row visible
foods:        only tteokbokki published row visible
places:       only myeongdong-street-food-loop published row visible
route_guides: only myeongdong-first-night published row visible
```

Join table checks confirmed:

```text
region_foods: one published region-food join visible
place_foods: one published place-food join visible
route_guide_places: one published route-place join visible
```

Sensitive table checks:

```text
content_reports select as anon: []
admin_audit_logs select as anon: []
```

Anonymous report insert:

```text
POST /content_reports
Prefer: return=minimal
Result: 201 Created
```

Note:

```text
Prefer: return=representation is expected to fail for anon because returning
the inserted row requires SELECT access to content_reports, which anon should
not have.
```

## RLS Table Coverage

All public service tables have RLS enabled:

```text
admin_audit_logs
content_reports
foods
place_foods
places
profiles
region_foods
regions
route_guide_places
route_guides
```

## Remaining Work

- Run the same migration/RLS checks against a Supabase staging project.
- Connect public web env vars to staging.
- Implement `/report` insert using `Prefer: return=minimal`.
- Add spam/rate-limit controls before public launch.
