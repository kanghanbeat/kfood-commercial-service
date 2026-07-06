# Production Public Auth Audit

Date: 2026-07-06
Branch audited: `main`
Production target: `https://kfood-commercial-service-web.vercel.app`

## Trigger

Production public auth still appears unstable in the real browser flow:

- A user can create an account and reach `/mypage`.
- Saving `Display name`, `Bio`, or `Preferred language` redirects back to login.
- Moving between `/mypage` and `/feed` appears to lose the signed-in state.
- Writing a record appears to require login again.

Earlier curl smoke tests passed, so this audit treats command-line success as
insufficient. The next check must distinguish real server session loss from a
stale or misleading browser UI state.

## Files Reviewed

Auth/session core:

- `web/lib/public-auth.ts`
- `web/proxy.ts`

Public auth routes:

- `web/app/auth/login/email/route.ts`
- `web/app/auth/join/email/route.ts`
- `web/app/auth/callback/route.ts`
- `web/app/auth/logout/route.ts`

Protected/member surfaces:

- `web/app/mypage/page.tsx`
- `web/app/mypage/update/route.ts`
- `web/app/feed/page.tsx`
- `web/app/feed/new/page.tsx`
- `web/app/feed/new/submit/route.ts`
- `web/app/feed/[postId]/page.tsx`

UI auth indicator:

- `web/components/header-auth-link.tsx`
- `web/app/layout.tsx`

Data/RLS-dependent calls:

- `packages/data/src/index.ts`
- `supabase/migrations/006_profiles_public_user_insert.sql`
- `supabase/migrations/007_mypage_profile_and_ugc_foundation.sql`

## Current Auth Shape

The public member auth flow is custom cookie-based auth on top of Supabase:

1. Email login/join uses Supabase Auth.
2. The app writes three cookies:
   - `kfood_public_access_token`
   - `kfood_public_refresh_token`
   - `kfood_public_signed_in`
3. Server pages call `getPublicSession()`.
4. Protected pages call `requirePublicSession()`.
5. Profile/post mutations also call `getPublicSession()` before writing.

The app does not rely on Supabase browser localStorage for session persistence.
That means the production issue is most likely in cookie/session propagation,
not in a normal client-side Supabase session object.

## Confirmed

- `main` and `origin/main` point to the same commit during this audit.
- The most recent production auth hotfix is present:
  - `web/proxy.ts` avoids refresh on undecodable token expiry.
  - JWT base64url payload decoding is padded before `atob()`.
- Login and join routes set public auth cookies on a redirect response.
- `/mypage/update` and `/feed/new/submit` both redirect to login only when
  `getPublicSession()` returns `null`.
- `/feed` is not a login-required page, but it still calls `getPublicSession()`
  to decide whether the write button should go to `/feed/new` or login.
- The header `Mypage` / `Log in` label is driven only by the readable
  `kfood_public_signed_in` hint cookie, not by a verified server session.

## Risk Findings

### P0: Real Browser Session State Is Not Observable Enough

The current app has no safe diagnostic surface that says:

- whether the browser sent the public auth cookies,
- whether the server sees the cookies,
- whether Supabase accepts the access token,
- whether refresh would be attempted,
- whether profile write fails because of auth or DB/RLS.

Because of that, command-line smoke tests can pass while the real browser still
fails. This is the main reason the issue has repeated.

### P1: `getPublicSession()` Can Clear Cookies On Refresh Failure

`getPublicSession()` tries access-token validation first. If that fails and a
refresh token exists, it tries refresh. If refresh fails, it clears public auth
cookies.

This can be correct for a truly expired or revoked session, but it is risky
during diagnosis because any browser-specific token/cookie mismatch becomes a
full logout. This matches the reported symptom.

### P1: Header Auth Indicator Can Be Misleading

`HeaderAuthLink` checks only `kfood_public_signed_in=1` from
`document.cookie`. It does not verify the server session.

Possible outcomes:

- Header says `Mypage` while server session is invalid.
- Header says `Log in` while a recent server redirect/cookie write has not
  refreshed the client-side snapshot yet.

This does not explain every redirect, but it can make the problem feel more
random than it is.

### P1: Database Migration State Must Be Reconfirmed

The profile and UGC flows require migration `007` to be fully applied. Required
objects:

- `profiles.bio`
- `profiles.preferred_language`
- `public.update_my_profile(...)`
- `public.user_posts`
- `public.user_post_comments`
- profile insert/update policies

If these are missing, profile/post writes will fail. That should normally show a
profile/update error, not a login redirect, but it must still be verified before
calling the feature stable.

### P2: Production Browser Flow Was Not Covered By A Manual Diagnostic Checklist

Current validation relied too much on:

- local build,
- curl redirects,
- Vercel deployment status.

The next validation needs a browser checklist that captures cookie presence and
server session result after each step.

## Recommended Next Step

Add a temporary safe diagnostic page:

`/auth/session-check`

It should show only booleans and masked identity:

- signed-in hint cookie present: yes/no
- access token cookie present: yes/no
- refresh token cookie present: yes/no
- server session valid: yes/no
- masked email, if valid
- provider, if valid
- user id suffix only, if valid
- current host

It must not show token values.

This page should be removed or hidden after the auth issue is fixed.

## Hanbit Check Items After Diagnostic Page

Use the production domain only:

`https://kfood-commercial-service-web.vercel.app`

1. Open `/auth/session-check` before login.
2. Create account or log in.
3. Open `/auth/session-check` immediately after login.
4. Open `/mypage`.
5. Save profile.
6. Open `/auth/session-check` again.
7. Open `/feed`.
8. Open `/auth/session-check` again.
9. Open `/feed/new`.
10. Open `/auth/session-check` again if redirected to login.

The result will identify whether the issue is:

- cookie not stored,
- cookie not sent on form POST,
- server cannot validate the access token,
- refresh token failure clears the session,
- DB/RLS failure masquerading as auth failure,
- stale header UI only.

## Do Not Merge PR #1 Yet

PR `#1` / branch `feature/design-tokens-v2` includes useful design and handoff
work, but it also touches auth-sensitive areas. It should wait until production
public auth is diagnosed and stable.
