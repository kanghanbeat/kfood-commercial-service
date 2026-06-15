# Sprints 2-5 Implementation Status

Status: Operational MVP hardening in progress  
Date: 2026-06-11

## Summary

The project now has implementation foundations for the full sprint sequence:

```text
Sprint 1: Repo/GitHub remote decision + Supabase verification
Sprint 2: Public web Supabase read layer
Sprint 3: SEO/report/contact/trust surface
Sprint 4: Admin MVP skeleton
Sprint 5: Alpha deploy readiness
```

Sprint 1 external blockers are resolved:

- GitHub authentication is valid.
- Root repo is pushed to `kanghanbeat/kfood-commercial-service`.
- Local Supabase verification passes.
- Staging Supabase REST/RLS verification passes.

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
- In development, missing or unavailable Supabase env vars can fall back to
  local placeholder data.
- Production fallback is disabled by default; local fallback requires
  development mode or `NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK=true`.
- Detail route `generateStaticParams` now follows the published helper output.
- `region_foods`, `place_foods`, and `route_guide_places` are read so detail
  pages retain region/food/place relationships from staging data.
- `/report` now submits into `content_reports` through a server action.
- Pre-Sprint 3 cleanup renamed public data types from `Alpha*` to `Public*`.
- `/report` now includes supported report type validation, URL validation,
  minimum message length, email length guard, and a honeypot field.
- `/report` now uses a hashed reporter fingerprint and Supabase RPC rate limit
  to allow five submissions per 10-minute window before blocking the sixth.

Important:

- Public read uses `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Service-role keys are not used in public pages.
- Real `published` enforcement is verified through local and staging RLS.
- Local `.env.local` and `web/.env.local` are ignored by Git and point the dev
  app to staging.
- The exposed DB password from the earlier setup flow has been rotated by the
  user.

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

- Privacy/terms are launch placeholders and need final legal copy before
  public production release.
- `/photo-sources` remains an internal review board. It is not linked in the
  public footer, is excluded from sitemap, and is marked noindex.

Sprint 3 user decision:

- Geography starts with the capital region: Seoul through Gyeonggi/Incheon.
- Food draft target is about 30 famous or locally associated foods.
- Codex creates the research draft; the user directly verifies reliability
  before publication.
- First draft document:
  `docs/00-research/sprint-3-capital-region-food-draft.research.md`
- User review of the 30-food draft is complete.
- Local seed expansion is complete:
  - 23 published regions
  - 30 published foods
  - 42 public region-food relationships
- Remote staging seed apply and REST/RLS verification are complete.
- Staging build now generates 80 routes from the expanded seed.
- Place/route seed expansion is complete:
  - 30 published places
  - 33 place-food relationships
  - 5 route guides
  - 15 route-place relationships
- Staging build now generates 114 routes from published Supabase data.
- Place pages show Google Maps, Naver Map, and business-hours warning copy.

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

- Admin login uses Supabase Auth email/password.
- Admin pages verify `profiles.role` server-side through `requireAdminSession()`.
- `/admin/reports` reads real `content_reports` rows through RLS.
- Report status updates write `content_reports` and insert `admin_audit_logs`.
- `/admin/places` supports focused place corrections for status, map URLs,
  business notes, trust/caution tags, verification date, and audit-log writes.
- Foods, regions, and routes edit mutations are not enabled yet.

## Sprint 5: Alpha Deploy Readiness

Implemented:

- `.env.example`
- sitemap/robots
- public policy placeholders
- admin route disallow in robots
- deploy readiness checklist
- Supabase Auth admin route protection
- report review workflow and audit-log writes
- `/photo-sources` public de-indexing
- `docs/05-release/alpha-deploy-readiness.md`

Still required before alpha deploy:

1. Connect deployed env vars.
2. Set `REPORT_RATE_LIMIT_SALT`.
3. Decide staging-vs-production Supabase project for alpha.
4. Connect Vercel project and domain.
5. Verify first Supabase Auth admin login in the deployed environment.
6. Add region/food/route edit mutations after Places workflow is validated.

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
