# K-food Commercial Service History

Status: Active project memory  
Owner: Hanbit + Codex  
Started: 2026-07-06

## Purpose

This file is the durable working history for the K-food Commercial Service.
It records project decisions, completed work, verification results, mistakes,
and the next decision rules that should guide future work.

Use this file before and after meaningful work so the project does not rely on
chat memory alone.

## How To Update This File

Add a new entry whenever one of these happens:

- a feature is implemented or reverted,
- production behavior changes,
- Supabase, Vercel, auth, RLS, or env settings change,
- a user verification result contradicts an earlier assumption,
- an error in Codex judgment is found,
- a handoff to another teammate or agent happens.

Each entry should include:

```text
Date
Request
Action
Verification
Issue or misjudgment
Decision rule for next time
Hanbit check items
Next action
```

## Current Project State Snapshot

Date: 2026-07-06

Repository:

```text
https://github.com/kanghanbeat/kfood-commercial-service
```

Local working directory:

```text
/Users/beat/Projects/kfood-commercial
```

Production URL:

```text
https://kfood-commercial-service-web.vercel.app
```

Current root structure:

```text
web/        Next.js public web and admin
supabase/   migrations and seed data
packages/   shared types, data access, config, crawler package
mobile/     future Expo app placeholder
docs/       product, architecture, implementation, quality, release, team docs
```

Important separation:

```text
supabase/migrations/003_crawling_service_schema.sql
packages/crawler/
```

These are a separate crawling lane and should not be included in active service
work unless Hanbit explicitly starts that lane.

## Major Decisions So Far

### Web/Mobile Architecture

Decision:

```text
kfood-commercial/
├── web/        Next.js public web + admin
├── mobile/     Expo app, later phase
├── supabase/   migrations, seed, edge functions
└── packages/
    ├── types/
    ├── data/
    └── config/
```

Reason:

- Next.js is better for public web, SEO, routes, admin, sitemap, and deployment.
- Expo mobile remains a later phase.
- Shared packages prevent duplication between web, future mobile, and backend.

### Product Direction

Decision:

The service is not a generic SNS. It is a trusted K-food discovery service with
controlled user records.

Meaning:

- Public guide content remains verified/editorial.
- User posts, comments, likes, follows, and mypage features can exist, but they
  should support trust, retention, and monetization rather than becoming an
  unmoderated social feed.
- Admin moderation and trust surfaces remain part of the core product.

### Public MVP Direction

Decision:

MVP started as web-first:

- public discovery pages,
- Supabase read integration,
- report/contact/trust pages,
- admin operations,
- alpha Vercel deployment.

Later community expansion:

- `/feed`
- `/search`
- `/recommend`
- `/mypage`
- user records and comments
- language preference and future translation

### Collaboration Direction

Decision:

GitHub is the shared code collaboration base. Supabase Auth accounts are only
for app/admin login, not GitHub collaboration itself.

Rules:

- GitHub collaborator access lets a teammate edit code.
- Supabase Dashboard access is separate and should be limited.
- App admin/editor access requires a Supabase Auth user plus a matching
  `profiles` row with `role = 'editor'` or `role = 'admin'`.

## Completed Work Summary

### Foundation

- Root workspace created.
- Next.js `web/` app added.
- Supabase migrations and seed files organized.
- Shared packages created for `types`, `data`, and `config`.
- Production deployment through Vercel established.
- GitHub repo connected and pushed.

### Public Web

- Public pages implemented for:
  - home
  - regions
  - foods
  - places
  - routes
  - search
  - recommend
  - report
  - contact
  - trust/legal pages
- Public web reads Supabase data.
- Production fallback to alpha placeholder data is intentionally disabled.

### Data and Supabase

- Service schema/RLS designed.
- Capital region seed direction established.
- 30-food draft reviewed by Hanbit.
- Place/route seed work started.
- Service SQL migration lane is:
  - `004_place_map_business_info.sql`
  - `005_report_rate_limit.sql`
  - `006_profiles_public_user_insert.sql`
  - `007_mypage_profile_and_ugc_foundation.sql`
- Crawling migration `003` is separate and excluded from active service work.

### Admin/Operations

- Admin auth implemented.
- Admin reports workflow implemented.
- Admin place edit workflow implemented.
- Admin user posts and comments moderation surfaces added.
- Admin audit log flow exists for place updates.
- Teammate `sori030` app editor setup was discussed and documented.

### Community/UGC

- Community navigation shell added.
- `/feed`, `/search`, `/recommend`, `/mypage` direction established.
- User posts and comments flow added.
- Mypage profile fields added:
  - display name
  - bio
  - preferred language
- Photo/video upload intentionally deferred until storage/API integration.

### Deployment

- Vercel alpha deployment completed.
- Environment variables configured for production.
- Production site has been reachable at:

```text
https://kfood-commercial-service-web.vercel.app
```

## Active Problem: Public Auth Session Failure

Date first escalated: 2026-07-01 to 2026-07-06

Observed by Hanbit:

- After create account/login, `/mypage` can appear reachable.
- Saving profile returns to login or appears to lose login.
- Moving from `/mypage` to `/feed` or `/feed/new` requires login again.
- Header continues showing `Log in` after login.

Diagnostic page added:

```text
/auth/session-check
```

Commit:

```text
50b515c chore(auth): add public session diagnostic
```

Production check:

```text
https://kfood-commercial-service-web.vercel.app/auth/session-check
```

Hanbit browser result after login:

```text
Supabase public config present: Yes
Signed-in hint cookie present: No
Access token cookie present: No
Refresh token cookie present: No
Server session valid: No
```

Current diagnosis:

The app is not retaining the public auth cookies in the real production browser
flow. The primary issue is before profile save, feed write, DB/RLS, or comments.

Correct problem boundary:

```text
Auth cookie storage/session persistence problem
NOT primarily a DB migration problem
NOT primarily a profile form problem
NOT primarily a feed page problem
```

## Important Misjudgment To Avoid Repeating

Issue:

Codex treated the login/session failure and DB migration/RLS readiness as partly
interchangeable possibilities for too long.

What was wrong:

- SQL migrations `004` to `007` are required for map info, reports, profiles,
  user posts, and comments.
- They are not the first-line explanation for losing login after page movement.
- The correct first check should have been auth cookie presence immediately
  after login.

Correct diagnostic order from now on:

```text
1. Verify login response succeeds.
2. Verify browser receives/stores auth cookies.
3. Verify cookies are sent to the next request.
4. Verify server session is valid.
5. Only then verify profile save, feed write, comments, DB functions, and RLS.
```

Decision rule:

Do not ask Hanbit to verify Supabase SQL/RLS for a login persistence issue until
cookie presence and server session validity have been confirmed.

## Current Recommendation

Do not restart the entire service repo.

Recommended reset scope:

```text
Public Auth Reset:
Replace the custom public cookie/session implementation with Supabase SSR auth.
```

Reason:

- The rest of the product structure is reusable.
- The broken part is the custom public auth/session foundation.
- Official Supabase SSR auth should reduce custom cookie refresh logic.

Suggested next implementation lane:

```text
1. Document current custom public auth behavior.
2. Add/use @supabase/ssr.
3. Replace public auth cookie helpers with official SSR client helpers.
4. Update login/join/logout/callback routes.
5. Update /mypage, /mypage/update, /feed/new, /feed/new/submit to use the new session helper.
6. Keep /auth/session-check and connect it to the new SSR session state.
7. Redeploy and verify browser cookie/session persistence before touching DB/RLS again.
```

## Hanbit Check Items Before Next Coding Step

Hanbit has already confirmed:

- login/session still fails in production,
- `/auth/session-check` after login shows no public auth cookies,
- profile save and feed navigation still require login again.

No further SQL confirmation is needed before the auth reset.

Next Hanbit decision needed:

```text
Approve Public Auth Reset using Supabase SSR auth.
```

## Standing Operating Rules Going Forward

1. Before implementing a substantial change, Codex should explain:
   - what will change,
   - why it is needed,
   - what risk it carries,
   - what Hanbit must verify afterward.

2. After implementing, Codex must update this `history.md` when the work affects:
   - auth,
   - Supabase,
   - Vercel,
   - admin,
   - UGC,
   - collaboration,
   - production behavior,
   - or any previous misjudgment.

3. For auth work, success is not proven by build or curl alone. It must include
   a real browser checklist:
   - login,
   - session-check,
   - navigation,
   - form submit,
   - refresh,
   - logout.

4. For DB work, do not mix crawling migrations with service migrations.

5. PR `#1` / branch `feature/design-tokens-v2` should not be merged until the
   public auth issue is stabilized or explicitly rebased/reviewed against the
   new auth foundation.

## 2026-07-06 Entry

Request:

Hanbit asked whether Codex had been maintaining a `history.md` and using it to
review instructions and feedback.

Action:

- Checked the repo for existing `history.md`.
- Found no project-managed history file.
- Created this durable history file under `docs/06-team/history.md`.
- Reviewed current docs, recent commits, and the production auth diagnostic
  result before writing.

Verification:

- `git status --short --branch` showed `main...origin/main` before this file.
- Recent production auth diagnostic commit was confirmed:
  `50b515c chore(auth): add public session diagnostic`.

Issue or misjudgment:

- Codex had been recording decisions across many docs, commits, and chat
  summaries, but not in a single durable history file.
- This made repeated auth misdiagnosis harder to catch.

Decision rule for next time:

- Update `docs/06-team/history.md` after every meaningful project step.
- When a user asks whether something has been recorded, verify the repo before
  claiming it has been maintained.

Hanbit check items:

- Confirm that this file is the desired running history location.
- Confirm whether the next step should be `Public Auth Reset`.

Next action:

- If approved, start the auth reset design before coding.
