# Operational MVP Sprint 3: Public Auth Foundation Design

Status: Proposed  
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

Choose Option C.

Do not implement public login buttons until Google and Kakao OAuth provider
setup is ready. Make Public Auth Foundation the next candidate sprint after:

1. deployed smoke test is documented,
2. teammate admin/editor access is verified,
3. analytics/error monitoring decision is made.

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
