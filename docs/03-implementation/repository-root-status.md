# Repository Root Status

Status: Root workspace ready, Git root pending  
Date: 2026-06-08

## Current State

The service workspace now lives at:

```text
/Users/beat/Projects/kfood-commercial
```

The existing Git repository still lives at:

```text
/Users/beat/Projects/kfood-commercial/frontend/.git
```

This means the new root files are executable locally but are not yet tracked by
the existing Git repository.

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

## Recommended Git Normalization Options

Option A:

```text
Create a fresh root repository and keep frontend as legacy reference.
```

Best when preserving old commit-level history is less important than a clean
service reset.

Option B:

```text
Migrate existing frontend Git history into frontend/ path under root.
```

Best when preserving history matters. This should be done in a dedicated
checkpoint with a clean working tree and a backup branch.

Option C:

```text
Keep frontend as a separate archived repo and publish the new root as the
production service repo.
```

Best when the Expo prototype should remain separate from the new web-first
production architecture.

## Current Recommendation

Use Option A unless frontend history must be preserved in the same repository.
The prototype has already served its learning/reference purpose, and the new
service root is now the deployment-oriented structure.
