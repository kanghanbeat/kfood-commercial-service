# Vercel Alpha Deploy Plan

Status: Prepared for manual Vercel connection  
Date: 2026-06-15

## Why This Step Comes Now

The service now has enough operational surface for an alpha deployment:

- Public web reads Supabase published data.
- Report submission and rate limiting are implemented.
- Admin auth uses Supabase Auth and `profiles.role`.
- Reports and places workflows write audit logs.
- Crawling work has been separated from the current service build.

The next risk is no longer local implementation. It is deployment drift:
missing environment variables, wrong monorepo build settings, or an admin route
that works locally but not on the deployed domain.

## Vercel Project Settings

Use the GitHub repository:

```text
kanghanbeat/kfood-commercial-service
```

Recommended Vercel settings for the current monorepo:

```text
Framework Preset: Next.js
Root Directory: repository root
Install Command: npm install
Build Command: npm run web:build
Output Directory: web/.next
Development Command: npm run web:dev
```

The repository root is recommended because `web` depends on local workspace
packages under `packages/*`.

## Environment Variables

Set these for Preview and Production unless intentionally testing only one
environment:

```text
NEXT_PUBLIC_SITE_URL=https://<vercel-or-custom-domain>
NEXT_PUBLIC_SUPABASE_URL=https://gpwxiakwlghjzvoxwpnw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon public key>
NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK=
REPORT_RATE_LIMIT_SALT=<long random server-only value>
```

Do not add these to Vercel:

```text
SUPABASE_DB_PASSWORD
SUPABASE_SERVICE_ROLE_KEY
```

## Pre-Deploy Local Gate

Run before connecting or redeploying:

```bash
npm run check
npm run web:build
```

Expected build route count at this point:

```text
27 app routes
No /admin/crawl-sources route
```

## Post-Deploy Smoke Test

After the first Vercel deployment:

1. Open `/`.
2. Open `/foods`, `/places`, and `/routes`.
3. Open one food detail page.
4. Open one place detail page and confirm Google/Naver map links render.
5. Submit a low-risk `/report` test.
6. Sign in at `/admin/login`.
7. Open `/admin/reports`.
8. Open `/admin/places`.
9. Save one low-risk place note.
10. Open `/admin/audit-logs` and confirm `place.update`.
11. Open `/robots.txt` and `/sitemap.xml`.

## Rollback Plan

- If public pages fail: revert the Vercel deployment to the previous successful
  deployment.
- If admin login fails: verify Supabase env vars, admin Auth user, and
  `profiles.role`.
- If report insert fails: verify `REPORT_RATE_LIMIT_SALT`, Supabase anon key,
  and RLS policies.
- If content looks stale: verify the deployment is using the intended Supabase
  project.

## References

- Vercel Deployments: https://vercel.com/docs/deployments
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Vercel Monorepos: https://vercel.com/docs/monorepos
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
