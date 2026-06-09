# Sprint 1 Repo And Supabase Verification Design

Status: Draft v1  
Date: 2026-06-09

## Problem

The service has a new root workspace, but two foundations are not settled yet:

1. Repository ownership:
   - root `kfood-commercial/` has the production workspace
   - nested `frontend/` has the old GitHub-connected prototype repo
2. Database verification:
   - Supabase schema and RLS are drafted
   - migrations have not been applied to an actual database

Shipping more UI before these are resolved would create avoidable rework.

## Options

### Option A: Fresh Root Production Repo

Create or connect a GitHub repo for the root workspace. Keep `frontend/` as a
legacy reference ignored by root Git.

Tradeoffs:

- fastest clean production baseline
- simplest deploy setup
- old prototype history remains separate
- requires deciding what to do with the existing GitHub remote

### Option B: Migrate Prototype History Into Root

Rewrite/move the existing `frontend` Git history so paths live under
`frontend/` in the root repository.

Tradeoffs:

- preserves full prototype history in one repo
- higher risk and more Git complexity
- should wait until the `frontend` working tree is clean
- can distract from service launch work

### Option C: Keep Dual Repos Temporarily

Use root Git locally for service work and leave `frontend` connected to the old
GitHub remote until the service is more mature.

Tradeoffs:

- lowest immediate risk
- no history rewrite
- deployment/push workflow is incomplete
- can confuse future commits if not documented carefully

## Selected Direction

Use Option C for the immediate Sprint 1 checkpoint, then move to Option A when
ready to publish/push the production workspace.

Reason:

- root workspace is already committed locally
- `frontend/app/(tabs)/index.tsx` has a local modification that should not be
  disturbed
- service value now depends more on Supabase verification and public web data
  flow than on preserving old prototype history

## Supabase Verification Options

### Option A: Local Docker

Run Supabase locally through Docker Desktop.

Commands:

```bash
npx supabase start --workdir /Users/beat/Projects/kfood-commercial
npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial
```

Best for:

- repeatable local development
- offline-ish verification
- testing RLS before remote changes

Blocker:

- Docker Desktop must be installed and running.

### Option B: Staging Supabase Project

Link a remote staging project and push migrations there.

Best for:

- production-like verification
- early deploy integration
- avoiding local Docker setup

Risks:

- remote project credentials and project ref must be handled carefully
- bad migrations affect a real hosted project

### Option C: SQL Review Only

Continue with SQL file review and defer database execution.

Best for:

- temporary progress when no DB runtime is available

Risks:

- does not prove RLS behavior
- not enough for service launch readiness

## Selected Supabase Direction

Prefer Option A if Docker Desktop can be started. Use Option B if the user
wants to move directly to a hosted staging project.

Option C is not enough for Sprint 1 exit.

## Data Contract For Verification

Minimum test rows:

```text
regions:
  - one published row
  - one draft row
foods:
  - one published row
  - one draft row
places:
  - one published row linked to the published region
content_reports:
  - one public insert
```

Expected behavior:

- anon/public select returns published editorial content
- anon/public select does not return draft content
- anon/public insert into `content_reports` works with `pending`
- authenticated admin/editor can manage content
- non-admin cannot read reports or audit logs

## Test Plan

Build checks:

```bash
npm run typecheck
npm run lint
npm run web:build
```

Supabase checks:

```bash
npx supabase db lint --local --workdir /Users/beat/Projects/kfood-commercial
npx supabase migration up --local --workdir /Users/beat/Projects/kfood-commercial
```

Manual SQL checks:

```bash
supabase/sql/rls_audit_queries.sql
```

## Security Notes

- Never put Supabase service-role keys in `NEXT_PUBLIC_*`.
- Public web should read through anon-safe published policies.
- Admin writes should remain server-side and authenticated.
- `content_reports` needs spam/rate-limit controls before public scale.

## Rollback Notes

- Root Git commit can be reverted independently from the legacy `frontend`
  repo.
- Supabase migrations should first be tested locally or in staging before any
  production project is linked.
- If migration fails, create a follow-up migration rather than editing an
  already-applied migration in a shared environment.
