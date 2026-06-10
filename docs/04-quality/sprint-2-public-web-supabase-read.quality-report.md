# Sprint 2 Public Web Supabase Read Quality Report

Status: Pass  
Date: 2026-06-10

## Scope

Sprint 2 connects the public web to staging Supabase reads and enables the
public report insert workflow.

## Verification

```text
npm run check: pass
npm run web:build: pass
```

Build with staging network access:

```text
Generated static pages: 29
/regions/[regionSlug]: /regions/myeongdong
/foods/[foodSlug]: /foods/tteokbokki
/places/[placeSlug]: /places/myeongdong-street-food-loop
/routes/[routeSlug]: /routes/myeongdong-first-night
/report: dynamic server-rendered route
```

Local route checks:

```text
/regions: Myeongdong visible, Hongdae hidden
/foods: Tteokbokki visible
/places: Myeongdong Street Food Loop visible
/routes: Myeongdong First Night visible
```

Report checks:

```text
Direct anon content_reports insert: pass
Anon content_reports select after insert: []
Rendered /report form includes Next server action hidden input
Multipart POST to /report: 303 -> /report?submitted=1
Success message rendered after submit
```

Pre-Sprint 3 cleanup checks:

```text
Alpha* public type names removed from app/data code
Production fallback disabled by default
Report allowlist, URL validation, message guards, and honeypot added
Server action too-short message: 303 -> /report?error=...
Server action honeypot filled: 303 -> /report?submitted=1
Server action valid report: 303 -> /report?submitted=1
Supabase DB password rotated by user
```

## Gate Result

```text
READY FOR SPRINT 3 / ADMIN MVP PREP
```

## Residual Risks

- Report spam/rate-limit controls are not implemented yet.
- Honeypot and validation are implemented, but deployed rate limiting is not.
- Staging seed data is verification content, not final production content.
- Deployed Vercel env vars are not configured yet.
- Legal/privacy copy remains placeholder-level.
