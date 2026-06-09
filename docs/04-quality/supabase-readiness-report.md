# Supabase Readiness Report

Status: Local verification pass, staging pending  
Date: 2026-06-09

## Summary

The real-service Supabase schema and RLS policy files have been drafted and
verified against local Supabase. Local migrations, seed data, schema lint, and
public anonymous REST checks now pass. Staging/remote verification is still
pending.

Decision:

```text
LOCAL PASS
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
| Local Supabase start | Pass | Docker Desktop is running; local API and DB are available |
| Migration local apply | Pass | `npx supabase migration up --local` reports DB up to date |
| Local reset with seed | Pass | `npx supabase db reset --local` applies migrations and seed |
| DB lint | Pass | `npx supabase db lint --local` reports no schema errors |
| RLS audit query run | Pass | all public service tables have RLS enabled |
| Anonymous public read | Pass | anon REST returns only published region/food/place/route rows |
| Anonymous report insert | Pass | anon REST insert succeeds with `Prefer: return=minimal` |
| Reports/audit anon select | Pass | anon REST returns no reports/audit log rows |
| Migration dry run | Pass locally | staging/remote still pending |
| Seed data source review | Not done | verification seed only, not production content |

## Risks

- Anonymous `content_reports` insert needs anti-spam controls before public scale.
- Join-table public policies may need performance review.
- Admin audit logs currently depend on application code inserting records.
- Storage policies are not yet implemented.
- Sprint 1 seed data is for schema/RLS verification only and is not verified
  production content.
- REST report insert must use `Prefer: return=minimal`; anon users should not
  receive inserted report rows because there is no anon select policy.
- Staging verification is still required before production deploy.

## Required Follow-ups

1. Create storage bucket policies for `public-content-images` and
   `admin-working-assets`.
2. Link a staging Supabase project and run the same migration/RLS checks there.
3. Add report rate limiting or abuse controls before public launch.
4. Add application-level audit log writes for admin mutations.
