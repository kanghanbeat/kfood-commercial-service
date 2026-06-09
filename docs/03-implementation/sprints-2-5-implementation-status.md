# Sprints 2-5 Implementation Status

Status: Foundation implemented, external verification pending  
Date: 2026-06-09

## Summary

The project now has implementation foundations for the full sprint sequence:

```text
Sprint 1: Repo/GitHub remote decision + Supabase verification
Sprint 2: Public web Supabase read layer
Sprint 3: SEO/report/contact/trust surface
Sprint 4: Admin MVP skeleton
Sprint 5: Alpha deploy readiness
```

Sprint 1 still has external blockers:

- GitHub CLI auth token is invalid.
- Root repo has no remote.
- Docker is unavailable, so local Supabase cannot start.
- Migrations/RLS have not been applied to a real database.

## Sprint 2: Supabase Read Layer

Implemented:

- `packages/data` now has published-read helper functions:
  - `getPublishedRegions`
  - `getPublishedRegion`
  - `getPublishedFoods`
  - `getPublishedFood`
  - `getPublishedPlaces`
  - `getPublishedPlace`
  - `getPublishedRoutes`
  - `getPublishedRoute`
- Public pages now call these helpers.
- If Supabase env vars are missing, the helpers fall back to alpha data.

Important:

- Public read uses `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Service-role keys are not used in public pages.
- Real `published` enforcement still depends on Supabase RLS verification.

## Sprint 3: SEO, Report, Contact, Trust Surface

Implemented public routes:

```text
/sitemap.xml
/robots.txt
/report
/contact
/editorial-policy
/content-policy
/disclosures
/maps-notice
/privacy
/terms
/routes/[routeSlug]
```

Current limitation:

- `/report` is a workflow surface only. Actual insert into
  `content_reports` should be enabled after Supabase verification.
- Privacy/terms are launch placeholders and need final legal copy before
  public production release.

## Sprint 4: Admin MVP Skeleton

Implemented admin routes:

```text
/admin
/admin/login
/admin/regions
/admin/foods
/admin/places
/admin/routes
/admin/reports
/admin/audit-logs
```

Current limitation:

- Admin auth, server-side mutations, RLS-backed writes, and audit-log inserts
  are not enabled yet.
- The skeleton defines workflow shape only.

## Sprint 5: Alpha Deploy Readiness

Implemented:

- `.env.example`
- sitemap/robots
- public policy placeholders
- admin route disallow in robots
- deploy readiness checklist

Still required before alpha deploy:

1. Decide and push root GitHub remote.
2. Verify Supabase migrations in local Docker or staging.
3. Connect deployed env vars.
4. Replace placeholder content with verified Seoul alpha data.
5. Enable report insert or clearly keep report as contact-only.
6. Finalize privacy, terms, disclosures, and editorial policy.

## Verification Commands

Run:

```bash
npm run check
npm run web:build
```

Supabase after Docker/staging is ready:

```bash
npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial
npx supabase db lint --local --workdir /Users/beat/Projects/kfood-commercial
```
