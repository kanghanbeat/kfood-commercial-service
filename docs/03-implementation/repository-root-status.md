# Repository Root Status

Status: Root workspace pushed to production remote  
Date: 2026-06-09

## Current State

The service workspace now lives at:

```text
/Users/beat/Projects/kfood-commercial
```

The root workspace now has its own local Git repository and baseline commit:

```text
bef2e28 chore: bootstrap kfood service workspace
```

The root repository now uses a root-only production remote:

```text
https://github.com/kanghanbeat/kfood-commercial-service
```

The existing GitHub-connected prototype repository still lives at:

```text
/Users/beat/Projects/kfood-commercial/frontend/.git
```

The new root files are tracked locally and pushed to the root production remote.

## Why Git Was Not Moved Automatically

Moving `.git` from `frontend/` to the root would make Git think all historical
paths were deleted and new `frontend/...` paths appeared. Preserving history
cleanly requires a deliberate repository migration step that prefixes existing
tracked paths or creates a new root repository strategy.

This was not performed automatically because:

- `frontend/app/(tabs)/index.tsx` already has an unrelated local modification.
- Existing frontend history should not be rewritten casually.
- The new root workspace should first prove that install, build, and route
  verification work.

## Recommended Remote Options

Option A:

```text
Create or connect a fresh root production repository and keep `frontend/` as
legacy reference.
```

Best when preserving old commit-level history is less important than a clean
service reset.

Option B:

```text
Migrate existing `frontend` Git history into `frontend/` path under root.
```

Best when preserving history matters. This should be done in a dedicated
checkpoint with a clean working tree and a backup branch.

Option C:

```text
Keep `frontend` as a separate archived repo and publish the new root as the
production service repo.
```

Best when the Expo prototype should remain separate from the new web-first
production architecture.

## Current Recommendation

Use Option A unless old prototype commit history must be preserved in the same
repository. The prototype has already served its learning/reference purpose,
and the new service root is now the deployment-oriented structure.

## Current Remote State

```text
root repo:     https://github.com/kanghanbeat/kfood-commercial-service.git
frontend repo: https://github.com/kanghanbeat/kfood-commercial.git
```

Sprint 1 re-check:

```text
gh auth status: valid token for kanghanbeat
existing GitHub repo: kanghanbeat/kfood-commercial, public, main
root git remote: kanghanbeat/kfood-commercial-service, public, main
```

Decision:

```text
Create a new root-only production repository and leave the existing
`kanghanbeat/kfood-commercial` repository attached to the legacy Expo prototype.
```

## Completed GitHub Work

```text
Created: https://github.com/kanghanbeat/kfood-commercial-service
Pushed: root main
Remote: origin -> https://github.com/kanghanbeat/kfood-commercial-service.git
```

## Remaining Repository Notes

- Keep `frontend/` ignored from the root repository.
- Treat `kanghanbeat/kfood-commercial` as the legacy prototype repo unless a
  later explicit archival/migration step is chosen.
- Use `kanghanbeat/kfood-commercial-service` for production service work.
