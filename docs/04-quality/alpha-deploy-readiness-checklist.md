# Alpha Deploy Readiness Checklist

Status: Partially ready, operational hardening in progress  
Date: 2026-06-11

## Build

- [x] Root workspace exists.
- [x] Next.js public routes build.
- [x] `npm run check` passes.
- [x] `npm run web:build` passes against staging Supabase data.
- [x] sitemap and robots routes exist.

## Repository

- [x] Root local Git commits exist.
- [x] Root GitHub remote selected.
- [x] Root `main` pushed.
- [x] Legacy `frontend/` strategy finalized as reference-only prototype.

## Supabase

- [x] Schema migrations drafted.
- [x] RLS policies drafted.
- [x] Verification seed prepared.
- [x] RLS verification SQL prepared.
- [x] Migrations applied to local and/or staging Supabase.
- [x] RLS verified with published/draft rows.
- [x] Anonymous report insert verified.
- [x] Report rate limit verified through Supabase RPC.
- [x] Place map/business info applied to 30 published places.

## Public Trust Surface

- [x] Contact page exists.
- [x] Report page exists.
- [x] Editorial policy exists.
- [x] Content policy exists.
- [x] Disclosures page exists.
- [x] Maps notice exists.
- [x] Alpha privacy policy placeholder exists.
- [x] Alpha terms placeholder exists.
- [x] Verified capital-region alpha content seed exists.
- [x] `/photo-sources` is hidden from footer/sitemap and marked noindex.

## Admin

- [x] Admin route skeleton exists.
- [x] Admin modules mapped.
- [x] Supabase Auth login.
- [x] Admin route protection.
- [x] Reports read/update workflow.
- [x] Report audit-log writes.
- [x] Places edit mutations.
- [x] Place audit-log writes.
- [ ] CRUD mutations.

## Deploy

- [x] `.env.example` exists.
- [x] Alpha deploy readiness document exists.
- [x] Vercel alpha deploy plan exists.
- [x] Crawling work is separated from the current service build.
- [ ] Vercel project connected.
- [ ] Supabase project linked.
- [ ] Production env vars set.
- [x] First Supabase Auth admin account created.
- [ ] Analytics selected.
- [ ] Error monitoring selected.
- [ ] Rollback process documented.
