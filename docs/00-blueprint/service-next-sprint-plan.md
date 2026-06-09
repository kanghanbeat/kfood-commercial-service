# K-food Service Next Sprint Plan

Status: Draft v1  
Date: 2026-06-09  
Applies to: `/Users/beat/Projects/kfood-commercial`

## Current Baseline

The production-oriented root workspace is now the active service surface.

Completed baseline:

```text
kfood-commercial/
├── web/        # Next.js public web alpha slice
├── mobile/     # future Expo app placeholder
├── supabase/   # schema, RLS, seed, SQL checks
└── packages/
    ├── types/
    ├── data/
    └── config/
```

Working checks:

```text
npm install
npm run typecheck
npm run lint
npm run web:build
```

Known constraints:

- The root workspace is pushed to
  `https://github.com/kanghanbeat/kfood-commercial-service`.
- The legacy Expo prototype remains in `frontend/` as a separate nested Git
  repository and is ignored by the root repository.
- Supabase migrations are drafted but not applied because local Docker/Postgres
  is not available yet.
- Public web pages use structured placeholder data from `packages/data`.

## Product Direction

The next work should move the project from:

```text
static alpha prototype
```

to:

```text
deployable Seoul-first public web service with verified data flow
```

Do not add deferred prototype features yet:

- public login/profile
- SNS feed
- upload/create post
- gamification
- marketplace/seller tools
- AI food vision
- native mobile app

## Sprint Map

| Sprint | Outcome | Why it comes now |
|---|---|---|
| Sprint 1 | Repo/GitHub and Supabase verification path | locks the production baseline |
| Sprint 2 | Public web reads from Supabase | replaces placeholder data with real service data |
| Sprint 3 | SEO, report, contact, trust pages | prepares the public service for launch traffic |
| Sprint 4 | Admin MVP | enables non-code content operations |
| Sprint 5 | Alpha deploy readiness | turns the service into a public release candidate |

## Sprint 1: Repo And Supabase Verification

### Goal

Make the root workspace a stable production development base and prove the
Supabase migration path.

### Scope

Repository:

- confirm root Git repository strategy
- connect root repo to GitHub or document why it remains local
- keep `frontend/` as legacy reference, not part of root commits
- preserve the existing `frontend/app/(tabs)/index.tsx` local modification

Supabase:

- choose local Docker verification or staging Supabase verification
- apply migrations to a real Postgres/Supabase environment
- run RLS audit queries
- insert seed rows
- confirm public read behavior only exposes `published` content

Documentation:

- update `docs/03-implementation/repository-root-status.md`
- update `docs/04-quality/supabase-readiness-report.md`
- record exact commands and blockers

### Files Likely To Change

```text
README.md
docs/03-implementation/repository-root-status.md
docs/04-quality/supabase-readiness-report.md
supabase/config.toml
supabase/seed.sql
supabase/migrations/*.sql
```

### Exit Criteria

Sprint 1 is done when:

- root repo status is clean after commit
- GitHub remote strategy is decided and documented
- Supabase migrations are applied locally or in staging, or the blocker is
  concrete and reproducible
- RLS behavior is verified with at least one published and one draft row
- `npm run typecheck`, `npm run lint`, and `npm run web:build` still pass

### Non-goals

- no admin UI yet
- no mobile app work
- no monetization integration
- no public user auth
- no restaurant/partner dashboard

## Sprint 2: Supabase-backed Public Web

### Goal

Replace static placeholder reads with Supabase-backed read queries while keeping
the public UX already built in `web/`.

### Scope

- create public Supabase server client
- add typed query helpers in `packages/data`
- implement published-only fetches:
  - `getPublishedRegions`
  - `getPublishedRegion`
  - `getPublishedFoods`
  - `getPublishedFood`
  - `getPublishedPlaces`
  - `getPublishedPlace`
  - `getPublishedRoutes`
- keep static placeholder fallback only for local development if needed

### Exit Criteria

- public pages render from Supabase data
- draft/hidden content does not render
- build still works without exposing service-role secrets

## Sprint 3: Launch Trust Surface

### Goal

Make the public web trustworthy and crawlable enough for an alpha release.

### Scope

- sitemap
- robots
- metadata per detail page
- report form
- contact page
- editorial policy
- disclosures
- maps notice
- privacy/terms placeholders or updated copies
- place trust labels and last verified display

### Exit Criteria

- every public page has metadata
- report flow writes to `content_reports`
- sponsored/affiliate/editorial labels are visible where relevant

## Sprint 4: Admin MVP

### Goal

Allow founder/admin content operations without editing code.

### Scope

- admin login
- admin layout protection
- list/edit regions
- list/edit foods
- list/edit places
- publish/hide
- report review
- audit log inserts

### Exit Criteria

- a place correction can be made in under two minutes
- admin writes are RLS-protected
- public users cannot access admin pages

## Sprint 5: Alpha Deploy Readiness

### Goal

Prepare a Seoul-first alpha that can be deployed and shared publicly.

### Scope

- deploy target selection
- environment variables
- production build
- analytics
- error logging
- backup/rollback checklist
- content QA for Seoul alpha
- final release checklist

### Exit Criteria

- production deployment succeeds
- public routes are crawlable
- known risk list is documented
- no service-role secrets are exposed

## Immediate Next Task

Start Sprint 1 with this order:

1. Inspect root and frontend Git remotes.
2. Decide whether the GitHub production repo should be the existing
   `kanghanbeat/kfood-commercial` remote or a new root-only remote.
3. Verify Supabase runtime path:
   - local Docker Desktop, or
   - staging Supabase project.
4. Apply or dry-run migrations.
5. Update readiness docs and commit Sprint 1 setup.
