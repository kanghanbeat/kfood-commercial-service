# Real Backend Plan

Status: Implemented v1  
Date: 2026-06-08

## Scope

Prepare the backend foundation for the real K-food MVP:

- root workspace structure
- shared TypeScript packages
- Next.js web skeleton
- Supabase schema migrations
- RLS policy intent
- Seoul alpha seed placeholder

## Created Structure

```text
kfood-commercial/
├── package.json
├── web/
├── supabase/
└── packages/
    ├── types/
    ├── data/
    └── config/
```

The existing Expo prototype remains under:

```text
kfood-commercial/frontend/
```

It has not been moved because it has existing uncommitted changes and is still a
reference asset.

## Backend Files

```text
supabase/migrations/001_service_core_schema.sql
supabase/migrations/002_service_rls_policies.sql
supabase/sql/rls_audit_queries.sql
supabase/seed.sql
```

## Shared Packages

```text
packages/types
packages/config
packages/data
```

Purpose:

- keep domain types out of app-specific code
- share trust labels and alpha area constants
- make future mobile reuse possible

## Web Skeleton

```text
web/app/layout.tsx
web/app/page.tsx
web/next.config.mjs
web/package.json
web/tsconfig.json
```

This is now an installed and verified workspace skeleton.

## Install And Verification

Completed from `kfood-commercial/`:

```text
npm install
npm run typecheck
npm run lint
npm run web:build
```

Result:

```text
Pass
```

Notes:

- `web/package.json` lint was changed from `next lint` to `eslint .` because
  the installed Next.js 16 CLI no longer handles `next lint` as expected.
- `web/next.config.mjs` now sets `turbopack.root` to the service root to avoid
  workspace root mis-detection from parent lockfiles.
- `npm audit` currently reports two moderate findings through Next's PostCSS
  dependency. `npm audit fix --force` is not applied because npm proposes a
  breaking downgrade path.

## Risks

- The root `kfood-commercial/` directory is not currently the Git repository.
- The existing Git repository is `kfood-commercial/frontend`.
- New root files will need repository normalization before PR workflow.
- Supabase SQL has not been applied to a database because local Docker/Postgres
  is unavailable.
- RLS policies are designed from intent and still require database verification.

## Next Steps

1. Normalize Git to `kfood-commercial/` root in a dedicated checkpoint.
2. Dry-run Supabase migrations against local Docker or a staging project.
3. Add first real Seoul alpha seed data after source review.
4. Replace editorial placeholders with verified place records.
