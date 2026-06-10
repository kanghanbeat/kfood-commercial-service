# Sprint 3 Kickoff

Status: Started  
Date: 2026-06-10

## User Decision

Sprint 3 starts with the capital region.

```text
Primary geography: Seoul to Gyeonggi/Incheon metropolitan region
Food count target: about 30 draft foods
Verification model: Codex drafts research; user verifies reliability
Publication model: verified items only become published seed data
```

## Sprint 3 Goal

Move the service from technical readiness toward launch trust readiness:

- prepare capital-region food content draft
- refine public trust/legal/editorial surfaces
- define deployed report abuse protection
- prepare verified-content seed workflow

## Workstreams

### 1. Capital Region Food Draft

Create a reviewable list of roughly 30 foods across:

- Seoul
- Incheon
- Suwon
- Uijeongbu
- Anyang
- other Gyeonggi day-trip cities

Output:

```text
docs/00-research/sprint-3-capital-region-food-draft.research.md
```

### 2. Trust Surface Polish

Review and improve:

```text
/editorial-policy
/content-policy
/disclosures
/maps-notice
/privacy
/terms
/contact
/report
```

Exit criteria:

- no page claims final legal coverage if it is still alpha
- sponsored/affiliate language is clear
- map accuracy limitations are clear
- user report workflow is clear

### 3. Report Abuse Control

Already completed before Sprint 3:

- allowlist
- URL validation
- message length guard
- honeypot

Remaining:

- choose deployed rate-limit strategy
- document rate-limit threshold
- implement before public alpha deploy

### 4. Verified Seed Workflow

Before inserting real content into Supabase, each item needs:

- source URL
- user verification status
- publication status
- caution tags
- trust tags
- city/region relationship
- food/place/route relationship

## Current Non-goals

- No admin CMS implementation inside Sprint 3 unless the trust surface is done.
- No mobile app restart.
- No production deploy until content and policies pass review.
- No claim that all 30 foods are verified yet.

## Sprint 3 Exit Criteria

- Capital-region food draft exists.
- User has a clear verification checklist.
- Public trust pages are alpha-launch ready.
- Report rate-limit decision is documented.
- Next seed migration plan is ready.

## Progress

- The user completed review of the 30-food draft.
- `supabase/seed.sql` has been expanded locally with 23 published regions,
  30 published foods, and 42 public region-food relationships.
- Local Supabase reset and Next.js build against the expanded local seed pass.
- Remote staging apply is pending because it requires the user's newly reset DB
  password.
