# Supabase Readiness Report

Status: Partial, CLI initialized  
Date: 2026-06-08

## Summary

The real-service Supabase schema and RLS policy files have been drafted. The
Supabase CLI was initialized, but migrations have not been applied to a live or
local Supabase database because local Docker/Postgres is not available.

Decision:

```text
PARTIAL
```

## Evidence Created

```text
supabase/migrations/001_service_core_schema.sql
supabase/migrations/002_service_rls_policies.sql
supabase/sql/rls_audit_queries.sql
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
| Migration local apply | Blocked | local Postgres on 127.0.0.1:54322 refused connection |
| Local Supabase start | Blocked | Docker daemon unavailable |
| Migration dry run | Blocked | requires local Docker/Postgres or linked staging project |
| RLS audit query run | Not run | requires live/local database |
| Seed data source review | Not done | placeholder only |

## Risks

- Anonymous `content_reports` insert needs anti-spam controls before public scale.
- Join-table public policies may need performance review.
- Admin audit logs currently depend on application code inserting records.
- Storage policies are not yet implemented.
- Existing prototype migrations should not be mixed with this new migration
  series without reset/migration planning.
- Local Supabase verification requires Docker Desktop or a linked staging
  Supabase project.

## Required Follow-ups

1. Create storage bucket policies for `public-content-images` and
   `admin-working-assets`.
2. Dry-run migrations in local Supabase after Docker Desktop is running, or in
   a staging Supabase project.
3. Run `supabase/sql/rls_audit_queries.sql`.
4. Add report rate limiting or abuse controls before public launch.
5. Add application-level audit log writes for admin mutations.
