# Pre-Sprint 3 Cleanup

Status: Implemented  
Date: 2026-06-10

## Purpose

Before moving into Sprint 3, the service needed a small hardening pass so the
public web foundation is less prototype-shaped.

## Completed

- Renamed public data types from `Alpha*` to `Public*`.
- Renamed local placeholder arrays to `fallback*` so their purpose is explicit.
- Added production-safe fallback behavior:
  - development can use fallback data
  - production does not silently show fallback data
  - local demo fallback can be explicitly enabled with
    `NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK=true`
- Added report abuse checks:
  - supported report type allowlist
  - valid `http`/`https` URL check
  - minimum message length
  - maximum message length
  - email length guard
  - hidden honeypot field
- Updated `.env.example` with fallback guidance.

## User-Side Security Note

The previously exposed Supabase DB password has been reset by the user. No DB
password or service-role key is committed to the repository.

## Remaining Before Public Launch

- Add deployed rate limiting for `/report`.
- Replace staging verification seed data with verified Seoul alpha content.
- Finalize privacy, terms, disclosure, and editorial policy copy.
- Configure deployed environment variables.
