# Operational MVP Sprint 3 Public Auth Foundation Security Report

Status: Pass with provider setup follow-up  
Date: 2026-06-23

## Scope

Review the new public Google/Kakao OAuth foundation, profile page, password
setup page, header auth UI, cookies, and Supabase profile role policy.

## Findings

| Severity | Finding | Status |
| --- | --- | --- |
| Medium | OAuth providers must be configured before public login is considered launched. | Follow-up required |
| Low | Public profile lifecycle is minimal and does not yet include account deletion or settings. | Deferred |

No critical or high severity issue was found in the implemented foundation.

## Controls

- Public auth uses separate cookies from admin auth.
- Public access and refresh tokens are httpOnly.
- Header UI uses only a non-sensitive signed-in hint cookie.
- Public users can only insert their own profile with `role = 'user'`.
- Public auth next path rejects external URLs and `/admin` redirects.
- `/auth/login` and `/profile` are marked noindex.
- `/auth/update-password` is marked noindex and is intended only for secure
  invite/recovery tokens.
- Invite/recovery hash tokens are redirected client-side from `/` to
  `/auth/update-password` so emailed links do not strand teammates on the
  public homepage.
- Admin login remains separate under `/admin/login`.

## Required Follow-Up

- Apply `006_profiles_public_user_insert.sql`.
- Configure Google OAuth provider.
- Configure Kakao OAuth provider.
- Smoke test `/auth/login -> /auth/callback -> /profile` on Vercel.
- Smoke test teammate invite/recovery password setup on Vercel.
- Add account settings/deletion before broad public launch.
