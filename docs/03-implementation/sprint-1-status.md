# Sprint 1 Status

Status: Completed  
Date: 2026-06-10

## Goal

Sprint 1 is intended to lock the production baseline by resolving repository
direction and verifying Supabase migrations/RLS against a real database runtime.

## Re-checked Current State

Repository:

```text
root repo: local Git repository, no remote
frontend repo: connected to https://github.com/kanghanbeat/kfood-commercial.git
gh auth: invalid token for kanghanbeat
```

Updated repository state:

```text
root repo: pushed to https://github.com/kanghanbeat/kfood-commercial-service
frontend repo: remains connected to https://github.com/kanghanbeat/kfood-commercial.git
gh auth: valid token for kanghanbeat
```

Supabase:

```text
npx supabase --version: 2.105.0
Docker Desktop: running
local Supabase API: http://127.0.0.1:54321
local Supabase Studio: http://127.0.0.1:54323
local Postgres: postgresql://postgres:postgres@127.0.0.1:54322/postgres
staging project ref: gpwxiakwlghjzvoxwpnw
staging project URL: https://gpwxiakwlghjzvoxwpnw.supabase.co
```

Application checks:

```text
npm run check: pass
npm run web:build: pass
npx supabase migration up --local: pass
npx supabase db reset --local: pass
npx supabase db lint --local: pass
staging db push --include-seed: completed by user
staging anonymous REST/RLS checks: pass
```

## Completed In Sprint 1

- Re-confirmed root/legacy repository state.
- Repaired GitHub authentication.
- Created root-only production repository:
  `https://github.com/kanghanbeat/kfood-commercial-service`.
- Pushed root `main` to `origin/main`.
- Confirmed Docker Desktop/local Supabase runtime is available.
- Applied local migrations/reset with seed.
- Verified local DB lint.
- Expanded `supabase/seed.sql` so verification has:
  - one published region
  - draft regions
  - one published food
  - one draft food
  - one published place
  - one published route
  - join rows for region-food, place-food, and route-place
- Added `supabase/sql/sprint_1_rls_verification.sql`.
- Verified anon REST public reads expose only published content.
- Verified anon REST report insert succeeds with `Prefer: return=minimal`.
- Verified anon REST cannot read reports or audit logs.
- Verified all public service tables have RLS enabled.
- Linked staging project `gpwxiakwlghjzvoxwpnw`.
- Applied migrations and seed to staging through `db push --include-seed`.
- Verified staging anonymous REST public reads expose only published content.
- Verified staging anonymous REST report insert succeeds with
  `Prefer: return=minimal`.
- Verified staging anonymous REST cannot read reports or audit logs.

## Blockers

None for Sprint 1.

Remaining production-readiness work moves to Sprint 2 and later:

- Connect public web env vars to staging.
- Implement live `/report` insert from the web app.
- Add storage policies, admin writes, and abuse controls.

## Useful Re-run Commands

Local Supabase path already verified:

```bash
cd /Users/beat/Projects/kfood-commercial
npx supabase start --workdir /Users/beat/Projects/kfood-commercial
npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial
npx supabase db lint --local --workdir /Users/beat/Projects/kfood-commercial
```

Then run:

```text
supabase/sql/rls_audit_queries.sql
supabase/sql/sprint_1_rls_verification.sql
```

Optional linked lint from the user's terminal:

```bash
SUPABASE_DB_PASSWORD=... npx supabase db lint --linked
```

## Sprint 1 Exit Criteria Result

- root GitHub remote selected and pushed
- migrations applied to local Supabase
- RLS behavior verified with published/draft rows
- anonymous report insert verified
- readiness report updated to local and staging pass
- staging Supabase verification completed
