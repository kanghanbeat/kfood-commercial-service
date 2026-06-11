# Operational MVP Sprint 1: Admin Auth + Reports Workflow

Status: Implemented foundation  
Date: 2026-06-11

## Implemented

- Admin login now uses Supabase Auth email/password.
- Admin access requires a matching active profile:

```text
profiles.role in ('admin', 'editor')
profiles.is_active = true
```

- `/admin/*` uses a proxy redirect guard for unauthenticated visitors.
- Admin server pages call `requireAdminSession()` and verify the Supabase
  profile role server-side.
- `/admin/reports` reads real `content_reports` rows through RLS.
- Admins can update report status and admin note.
- Report updates insert `admin_audit_logs` rows with before/after snapshots.

## Required User Setup

Create the first admin account in Supabase Dashboard:

1. Open Supabase Dashboard.
2. Go to Authentication -> Users.
3. Create or invite the admin email.
4. Copy the user's UUID.
5. Insert or update the profile row:

```sql
insert into public.profiles (id, display_name, role, is_active)
values ('<auth-user-uuid>', 'Admin', 'admin', true)
on conflict (id) do update
set
  role = 'admin',
  is_active = true,
  updated_at = now();
```

## Report Status Workflow

```text
pending -> in_review -> resolved
pending -> ignored
```

Use `admin_note` to record what was checked. `resolved` and `ignored` set
`resolved_by` and `resolved_at`.

## Still Deferred

- Places edit mutations.
- Food/region/route mutations.
- Rich admin filters and pagination.
- Full Supabase Auth callback flow for social/OTP providers.
