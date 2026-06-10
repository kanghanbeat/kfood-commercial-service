# Sprint 2 Public Web Supabase Read Design

Status: Implemented  
Date: 2026-06-10

## Goal

Move the public web from alpha-only mock data toward the real service backend by
reading published content from the staging Supabase project with the anonymous
public key and RLS.

## Options Considered

### Option A: Minimal env-only switch

Keep the existing read helpers unchanged and only add env vars.

- Fastest implementation.
- Leaves detail routes and relationship fields tied to alpha data.
- Risk: pages appear connected but still miss region-food, place-food, and
  route-place relationships.

### Option B: Full backend client abstraction

Create a larger repository/data access layer with typed DB rows, explicit
query modules, and tests.

- Cleanest long-term separation.
- Higher upfront cost before the admin CMS exists.
- Risk: over-builds while the content model is still stabilizing.

### Option C: Pragmatic Supabase read layer

Keep the current `@kfood/data` public helper API, but make the helpers read
published staging rows and relationship join tables when env vars are present.
Keep alpha fallback when env vars or network are unavailable.

- Preserves current pages and build behavior.
- Uses anon Supabase access only; no service-role key in public code.
- Makes route generation, sitemap, lists, and detail pages follow published
  staging data.
- Selected.

## Selected Architecture

```text
web/app/*
  -> @kfood/data published helpers
    -> Supabase anon client
      -> RLS policies expose published rows only
```

The public read helpers now fetch:

- `regions`
- `foods`
- `places`
- `route_guides`
- `region_foods`
- `place_foods`
- `route_guide_places`

The `/report` page now submits into `content_reports` through a server action
using the same public anon client. Insert returns minimal data and anon users
still cannot read submitted reports.

## Security Notes

- Public pages use only `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` remains server-only and unused.
- RLS remains the source of truth for published-only public reads.
- Report insert is intentionally anonymous for alpha feedback, but abuse
  controls are still required before public launch.

## Rollback

If Supabase staging is unavailable, remove or omit env vars and the public web
falls back to alpha data.

## Test Plan

- `npm run check`
- `npm run web:build`
- Build with network access and staging env should generate only published
  staging detail pages.
- Local dev route checks should show staging seed data and exclude alpha-only
  entries.
- `/report` server action should redirect to `/report?submitted=1`.
