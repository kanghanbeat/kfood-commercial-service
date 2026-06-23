# Operational MVP Sprint 3: Public Auth Foundation Design

Status: Implemented foundation  
Date: 2026-06-23

## Context

The current alpha intentionally allows public browsing without login. That is
still correct for discovery, SEO, and first-user friction. However, the broader
service goal includes operations, trust, monetization, user history, saved
places, abuse controls, and later reviews or personalization. Those future
features need a basic public identity foundation.

This was not a release blocker for the first alpha, but it should not remain an
implicit blind spot.

## Current Auth State

- `/admin/login` exists and uses Supabase Auth email/password.
- Admin access requires an active `profiles` row with `role = 'admin'` or
  `role = 'editor'`.
- Public `/login` and `/signup` routes do not exist.
- Public users can browse and submit reports without an account.

## Options

### Option A: Keep Public Auth Deferred

Do not add public login yet. Complete admin teammate setup, analytics, error
monitoring, rollback docs, and content QA first.

Pros:

- Keeps alpha simple.
- Avoids shipping broken OAuth buttons before provider dashboards are ready.
- Preserves low-friction public discovery.

Cons:

- User identity foundation remains delayed.
- Report trust, saved places, and personalization cannot progress.

### Option B: Add UI Shell Before Provider Setup

Create `/auth/login`, `/auth/callback`, and `/profile` with disabled Google and
Kakao buttons until provider setup is complete.

Pros:

- Makes the product direction visible.
- Lets design and routing settle early.

Cons:

- Disabled auth can look unfinished.
- Adds surface area without real user value.

### Option C: Implement Public OAuth After Provider Setup

Prepare the architecture now, then implement once Google and Kakao provider
configuration is ready in Supabase.

Pros:

- Avoids fake or broken auth.
- Keeps the alpha stable while making the next sprint explicit.
- Lets privacy/terms copy, redirect URLs, and provider keys be handled together.

Cons:

- Requires owner dashboard work before implementation is complete.

## Recommendation

Choose Option C, with a staged implementation.

The code now includes the public auth route foundation and header auth UI.
Google and Kakao buttons are wired to Supabase OAuth, but the provider
dashboards still need to be configured before real sign-in succeeds in
production.

Do not treat public auth as fully launched until:

1. Supabase Google provider is enabled,
2. Supabase Kakao provider is enabled,
3. provider redirect URLs are registered,
4. `/auth/login -> /auth/callback -> /profile` is smoke-tested on Vercel.

## Proposed Scope

Routes:

```text
/auth/login
/auth/callback
/profile
```

Capabilities:

- Google OAuth login.
- Kakao OAuth login.
- logout.
- minimal profile page.
- nav shows `Sign in` or `Profile`.
- `profiles` row is created or upserted for public users with `role = 'user'`.
- login/profile pages are marked noindex.
- public auth hint uses a non-sensitive cookie so public pages can remain static.

Out of scope:

- reviews.
- ratings.
- public posting.
- saved places.
- personalization.
- user-generated photos.

## Dashboard Work Required

Supabase:

- Enable Google provider.
- Enable Kakao provider.
- Add redirect URL:

```text
https://kfood-commercial-service-web.vercel.app/auth/callback
```

Provider dashboards:

- Google OAuth client.
- Kakao login app.
- callback/redirect URL alignment.

Vercel:

- redeploy after env or provider changes if needed.

## Security Notes

- Public users must get `role = 'user'`, never `editor` or `admin`.
- Admin login should remain under `/admin/login`.
- Public auth must not expose service role keys.
- User deletion, privacy copy, and terms copy should be reviewed before broad
  launch.
- The visible header state must not rely on readable tokens. It uses only a
  non-sensitive signed-in hint cookie; access and refresh tokens remain
  httpOnly.

## Implemented Files

```text
web/app/auth/login/page.tsx
web/app/auth/callback/route.ts
web/app/auth/logout/route.ts
web/app/profile/page.tsx
web/components/header-auth-link.tsx
web/lib/public-auth.ts
supabase/migrations/006_profiles_public_user_insert.sql
```

## Required Migration

Run this before expecting profile row creation to work for new public users:

```bash
npx supabase db push
```
