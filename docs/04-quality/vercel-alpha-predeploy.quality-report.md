# Vercel Alpha Deploy Quality Report

Status: PASS WITH FOLLOW-UP  
Date: 2026-06-23

## Scope

- Verify current service build after separating crawling work.
- Confirm local quality gates pass before Vercel project connection.
- Document Vercel settings, env variables, and smoke tests.
- Record first Vercel alpha deployment result.
- Record deployed route smoke test results.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Crawling separation | Pass | Crawling files are under local `_separated/crawling/` and ignored by Git. |
| Typecheck/lint | Pass | `npm run check` passed. |
| Production build | Pass | `npm run web:build` passed. |
| Route surface | Pass | Build generated 27 app routes and no `/admin/crawl-sources` route. |
| Release docs | Pass | `docs/05-release/vercel-alpha-deploy-plan.md` added. |
| Vercel deployment | Pass | `https://kfood-commercial-service-web.vercel.app` deployed from `bdcf67d`. |
| Supabase read | Pass | Deployed home page shows 23 regions, 30 foods, 30 place directions, and 5 routes. |
| Public routes | Pass | `/`, `/foods`, `/places`, `/routes`, `/report`, and `/contact` returned 200. |
| Detail routes | Pass | Representative region and food detail routes returned 200. |
| Admin route protection | Pass | `/admin/login` returned 200; unauthenticated `/admin/reports` redirected to `/admin/login?next=%2Fadmin%2Freports`. |
| SEO routes | Pass | `/robots.txt` and `/sitemap.xml` returned 200. Robots disallows `/admin/` and `/photo-sources`. |

## Residual Risks

- Authenticated admin mutation smoke tests still require a real admin/editor
  user to sign in on the deployed URL.
- `/admin/places` save and `/admin/audit-logs` write verification should be
  repeated after adding the next teammate's admin/editor profile.
- Public user login and signup are intentionally not implemented in the current
  alpha, but should be considered as a near-term foundation before saved
  places, reviews, personalization, or user-specific report history.
- If `NEXT_PUBLIC_SITE_URL` changes after adding a custom domain, Vercel env
  must be updated and redeployed.

## Deployed Smoke Test

Checked on 2026-06-23:

```text
[x] /
[x] /foods
[x] /places
[x] /routes
[x] /report
[x] /contact
[x] /regions/seoul
[x] /foods/myeongdong-kalguksu
[x] /admin/login
[x] /admin/reports redirects when unauthenticated
[ ] /admin/places authenticated save
[ ] /admin/audit-logs authenticated audit write
[x] /robots.txt
[x] /sitemap.xml
```

The remaining unchecked admin items require a real admin/editor login and should
be completed by the project owner or an approved teammate.
