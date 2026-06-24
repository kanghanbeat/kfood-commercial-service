# Team Onboarding

Status: Active  
Date: 2026-06-22

## Project in One Sentence

K-food Commercial Service is a web-first K-food discovery platform for
travelers, focused on practical food discovery, trusted editorial guidance,
route planning, reports, and admin operations.

## What Is Live

```text
Alpha URL: https://kfood-commercial-service-web.vercel.app
Repository: https://github.com/kanghanbeat/kfood-commercial-service
Backend: Supabase staging project
Deploy: Vercel
```

The deployed home page should show:

```text
23 regions
30 foods
30 place directions
5 routes
```

If these show as zero, check Supabase project health, Vercel environment
variables, and whether the latest Vercel deployment has been redeployed after
env changes.

## Repository Shape

```text
web/        Next.js public web and admin
supabase/   migrations, seed data, SQL verification
packages/   shared types, data access, config
mobile/     future Expo app placeholder
docs/       product, architecture, implementation, quality, release notes
```

## First Local Run

```bash
npm install
cp .env.example .env.local
npm run web:dev
```

Open:

```text
http://localhost:3000
```

Before submitting work:

```bash
npm run check
npm run web:build
```

## Documents to Read First

Read in this order:

1. `README.md`
2. `CONTRIBUTING.md`
3. `docs/00-blueprint/service-product-definition.md`
4. `docs/02-architecture/service-architecture-reset.md`
5. `docs/02-architecture/service-data-model.md`
6. `docs/03-implementation/operational-mvp-sprint-1-admin-auth-reports.md`
7. `docs/03-implementation/operational-mvp-sprint-2-places-edit-workflow.md`
8. `docs/05-release/alpha-deploy-readiness.md`

## Important Product Rules

- Public pages show only published content.
- Production must not silently fall back to placeholder alpha data.
- Admin writes should leave audit logs.
- Reports need abuse protection and review flow.
- Content should be verified before it is treated as service-ready.
- Photo sources require copyright and portrait-rights review.

## Important Technical Rules

- Public pages must not use the Supabase service role key.
- RLS must remain the primary access boundary.
- Admin pages require Supabase Auth and active admin profiles.
- GitHub collaborator access does not automatically grant service admin access.
  A teammate also needs a Supabase Auth user and a matching `profiles` row with
  `role = 'editor'` or `role = 'admin'`.
- Supabase migrations must be ordered and reviewed.
- Environment variables should be documented in `.env.example`.
- Do not commit generated build output or local env files.

## Admin Access for Teammates

Use this for a trusted teammate such as `sori030` after GitHub collaboration is
already enabled:

1. Create or invite the teammate in Supabase Dashboard under Authentication.
2. Copy the Auth user UUID.
3. Run this in Supabase SQL Editor:

```sql
insert into public.profiles (id, display_name, role, is_active)
values ('<auth-user-uuid>', 'sori030', 'editor', true)
on conflict (id) do update
set
  display_name = 'sori030',
  role = 'editor',
  is_active = true,
  updated_at = now();
```

Use `editor` first for content/report operations. Upgrade to `admin` only if the
teammate should manage higher-risk operations.

4. Ask the teammate to sign in:

```text
https://kfood-commercial-service-web.vercel.app/admin/login
```

If the teammate was invited by email and has not set a password yet, ask them
to open the latest invitation or password recovery email first. The app should
send secure invite/recovery links to:

```text
https://kfood-commercial-service-web.vercel.app/auth/update-password
```

After setting the password, they can use the same email and new password on
`/admin/login`. If they see `Invalid admin credentials`, confirm that:

- the password was actually set from the latest email link
- the email address matches the Supabase Auth user exactly
- the `profiles` row exists with `role = 'editor'` or `role = 'admin'`
- `is_active = true`

5. Verify a low-risk `/admin/places` save and confirm the new
`/admin/audit-logs` row.

## Work That Is Currently Separate

Crawling is not part of the active service release. Do not edit or commit these
paths unless the project owner explicitly starts the crawling lane:

```text
packages/crawler/
supabase/migrations/003_crawling_service_schema.sql
```

## Recommended First Issues for a New Teammate

- Verify deployed public routes and report any broken content.
- Improve copy on trust pages without changing data contracts.
- Add smoke-test notes to quality docs.
- Review place data and suggest corrections through a pull request.
- Improve admin empty states or validation messages.

Avoid starting with:

- RLS changes
- auth changes
- deployment env changes
- crawling integration
- large content imports
