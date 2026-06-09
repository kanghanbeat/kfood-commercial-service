# Supabase Readiness Report

Status: Partial, Sprint 1 verification prepared  
Date: 2026-06-09

## Summary

The real-service Supabase schema and RLS policy files have been drafted. The
Supabase CLI is available through `npx`, and Sprint 1 verification seed/RLS SQL
has been prepared. Migrations have not been applied to a live or local Supabase
database because Docker/local Postgres is not available in the current machine
state.

Decision:

```text
PARTIAL
```

## Evidence Created

```text
supabase/migrations/001_service_core_schema.sql
supabase/migrations/002_service_rls_policies.sql
supabase/sql/rls_audit_queries.sql
supabase/sql/sprint_1_rls_verification.sql
supabase/seed.sql
supabase/config.toml
```

## Readiness Checklist

| Check | Status | Notes |
|---|---|---|
| Core tables drafted | Pass | regions, foods, places, route_guides, reports, audit logs |
| Join tables drafted | Pass | region_foods, place_foods, route_guide_places |
| Publication model drafted | Pass | draft, published, hidden, archived |
| Report lifecycle drafted | Pass | pending, in_review, resolved, ignored |
| Admin/editor RLS intent drafted | Pass | helper functions and policies present |
| Public read limited to published | Pass by design | requires DB verification |
| Anonymous report insert | Pass by design | requires spam/rate-limit follow-up |
| Storage bucket policy | Not done | bucket creation/policies still needed |
| Supabase CLI init | Pass | `npx supabase init --workdir /Users/beat/Projects/kfood-commercial` |
| Supabase CLI executable | Pass | `npx supabase --version` returns `2.105.0` |
| Sprint 1 seed coverage | Pass by design | includes published and draft rows plus linked place/food/route data |
| Sprint 1 RLS verification SQL | Pass by design | `supabase/sql/sprint_1_rls_verification.sql` added |
| Migration local apply | Blocked | local Postgres on 127.0.0.1:54322 refused connection |
| Local Supabase start | Blocked | Docker CLI is not available; Supabase status also cannot reach Docker daemon |
| Migration dry run | Blocked | requires local Docker/Postgres or linked staging project |
| RLS audit query run | Not run | requires live/local database |
| Seed data source review | Not done | verification seed only, not production content |

## Risks

- Anonymous `content_reports` insert needs anti-spam controls before public scale.
- Join-table public policies may need performance review.
- Admin audit logs currently depend on application code inserting records.
- Storage policies are not yet implemented.
- Existing prototype migrations should not be mixed with this new migration
  series without reset/migration planning.
- Local Supabase verification requires Docker Desktop or a linked staging
  Supabase project.
- Sprint 1 seed data is for schema/RLS verification only and is not verified
  production content.

## Required Follow-ups

1. Create storage bucket policies for `public-content-images` and
   `admin-working-assets`.
2. Install/start Docker Desktop, or link a staging Supabase project.
3. Run `npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial`.
4. Run `supabase/sql/rls_audit_queries.sql`.
5. Run `supabase/sql/sprint_1_rls_verification.sql`.
6. Add report rate limiting or abuse controls before public launch.
7. Add application-level audit log writes for admin mutations.
