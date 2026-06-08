# K-food Commercial

Real-service workspace for the K-food discovery platform.

## Workspace

```text
kfood-commercial/
├── web/        # Next.js public web and future admin
├── mobile/     # Future Expo app location
├── supabase/   # migrations, seed, SQL checks
└── packages/
    ├── types/
    ├── data/
    └── config/
```

The legacy Expo prototype currently remains in:

```text
frontend/
```

It is kept as a reference asset until the new `web/`, `supabase/`, and shared
packages are stable enough to become the only active service workspace.

## Commands

```bash
npm install
npm run typecheck
npm run lint
npm run web:build
npm run dev --workspace web -- -H 127.0.0.1 -p 3000
```

## Current Status

- Root npm workspace is installed.
- Next.js public web alpha slice is implemented.
- Supabase schema and RLS migrations are drafted.
- Supabase local apply is blocked until Docker Desktop or a staging project is
  available.
- Git repository normalization is still pending because the existing Git repo
  lives inside `frontend/`.
