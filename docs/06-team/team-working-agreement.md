# Team Working Agreement

Status: Active  
Date: 2026-06-22

## Shared Goal

Move the current alpha into an operational MVP without losing trust,
deployability, or data safety.

## Collaboration Model

```text
main stays deployable
small branch per task
pull request before merge
quality checks before review
manual verification for risky changes
```

## Ownership Areas

Product and content:

- region, food, place, and route content quality
- trust labels and verification notes
- photo source review
- public copy and policy pages

Engineering:

- Next.js public web
- admin workflows
- Supabase migrations and RLS
- data access packages
- deployment and environment configuration

Operations:

- report review workflow
- audit logs
- Vercel deployment checks
- Supabase project health
- incident notes when secrets or data policies are affected

## Definition of Done

A task is done only when:

- code or content is committed
- docs are updated if behavior changed
- `npm run check` passes, or the exception is documented
- `npm run web:build` passes, or the exception is documented
- manual route checks are listed for UI changes
- database or env changes have clear dashboard instructions

## Risk Levels

Low risk:

- copy changes
- docs updates
- small visual polish
- admin wording improvements

Medium risk:

- data query changes
- report workflow changes
- content seed changes
- route metadata changes

High risk:

- RLS policies
- admin authorization
- service role usage
- Supabase migrations
- Vercel production environment variables
- publication status logic

High-risk work needs an explicit review from the project owner.

## Pull Request Expectations

Keep pull requests small. A good pull request should answer:

- What changed?
- Why now?
- How was it tested?
- What could break?
- Does it affect Supabase, env vars, auth, reports, audit logs, or content
  trust?

## Content Review Expectations

For food/place/route content, include at least one of:

- direct owner verification
- reliable public source
- map listing verification
- clear note that the content is a draft pending verification

Do not publish uncertain claims as final service content.

## Deployment Expectations

Vercel deployment is acceptable for alpha only when:

- home page reads Supabase data
- primary public routes load
- report page can submit or shows a clear failure
- admin login is reachable
- environment variables match `.env.example`
- production fallback is disabled

## Incident Rule

If a secret, DB password, token, or service role key is exposed:

1. Stop using the exposed value.
2. Rotate it in the provider dashboard.
3. Update local and Vercel env values.
4. Redeploy if needed.
5. Document the private incident summary for the team.
