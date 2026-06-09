# Service Architecture Reset

Status: Accepted direction  
Date: 2026-06-08  
Decision: Split public web and mobile; build MVP with Next.js public web + admin

## Context

The real K-food service MVP is a web-first discovery service:

```text
Home -> Regions -> Foods -> Places -> Routes -> Search -> Report/Contact
```

The MVP depends on:

- crawlable SEO pages
- clean slugs
- page-level metadata
- sitemap and robots
- Open Graph sharing
- Supabase-backed content
- admin-managed editorial data
- mobile-friendly web UX
- later monetization via ads, affiliate links, sponsored placements, and premium
  guides

The current Expo/React Native project is a practice/prototype app. It contains
useful references, but it should not dictate the production architecture.

## Architecture Options

| Option | Summary | Pros | Cons | Decision |
|---|---|---|---|---|
| A: Keep Expo Web | Harden current Expo Router app for static web export | fastest reuse, keeps mobile path close | SEO/content architecture is less natural; dynamic content/static params require more care; current app is prototype-shaped | Rejected for MVP core |
| B: Single Next.js rebuild only | Replace current app with one web app | clean web-first implementation | loses mobile reference structure unless preserved elsewhere | Rejected as too destructive |
| C: Split web/mobile/supabase/packages | Build Next.js web first, keep Expo mobile for later, share types/data/config | best strategic fit for SEO, admin, public web, later mobile | more structure and migration work | Accepted |

## Accepted Repository Target

Target structure:

```text
kfood-commercial/
├── web/        # Next.js public web + admin
├── mobile/     # Expo app, later phase
├── supabase/   # migrations, seed, edge functions
└── packages/
    ├── types/
    ├── data/
    └── config/
```

## Boundary Decisions

### `web/`

Purpose:

- public SEO-first K-food discovery service
- admin CMS for editorial operations

Recommended stack:

- Next.js App Router
- TypeScript
- Supabase client/server helpers
- server-rendered or statically generated public pages
- metadata, sitemap, robots, Open Graph, structured data

Responsibilities:

- `/regions/[regionSlug]`
- `/foods/[foodSlug]`
- `/places/[placeSlug]`
- `/routes/[routeSlug]`
- `/search`
- `/report`
- `/admin/*`

### `mobile/`

Purpose:

- future native/mobile app after web traction

Initial state:

- current Expo prototype may be moved here or archived as reference
- no native app release work in MVP

Responsibilities later:

- saved lists
- mobile-first itinerary usage
- push notifications
- native camera/upload if the product later needs UGC or AI

### `supabase/`

Purpose:

- database migrations
- seed data
- RLS policies
- storage policies
- Edge Functions

Responsibilities:

- real content tables
- admin roles and RLS
- report issue records
- audit logs
- future OpenAI/AI functions only server-side

### `packages/types`

Purpose:

- shared TypeScript domain types

Examples:

- `Region`
- `Food`
- `Place`
- `RouteGuide`
- `TrustLabel`
- `SponsoredStatus`
- `ReportIssue`

### `packages/data`

Purpose:

- shared content mapping and query helpers
- Supabase row-to-domain mappers
- seed data helpers

### `packages/config`

Purpose:

- shared constants and environment schemas
- route constants
- SEO defaults
- trust label definitions

## Public Web Route Map

```text
/
/regions
/regions/[regionSlug]
/foods
/foods/[foodSlug]
/places/[placeSlug]
/routes
/routes/[routeSlug]
/search
/about
/contact
/report
/privacy
/terms
/content-policy
/maps-notice
```

## Admin Route Map

```text
/admin
/admin/regions
/admin/foods
/admin/places
/admin/routes
/admin/reports
```

Admin access must rely on Supabase Auth/RLS/server checks, not client-only route
guards.

## Migration Plan

### Phase 1: Freeze Prototype As Reference

- Keep current app code unchanged until the new structure is created.
- Preserve current dirty worktree changes.
- Treat current `frontend/app`, `components`, `services`, `types`, `docs`, and
  `supabase` as source material.

### Phase 2: Create Root Structure

Create:

```text
web/
mobile/
packages/types/
packages/data/
packages/config/
supabase/
```

Move or copy carefully:

- current `supabase/` -> root `supabase/`
- reusable domain types -> `packages/types`
- reusable constants/trust labels -> `packages/config`
- prototype app -> `mobile/` or `prototype-archive/` after review

### Phase 3: Bootstrap Next.js Web

- create `web/` Next.js TypeScript app
- add baseline routes
- add shared package imports
- add Supabase environment strategy
- add `typecheck`, `lint`, and `build` scripts

### Phase 4: Build Public MVP Vertically

Build one real vertical slice first:

```text
Region -> Food -> Place -> Route
```

Use Seoul alpha seed data.

### Phase 5: Add Admin CMS

- login
- content CRUD
- report issue inbox
- last verified update
- sponsored/affiliate label controls

### Phase 6: Launch Readiness

- sitemap
- robots
- metadata
- Open Graph
- analytics events
- error monitoring
- RLS/security review
- deployment checklist

## Reuse / Rewrite / Retire

### Reuse As Reference

- current route ideas
- legal/deployment docs
- Supabase draft migrations and RLS concepts
- existing domain type names
- map/explore UX concepts
- SEO head idea

### Rewrite

- public pages
- admin CMS
- data access layer
- search/filter
- place/food/route detail pages
- SEO metadata generation

### Retire Or Defer

- SNS feed as main surface
- upload/journal UGC
- ranking tab
- profile tab
- mock AI food vision UI
- marketplace/seller flows
- native app release work

## Verification Strategy

For architecture migration:

```bash
npm run typecheck
npm run lint
npm run build
```

For web app:

- verify route HTML contains page-specific title and description
- verify sitemap includes region/food/place/route pages
- verify robots and canonical URLs
- verify mobile viewport layout
- verify admin routes are protected

For Supabase:

- migration dry run
- RLS audit queries
- no service-role or OpenAI secrets in public client code

## Risks

| Risk | Control |
|---|---|
| repo restructuring breaks existing prototype | freeze first, move in small commits |
| Next.js migration takes longer than Expo reuse | build one vertical slice before full migration |
| duplicated types between web/mobile | use `packages/types` from the start |
| SEO implementation becomes an afterthought | make metadata/sitemap part of first vertical slice |
| admin security is weak | server-side checks and Supabase RLS required |
| founder overload | document each phase and avoid broad rewrites |

## Decision

Accepted:

```text
kfood-commercial/
├── web/        # Next.js public web + admin
├── mobile/     # Expo app, later phase
├── supabase/   # migrations, seed, edge functions
└── packages/
    ├── types/
    ├── data/
    └── config/
```

## Next Skill

Use `kfood-service-data-model` next.

The data model should define:

- region
- food
- place
- route/guide
- report issue
- admin audit log
- trust labels
- sponsored/affiliate fields
- RLS ownership and publication matrix
