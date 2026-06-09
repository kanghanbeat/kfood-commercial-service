# Staging Supabase Verification Report

Status: Pass  
Date: 2026-06-10

## Project

```text
Project ref: gpwxiakwlghjzvoxwpnw
Project URL: https://gpwxiakwlghjzvoxwpnw.supabase.co
Purpose: kfood-commercial staging verification
```

## Applied State

The user completed Supabase CLI login, project link, and remote database push:

```bash
npx supabase login
npx supabase link --project-ref gpwxiakwlghjzvoxwpnw
SUPABASE_DB_PASSWORD=... npx supabase db push --include-seed
```

Codex did not store or reuse the database password. Verification below uses
the public anonymous API path so it tests the same access surface the public
web will use.

## Anonymous REST Read Checks

Remote anonymous reads returned only published rows:

```text
regions:      myeongdong / published
foods:        tteokbokki / published
places:       myeongdong-street-food-loop / published
route_guides: myeongdong-first-night / published
```

Join table checks returned only joins whose related public content is
published:

```text
region_foods: one published region-food join
place_foods: one published place-food join
route_guide_places: one published route-place join
```

Sensitive table checks:

```text
content_reports select as anon: []
admin_audit_logs select as anon: []
```

## Anonymous Report Insert

Anonymous insert into `content_reports` passed with `Prefer: return=minimal`:

```text
POST /content_reports
Result: 201 Created
```

Anonymous users still cannot read inserted report rows:

```text
GET /content_reports?select=id,status
Result: []
```

This is the intended behavior for public issue reporting.

## Notes

- A first insert attempt failed because the request used prototype field names
  (`reason`, `target_type`, `target_id`) instead of the current schema
  (`page_url`, `entity_type`, `entity_id`, `report_type`, `message`).
- The corrected payload passed, so the failure was request-shape drift rather
  than RLS failure.
- Linked `db lint` from Codex was not rerun because Codex does not retain the
  user's database password environment. The user can run it manually with:

```bash
SUPABASE_DB_PASSWORD=... npx supabase db lint --linked
```

## Decision

```text
STAGING REST/RLS PASS
```
