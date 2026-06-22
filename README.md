# K-food Commercial Service

K-food Commercial Service is a web-first K-food discovery platform for
travelers who need practical food choices, trusted editorial notes, and route
guides that work on the ground.

Current alpha URL:

```text
https://kfood-commercial-service-web.vercel.app
```

GitHub repository:

```text
https://github.com/kanghanbeat/kfood-commercial-service
```

## Current Status

- Vercel alpha deployment is live.
- Public web reads published data from Supabase.
- Current deployed home data check: 23 regions, 30 foods, 30 place directions,
  and 5 routes.
- Admin auth, report workflow, place edit workflow, and audit logs exist.
- Remaining alpha smoke tests are tracked in
  `docs/04-quality/vercel-alpha-predeploy.quality-report.md`.
- Crawling work is intentionally separated from the current service build.

## Workspace

```text
kfood-commercial/
├── web/        # Next.js public web and admin
├── mobile/     # Future Expo app location
├── supabase/   # migrations, seed, SQL checks
└── packages/
    ├── types/
    ├── data/
    └── config/
```

The legacy Expo prototype is not part of the active service workspace. It is
ignored by this root repository and may be used only as reference material.

```text
frontend/
```

## Quick Start

```bash
npm install
npm run web:dev
```

Open:

```text
http://localhost:3000
```

Useful commands:

```bash
npm run check
npm run typecheck
npm run lint
npm run web:build
```

## Environment

Copy `.env.example` to `.env.local` for local development and fill only the
values you need.

Never commit:

- `.env`
- `.env.local`
- Supabase service role keys
- database passwords
- personal access tokens

Public web uses these deployment variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK
REPORT_RATE_LIMIT_SALT
```

Production should keep `NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK` empty or false.

## Team Workflow

All team members should read these before editing:

- `CONTRIBUTING.md`
- `docs/06-team/team-onboarding.md`
- `docs/06-team/team-working-agreement.md`

Default workflow:

```text
main branch stays deployable
feature branch -> pull request -> review -> merge
```

Before opening a pull request:

```bash
npm run check
npm run web:build
```

If your change touches Supabase migrations, admin auth, reports, audit logs,
environment variables, or RLS policies, also document the manual verification
steps in the pull request.

## Do Not Mix With Crawling Work

The crawling experiment is separate from the current K-food service release.
Do not commit these paths unless the project owner explicitly re-enables the
crawling lane:

```text
packages/crawler/
supabase/migrations/003_crawling_service_schema.sql
```

## Main Documentation Map

- Product definition: `docs/00-blueprint/service-product-definition.md`
- MVP blueprint: `docs/00-blueprint/service-mvp-blueprint.md`
- Architecture reset: `docs/02-architecture/service-architecture-reset.md`
- Data model: `docs/02-architecture/service-data-model.md`
- Operational MVP Sprint 1:
  `docs/03-implementation/operational-mvp-sprint-1-admin-auth-reports.md`
- Operational MVP Sprint 2:
  `docs/03-implementation/operational-mvp-sprint-2-places-edit-workflow.md`
- Alpha deploy readiness: `docs/05-release/alpha-deploy-readiness.md`
