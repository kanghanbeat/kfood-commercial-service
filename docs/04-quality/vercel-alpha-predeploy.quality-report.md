# Vercel Alpha Deploy Quality Report

Status: PARTIAL  
Date: 2026-06-22

## Scope

- Verify current service build after separating crawling work.
- Confirm local quality gates pass before Vercel project connection.
- Document Vercel settings, env variables, and smoke tests.
- Record first Vercel alpha deployment result.

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

## Residual Risks

- Status remains `PARTIAL` until the deployed admin/report smoke tests are
  completed.
- `/report`, `/admin/login`, `/admin/reports`, `/admin/places`, and
  `/admin/audit-logs` must be verified on the deployed URL.
- If `NEXT_PUBLIC_SITE_URL` changes after adding a custom domain, Vercel env
  must be updated and redeployed.

## Next Gate

After Vercel deployment:

```text
[x] /
[ ] /foods
[ ] /places
[ ] /routes
[ ] /report
[ ] /admin/login
[ ] /admin/reports
[ ] /admin/places
[ ] /admin/audit-logs
[ ] /robots.txt
[ ] /sitemap.xml
```
