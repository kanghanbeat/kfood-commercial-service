# Operational MVP Sprint 2: Places Edit Workflow

Status: In progress  
Date: 2026-06-15

## Implemented Scope

- Add admin place read model.
- Add focused place update mutation.
- Write `admin_audit_logs` for every successful place update.
- Replace `/admin/places` read-only checklist with editable correction forms.
- Connect `/admin/audit-logs` to actual audit log rows.

## Manual Admin Verification

After creating the first Supabase Auth admin account and matching
`profiles.role = 'admin'`, verify:

1. Sign in at `/admin/login`.
2. Open `/admin/places`.
3. Edit one low-risk field such as `business_info_note`.
4. Save.
5. Open `/admin/audit-logs`.
6. Confirm a `place.update` audit row exists.

## Deferred

- Relationship editing for `place_foods`.
- Route step editing.
- Image upload and storage policy.
- Bulk import/export.
- Rollback button from audit log snapshots.
