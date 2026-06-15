# Vercel Alpha Predeploy Quality Report

Status: PARTIAL  
Date: 2026-06-15

## Scope

- Verify current service build after separating crawling work.
- Confirm local quality gates pass before Vercel project connection.
- Document Vercel settings, env variables, and smoke tests.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Crawling separation | Pass | Crawling files are under local `_separated/crawling/` and ignored by Git. |
| Typecheck/lint | Pass | `npm run check` passed. |
| Production build | Pass | `npm run web:build` passed. |
| Route surface | Pass | Build generated 27 app routes and no `/admin/crawl-sources` route. |
| Release docs | Pass | `docs/05-release/vercel-alpha-deploy-plan.md` added. |

## Residual Risks

- Status is `PARTIAL` because Vercel project connection and deployed smoke tests
  still require external dashboard work.
- The first deployed environment must receive the exact Supabase env vars and
  `REPORT_RATE_LIMIT_SALT`.
- Admin smoke tests must be repeated on the deployed URL, even though they pass
  locally.

## Next Gate

After Vercel deployment:

```text
/foods
/places
/routes
/report
/admin/login
/admin/reports
/admin/places
/admin/audit-logs
/robots.txt
/sitemap.xml
```
