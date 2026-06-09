# Sprint 1 Status

Status: GitHub completed, Supabase runtime blocked  
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
docker command: not available
npx supabase status: cannot reach Docker daemon
local Postgres 127.0.0.1:54322: not running
```

Application checks:

```text
npm run check: pass
```

## Completed In Sprint 1

- Re-confirmed root/legacy repository state.
- Repaired GitHub authentication.
- Created root-only production repository:
  `https://github.com/kanghanbeat/kfood-commercial-service`.
- Pushed root `main` to `origin/main`.
- Re-confirmed Supabase local runtime blocker.
- Expanded `supabase/seed.sql` so verification has:
  - one published region
  - draft regions
  - one published food
  - one draft food
  - one published place
  - one published route
  - join rows for region-food, place-food, and route-place
- Added `supabase/sql/sprint_1_rls_verification.sql`.

## Blockers

### Supabase Runtime

Docker is not currently available, so local Supabase cannot start.

Required user-side action:

```text
Install/start Docker Desktop
```

Alternative:

```text
Create/link a staging Supabase project and run migrations there.
```

## Commands To Run After Blockers Are Cleared

Local Supabase path:

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
- migrations applied to local or staging Supabase
- RLS behavior verified with published/draft rows
- anonymous report insert verified
- readiness report updated from `Partial` to `Pass`
