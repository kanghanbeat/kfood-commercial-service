# Sprint 1 Status

Status: GitHub completed, local Supabase verified  
Date: 2026-06-09

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
```

Application checks:

```text
npm run check: pass
npm run web:build: pass
npx supabase migration up --local: pass
npx supabase db reset --local: pass
npx supabase db lint --local: pass
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

## Blockers

### Supabase Staging

Local Supabase verification now passes. The remaining database blocker is
staging/remote verification.

Required next action:

```text
Create/link a Supabase staging project and run migrations there.
```

## Commands To Run After Blockers Are Cleared

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

## Sprint 1 Exit Criteria Remaining

- root GitHub remote selected and pushed
- migrations applied to local Supabase
- RLS behavior verified with published/draft rows
- anonymous report insert verified
- readiness report updated from `Partial` to local pass
- staging Supabase verification remains before production deploy
