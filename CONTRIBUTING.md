# Contributing

This repository is moving from solo development to team collaboration. The goal
is to keep `main` deployable while still allowing fast iteration.

## First-Time Setup

```bash
git clone https://github.com/kanghanbeat/kfood-commercial-service.git
cd kfood-commercial-service
npm install
npm run check
npm run web:build
```

For local development:

```bash
cp .env.example .env.local
npm run web:dev
```

## Branching

Use a short feature branch name:

```text
feature/admin-report-filter
fix/report-rate-limit-message
docs/team-onboarding
content/seoul-place-corrections
```

Do not commit directly to `main` unless the project owner explicitly asks for
that workflow.

## Pull Request Rules

Every pull request should include:

- what changed
- why it changed
- how it was verified
- screenshots for UI changes
- migration notes for database changes
- environment variable notes when config changes

Use the GitHub pull request template in `.github/pull_request_template.md`.

## Required Checks

Run these before requesting review:

```bash
npm run check
npm run web:build
```

If you cannot run a check, say why in the pull request.

## Supabase Rules

Migrations must be committed in order and must not reuse an existing migration
number.

Public reads must respect RLS and must expose only published content. Do not use
the service role key in public pages or client-side code.

If a change touches these areas, include manual verification steps:

- RLS policies
- report submission
- admin auth
- admin mutations
- audit logs
- publication status
- rate limiting

## Content Rules

This service is trust-first. Content changes should be treated as product work,
not filler.

For regions, foods, places, and routes:

- keep user-facing claims practical and verifiable
- avoid unsupported "best" or "famous" claims unless reviewed
- preserve `last_verified` or verification notes when editing places
- do not publish copyright-sensitive photos without source review
- do not add sponsored or affiliate claims unless the field and disclosure are
  intentional

## Security Rules

Never commit secrets:

- `.env`
- `.env.local`
- Supabase database password
- Supabase service role key
- GitHub personal access tokens
- Vercel tokens

If a secret is exposed, rotate it first, then document the incident in a private
team channel.

## Separated Work

The crawling lane is currently separate from the K-food service release. Do not
commit these paths unless the project owner explicitly asks for crawling work to
be merged:

```text
packages/crawler/
supabase/migrations/003_crawling_service_schema.sql
```

## Review Focus

Reviewers should look for:

- user-visible regressions
- broken routes or navigation
- accidental fallback data in production
- RLS or authorization mistakes
- missing audit logs for admin writes
- unclear content claims
- missing verification notes
