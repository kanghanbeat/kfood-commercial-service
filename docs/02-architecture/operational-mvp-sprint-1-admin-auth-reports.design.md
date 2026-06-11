# Operational MVP Sprint 1: Admin Auth + Reports Workflow

Status: Selected design  
Date: 2026-06-11

## Goal

Move from a temporary alpha admin gate to a Supabase Auth-backed operations
loop:

```text
admin signs in -> reviews reports -> updates report status -> audit log records change
```

## Options Considered

### Option A: Keep temporary password gate

- Fastest and already implemented.
- Does not identify the actor in `admin_audit_logs`.
- Not enough for operating a real service beyond private alpha.

### Option B: Supabase Auth for all admin operations

- Uses Supabase user sessions and `profiles.role`.
- Matches existing RLS policies.
- Gives every report update an actor id.
- Requires admin accounts to be created and assigned `admin` or `editor`.

### Option C: Hybrid transition

- Use Supabase Auth in admin pages and keep proxy as a lightweight redirect
  guard.
- Server-side admin pages still re-check `profiles.role`.
- Gives better UX while avoiding false security from middleware-only checks.

## Selected Architecture

Use Option C.

```text
web/proxy.ts
  -> redirects unauthenticated /admin/* requests to /admin/login

web/lib/admin-auth.ts
  -> reads Supabase auth cookies
  -> verifies current user through profiles.role
  -> exposes requireAdminSession()

packages/data
  -> create authenticated Supabase client using admin access token
  -> getAdminReports()
  -> updateAdminReportStatus()
  -> insert admin_audit_logs
```

## Data Contract

Admin users must exist in:

```text
auth.users
public.profiles
```

Required profile fields:

```text
id = auth.users.id
role in ('admin', 'editor')
is_active = true
```

Report updates:

```text
content_reports.status = pending | in_review | resolved | ignored
content_reports.admin_note = optional note
content_reports.resolved_by = actor id when resolved or ignored
content_reports.resolved_at = timestamp when resolved or ignored
admin_audit_logs records before_data and after_data
```

## Rollout Notes

- The temporary password gate is removed from the active admin path. Admin
  access now depends on Supabase Auth plus an active `admin` or `editor`
  profile.
- Deployment needs:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

- Before live admin use, create an admin account in Supabase Auth and insert a
  matching `profiles` row.

## Verification

- `npm run check`
- `npm run web:build`
- Confirm `/admin/reports` redirects without auth cookies.
- Confirm reports update only succeeds for `admin` or `editor` profiles.
