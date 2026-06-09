# Alpha Deploy Readiness Checklist

Status: Not ready, foundation present  
Date: 2026-06-09

## Build

- [x] Root workspace exists.
- [x] Next.js public routes build.
- [x] `npm run check` passes.
- [x] `npm run web:build` passes.
- [x] sitemap and robots routes exist.

## Repository

- [x] Root local Git commits exist.
- [ ] Root GitHub remote selected.
- [ ] Root `main` pushed.
- [ ] Legacy `frontend/` strategy finalized.

## Supabase

- [x] Schema migrations drafted.
- [x] RLS policies drafted.
- [x] Verification seed prepared.
- [x] RLS verification SQL prepared.
- [ ] Migrations applied to local or staging Supabase.
- [ ] RLS verified with published/draft rows.
- [ ] Anonymous report insert verified.

## Public Trust Surface

- [x] Contact page exists.
- [x] Report page exists.
- [x] Editorial policy exists.
- [x] Content policy exists.
- [x] Disclosures page exists.
- [x] Maps notice exists.
- [ ] Final privacy policy.
- [ ] Final terms.
- [ ] Verified Seoul alpha content.

## Admin

- [x] Admin route skeleton exists.
- [x] Admin modules mapped.
- [ ] Supabase Auth login.
- [ ] Admin route protection.
- [ ] CRUD mutations.
- [ ] Audit-log writes.

## Deploy

- [x] `.env.example` exists.
- [ ] Vercel project connected.
- [ ] Supabase project linked.
- [ ] Production env vars set.
- [ ] Analytics selected.
- [ ] Error monitoring selected.
- [ ] Rollback process documented.
