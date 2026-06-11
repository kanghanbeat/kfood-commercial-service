# Alpha Deploy Readiness

Status: Draft for alpha preparation  
Date: 2026-06-11

## Current Release Position

The public web can build against staging Supabase data and generate 114 routes.
The service is not ready for broad public launch until deployment environment
variables and admin auth are configured.

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
- `supabase/migrations/003_crawling_service_schema.sql` remains out of the
  current service release scope unless explicitly reintroduced.

## External Work Still Needed

- Create or connect the deployment project.
- Add environment variables in the deployment dashboard.
- Configure the production domain.
- Create at least one Supabase Auth admin account.
- Insert a matching `public.profiles` row with `role = 'admin'` and
  `is_active = true`.
- Decide whether alpha uses the current staging Supabase project or a separate
  production Supabase project.
