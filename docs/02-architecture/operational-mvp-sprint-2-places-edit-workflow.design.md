# Operational MVP Sprint 2: Places Edit Workflow

Status: Selected design  
Date: 2026-06-15

## Goal

Give an authenticated admin a small, safe workflow for correcting public place
information:

```text
admin signs in -> opens Places -> edits map/business/editorial fields -> update is saved -> audit log records before/after
```

This follows Sprint 1, where Supabase Auth and the reports workflow were added.

## Options Considered

### Option A: Keep places read-only

- Lowest risk.
- Still forces corrections through SQL or seed files.
- Not enough for a live service where map links, hours notes, and hidden status
  may need quick changes.

### Option B: Build a full CMS immediately

- Covers every field and relationship.
- Higher UI and validation complexity.
- Slower than needed before alpha deploy.

### Option C: Focused place correction workflow

- Edits only the fields most likely to change before launch:
  `status`, `editorial_note`, map URLs, business notes, trust/caution tags, and
  verification date.
- Uses existing RLS policies and `admin_audit_logs`.
- Leaves relationship editing and image management for later.

## Selected Architecture

Use Option C.

```text
web/app/admin/places/page.tsx
  -> requireAdminSession()
  -> getAdminPlaces(accessToken)
  -> updateAdminPlace(accessToken, input)

packages/data
  -> authenticated Supabase client with user JWT
  -> read all places for admin/editor
  -> update allowed place fields
  -> insert admin_audit_logs before/after snapshot
```

## Editable Fields

- `status`
- `editorial_note`
- `google_maps_url`
- `naver_maps_url`
- `business_hours_note`
- `business_info_note`
- `trust_tags`
- `caution_tags`
- `last_verified_at` through a "mark verified today" action

## Non-Goals

- Region reassignment.
- Food relationship editing.
- Route step editing.
- Image upload/storage.
- Sponsored/affiliate commercial workflow.

## Verification

- `npm run check`
- `npm run web:build`
- Confirm `/admin/places` redirects without auth.
- Confirm a real admin account can save a place edit.
- Confirm an `admin_audit_logs` row is created for the mutation.
