# Operational MVP Sprint 3: Public Auth Foundation

Status: Implemented, provider setup required  
Date: 2026-06-23

## Implemented

- Added `/auth/login`.
- Added `/auth/callback`.
- Added `/auth/logout`.
- Added `/profile`.
- Added header `Sign in` / `Profile` auth UI.
- Added public auth cookies separate from admin auth cookies.
- Added a non-sensitive signed-in hint cookie for the header.
- Added profile self-insert RLS policy for public users with `role = 'user'`.
- Updated alpha privacy and terms copy for social sign-in.
- Excluded `/auth/` and `/profile` from robots.

## Provider Setup Still Required

Supabase Dashboard:

```text
Authentication
→ Sign In / Providers
→ Enable Google
→ Enable Kakao
```

Provider redirect URL:

```text
https://kfood-commercial-service-web.vercel.app/auth/callback
```

Local redirect URL:

```text
http://localhost:3000/auth/callback
```

## Required Supabase Migration

```bash
npx supabase db push
```

Migration:

```text
supabase/migrations/006_profiles_public_user_insert.sql
```

## Manual Verification

After provider setup and migration:

```text
1. Open /auth/login.
2. Continue with Google.
3. Confirm redirect returns to /profile.
4. Sign out.
5. Continue with Kakao.
6. Confirm redirect returns to /profile.
7. Confirm public user profile row has role=user.
8. Confirm /admin remains inaccessible without admin/editor role.
```

## Not Included

- saved places
- reviews
- ratings
- user-generated posts
- personal recommendations
- public account settings
- account deletion workflow

Those need separate product, privacy, and abuse-control work.
