# Alpha Deploy Readiness

Status: Alpha deployed, smoke tests in progress  
Date: 2026-06-22

## Current Release Position

The public web is deployed on Vercel and reads staging Supabase data.

```text
Alpha URL: https://kfood-commercial-service-web.vercel.app
Home data check: 23 regions, 30 foods, 30 place directions, 5 routes
Deployment source: main / bdcf67d
```

## Required Deployment Environment Variables

Set these in the deployment platform, such as Vercel:

```text
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
NEXT_PUBLIC_SUPABASE_URL=https://gpwxiakwlghjzvoxwpnw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon public key>
NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK=
REPORT_RATE_LIMIT_SALT=<long random server-only value>
```

Do not set these as public variables:

```text
SUPABASE_SERVICE_ROLE_KEY
REPORT_RATE_LIMIT_SALT
```

## Release Checks

- `npm run check` passes.
- `npm run web:build` passes against Supabase staging data.
- `/report` inserts valid reports and blocks excessive attempts.
- `/places/[placeSlug]` shows Google Maps, Naver Map, and live-hours warnings.
- `/photo-sources` remains a review board only; no actual food photos are
  published yet.
- `/photo-sources` is not linked in the footer, is excluded from the sitemap,
  and is marked noindex.
- `/admin/*` requires a Supabase Auth user with an active `admin` or `editor`
  profile.
- `/admin/places` supports focused place corrections and writes audit logs.
- `/admin/audit-logs` reads recent admin mutation logs.
- Crawling work is separated from the current service build under the local
  `_separated/crawling/` workspace and remains out of the release scope unless
  explicitly reintroduced.

## External Work Still Needed

- Complete deployed smoke tests for `/foods`, `/places`, `/routes`, `/report`,
  `/admin/login`, `/admin/reports`, `/admin/places`, and `/admin/audit-logs`.
- Verify the first Supabase Auth admin account can sign in to the deployed admin
  route.
- Decide whether to keep the generated Vercel URL for alpha or configure a
  custom domain later.
- Decide whether alpha uses the current staging Supabase project or a separate
  production Supabase project.
- Follow `docs/05-release/vercel-alpha-deploy-plan.md` for Vercel settings and
  smoke tests.
