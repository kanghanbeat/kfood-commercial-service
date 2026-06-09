# Repository Root Status

Status: Root workspace committed locally, remote blocked  
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

The root repository currently has no remote.

The existing GitHub-connected prototype repository still lives at:

```text
/Users/beat/Projects/kfood-commercial/frontend/.git
```

This means the new root files are tracked locally, but they are not pushed to a
GitHub remote yet.

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
root repo:     no remote
frontend repo: https://github.com/kanghanbeat/kfood-commercial.git
```

Sprint 1 re-check:

```text
gh auth status: invalid token for kanghanbeat
existing GitHub repo: kanghanbeat/kfood-commercial, public, main
root git remote: none
```

Before pushing the root workspace, decide whether to:

- repoint `kanghanbeat/kfood-commercial` to the root workspace after backing up
  the prototype history, or
- create a new root-only GitHub repo and leave the old remote as the prototype
  archive.

## Current Blocker

Root remote setup and push should wait until GitHub authentication is repaired:

```bash
gh auth login -h github.com
```

After authentication works, the recommended production path is:

```text
1. Create a new root-only production repository, or intentionally reuse the
   existing repository after backing up the prototype.
2. Add that remote to /Users/beat/Projects/kfood-commercial.
3. Push root main.
4. Keep frontend/ ignored as legacy reference unless a later history migration
   is explicitly chosen.
```
