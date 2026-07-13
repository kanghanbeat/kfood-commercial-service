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

## 2026-07-06 Codex App Thread Review Addendum

Source:

```text
Codex app thread: 작업 방식 개선
Workspace: /Users/beat/Projects
Project: /Users/beat/Projects/kfood-commercial
```

Hanbit clarified that "작업 방식 개선" means the Codex app conversation inside
the Projects workspace, not a local folder or document title. This addendum
records the broader thread flow from that app conversation.

### Earlier Flow Read From The Thread

1. Community acquisition:
   - A Reddit-specific acquisition document was kept, renamed, and generalized.
   - Direction changed from Reddit-only to broader community acquisition.
   - Resulting file: `docs/01-product/community-acquisition.capability.md`.
   - Commit referenced: `1b1aab9 docs: generalize community acquisition plan`.

2. User-requested operating rule:
   - Codex should first design, explain, and present direction.
   - Hanbit reviews and chooses.
   - Codex implements only after that.
   - This rule was later not followed consistently enough.

3. Mypage profile planning:
   - Selected direction: phased expansion.
   - First phase: `display_name`, `bio`, `preferred_language`.
   - Deferred: `username`, `public_profile_enabled`.
   - Explicitly excluded: `avatar_url`.
   - Reason: avatar/image work brings storage, RLS, deletion, file limits, and
     rights policy into scope too early.

4. Design/UX gap:
   - Hanbit asked why design had not been handled earlier.
   - Codex acknowledged over-weighting backend stability and waiting too much
     for explicit design direction.
   - New rule: user-facing pages need UX/design review as part of feature work,
     not as later decoration.

5. Community shell UX:
   - Target surfaces: Home, Feed, Search, Recommend, Mypage, Header/Footer.
   - Document created: `docs/02-architecture/community-shell-ux-design.md`.
   - Commit referenced: `d2ff46e feat: refine community shell experience`.

6. UGC Sprint 2 foundation:
   - Added DB-backed Feed, post creation, post detail, comments, admin post
     moderation, admin comment moderation, RLS verification SQL, and quality
     docs.
   - Commit referenced: `e71ebff feat: add user posts and comments flow`.
   - Important: remote Supabase migrations were not auto-applied because local
     `003_crawling_service_schema.sql` was intentionally excluded.

7. Supabase migration handling:
   - Safe plan was SQL Editor manual application.
   - Apply service migrations only: `004`, `005`, `006`, `007`.
   - Exclude `003_crawling_service_schema.sql`.
   - Screenshot checks showed UGC/profile DB objects were missing at that time.

8. OAuth provider issue:
   - Google/Kakao buttons existed, but Supabase providers were off.
   - Error observed: `Unsupported provider: provider is not enabled`.
   - Decision: use free Email/password auth first, defer Google/Kakao.
   - Commit referenced: `bf0b062 feat: add free email auth and admin post creation`.

9. Media upload scope:
   - Current scope was text posts/comments only.
   - Photo/video upload was deferred.
   - Supabase Storage can support photo upload without a separate external API,
     but needs media table, bucket policy, size/type limits, ownership/delete
     rules, and moderation policy.

10. Auth refresh hotfix:
    - Commit referenced: `b45e5a2 fix: refresh auth sessions across navigation`.
    - Added token refresh behavior and admin/public session distinction.
    - Later production browser checks still showed no public auth cookies, so
      this was not a complete fix.

### Current Problems Found

Workflow problems:

- The thread mixed too many separate tracks: production auth, PR #1, SQL
  migration, design, UGC, media upload, and dashboard tasks.
- The explicit "design first, Hanbit reviews, then implement" rule was not
  consistently enforced.
- `history.md` did not exist until this review, so mistakes and decisions were
  scattered across chat, docs, and commits.
- Hanbit check items were sometimes provided after implementation, not before
  the decision point.
- Production URL, PR preview URL, local branch, and Supabase Dashboard state were
  repeatedly at risk of being conflated.

Technical problems:

- Public auth uses custom cookies and custom refresh logic:
  `kfood_public_access_token`, `kfood_public_refresh_token`,
  `kfood_public_signed_in`.
- The latest user-facing diagnostic showed no public auth cookies in production
  after login.
- DB/RLS gaps are real for profile/UGC, but they are not the first explanation
  for "login disappears after navigation."
- Header auth state can be misleading because it depends on a hint cookie rather
  than a verified server session.
- PR #1 has useful work but broad scope and auth-sensitive changes, so it should
  wait until production auth is stable.

### Recommended Solution

Operating solution:

```text
1. Confirm the exact target: production, PR preview, local branch, or Supabase Dashboard.
2. Restate the user goal and split unrelated requests.
3. Read the relevant code/docs/thread context.
4. Update history.md before and after major decisions.
5. Present design/options and Hanbit check items before implementation.
6. Implement only after approval unless immediate execution is explicitly requested.
7. Verify with check/build/manual browser checks.
8. Report changed files, verification, remaining risks, and Hanbit next checks.
```

Technical solution:

```text
Public Auth Reset
```

Recommended direction:

- replace custom public auth cookies with official Supabase SSR auth;
- make login, callback, logout, protected pages, mutations, and middleware use
  the same session source;
- keep admin auth separate unless intentionally migrated;
- keep `/auth/session-check` until production browser behavior is proven stable;
- verify real browser flow before returning to PR #1 or DB/RLS debugging.

Minimum verification sequence:

```text
login
-> /auth/session-check
-> /mypage
-> Save profile
-> /auth/session-check
-> /feed
-> /feed/new
-> comment
-> admin moderation
```

## 2026-06-24 to 2026-06-29 Thread Review Addendum

### Collaboration And Admin Access

The thread also covered adding a collaborator and clarifying access boundaries.

Important distinction:

```text
GitHub collaborator
-> code, PRs, docs, local development

K-food app admin/editor
-> service admin UI, content checks, reports, audit workflow

Supabase Dashboard member
-> Auth users, SQL Editor, DB/RLS, API keys, provider settings
```

Decision:

```text
GitHub collaborator: allowed
K-food /admin editor: allowed
Supabase Dashboard member: usually hold back unless infrastructure work requires it
```

Reason:

Supabase Dashboard access is powerful and risky. A collaborator does not need it
just to work on code or use the service admin UI.

### Collaborator Invite Problem

Problem:

The collaborator clicked a Supabase invitation/recovery email and got a
localhost connection error.

Cause:

Supabase Auth URL Configuration was still pointing invite redirects toward
localhost. A collaborator's machine does not have the local dev server running,
so the browser showed connection refused.

Required Supabase configuration:

```text
Site URL:
https://kfood-commercial-service-web.vercel.app

Redirect URLs:
https://kfood-commercial-service-web.vercel.app/**
https://kfood-commercial-service-web.vercel.app/admin/login
https://kfood-commercial-service-web.vercel.app/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/callback
```

Later finding:

`/admin/login` used email/password login, but the app did not yet have a
password setup flow for invitation/recovery links.

Fix implemented:

- `/auth/update-password`
- hash redirect handling for Supabase invite/recovery tokens
- updated admin login copy
- updated onboarding docs

Commit referenced:

```text
1c4d995 fix: add invite password setup flow
```

### Admin Navigation Problem

Problem:

After admin login, clicking top-level `Regions`, `Foods`, `Places`, or `Routes`
could feel like it required login again.

Cause:

The public site header linked to public paths:

```text
/regions
/foods
/places
/routes
```

Admin work needed admin paths:

```text
/admin/regions
/admin/foods
/admin/places
/admin/routes
```

Admin cookies are scoped to `/admin` for security, so public/admin navigation
needed to be visually separated.

Fix implemented:

- added `web/components/admin-nav.tsx`
- added admin navigation to admin pages
- kept public header separate from admin workflow

Commit referenced:

```text
c0a8648 fix: add admin navigation bar
```

### Community Direction Foundation

Hanbit proposed a larger product shift:

- translation: Korean, Chinese, English, Japanese;
- user daily records with photos and places;
- UI centered on `/feed`, `/search`, `/recommend`, `/mypage`;
- Feed with translation, search, write record, likes, and follow;
- Search for food-to-region, region-to-food, users, and related content;
- Recommend via admin curation and later interest-based recommendation;
- Mypage for personal info, posts, liked posts.

Initial product decision:

```text
Do not become a generic SNS.
Keep verified K-food directory as the core.
Add community/user records as a layer.
```

Final framing:

```text
Directory core + Community layer
```

Existing verified data remains important:

- regions;
- foods;
- places;
- routes;
- admin trust workflow;
- reports/audit;
- SEO-friendly public pages.

New top-level navigation direction:

```text
Feed / Search / Recommend / Mypage
```

Existing directory pages should not be discarded. They should be absorbed into:

- Search as trusted reference data;
- Recommend as curation material;
- Feed as tag/link targets;
- Mypage as saved/liked references.

### Community Navigation Documents And First Slice

Documents created:

- `docs/01-product/community-navigation.capability.md`
- `docs/02-architecture/community-navigation-and-ugc.design.md`

First implementation slice:

- Home entry: `Be guest / Sign up / Log in`
- Header: `Feed / Search / Recommend / Mypage`
- `/feed` shell
- `/search` shell
- `/recommend` shell
- `/mypage`
- `/profile` redirected toward `/mypage`
- `Report / Contact` moved to footer
- `/mypage` excluded from robots/sitemap

Commit referenced:

```text
9f14611 feat: add community navigation shell
```

### Additional Problem Found

The thread shows a repeated pattern:

1. user asks for design/planning first;
2. Codex agrees;
3. implementation then proceeds fairly quickly;
4. later user has to re-separate concerns or ask why design/UX was not handled
   earlier.

Decision rule:

For major product shifts, the "design first" rule must mean a real stop point:

```text
design/options
-> Hanbit approval
-> implementation
```

not:

```text
quick design statement
-> immediate implementation
```

## 2026-07-06 Public Auth Reset

Date:

2026-07-06

Request:

Production public member login did not persist on
`https://kfood-commercial-service-web.vercel.app`. After login,
`/auth/session-check` showed no public signed-in hint, access token, refresh
token, or valid server session.

Action:

- Chose Option C: reset public auth to `@supabase/ssr` while leaving admin auth,
  DB migrations, crawler work, and PR `#1` / `feature/design-tokens-v2` out of
  scope.
- Added `@supabase/ssr` to the web workspace.
- Rebuilt `web/lib/public-auth.ts` around Supabase SSR cookies.
- Removed custom public access/refresh-token cookie management from public
  login, join, callback, logout, and proxy refresh flow.
- Kept legacy public cookies only for cleanup and diagnostic visibility.
- Changed the header auth link from `kfood_public_signed_in` hint-cookie logic
  to verified server session logic.
- Kept `/auth/session-check` and updated it to report Supabase SSR auth-cookie
  presence plus legacy cookie presence.

Verification:

```text
npm run check
npm run web:build
```

Both passed locally.

Issue or misjudgment:

Earlier custom public auth cookie handling made the production browser session
state fragile and hard to observe. The header also depended on a readable hint
cookie rather than a verified server session.

Decision rule for next time:

When auth persistence is the active production issue, do not mix in visual
design, admin restructuring, DB migrations, or unrelated feature work in the
same deployment. First stabilize and verify the session boundary, then apply
design-only changes as a separate batch.

Hanbit check items:

Use the production domain after deployment:

```text
https://kfood-commercial-service-web.vercel.app
```

1. Open `/auth/session-check` before login.
2. Log in or create an account.
3. Open `/auth/session-check` immediately after login.
4. Confirm `Supabase SSR auth cookie present: Yes`.
5. Confirm `Server session valid: Yes`.
6. Open `/mypage`.
7. Save display name, bio, and preferred language.
8. Open `/auth/session-check` again.
9. Open `/feed`.
10. Open `/feed/new`.
11. Create a short feed record if the form is available.
12. Open `/auth/session-check` again.

Next action:

After Hanbit confirms production public auth persistence, discuss and apply the
design-only subset from PR `#1` separately. Do not merge PR `#1` wholesale before
auth is stable.

## 2026-07-09 Hanbit Approval For Main Redesign Week 1 And Planning §5

Date:

2026-07-09

Request:

Hanbit asked to approve the current direction and update Markdown records after
reviewing Session 6 changes, planning documents, and PR `#1` merge readiness.

Action:

- Pulled latest `feature/design-tokens-v2`.
- Read:
  - `docs/06-team/session-handoff.md`
  - `docs/06-team/기획정렬-한빛대조.md`
  - `docs/06-team/메인개편-작업계획.md`
- Checked Session 6 diffs separately from the full PR diff.
- Confirmed Session 6 did not change `supabase/`, `.env.example`,
  `web/proxy.ts`, `web/app/auth/**`, `web/lib/public-auth.ts`, or
  `web/lib/admin-auth.ts`.
- Confirmed `platform_settings` key expansion is a string-key use of the
  existing `platform_settings(key, enabled)` table, not a schema or RLS change.
- Confirmed `web/lib/i18n/` is cookie-based UI copy only and does not change
  schema, RLS, environment variables, or URLs.
- Confirmed PR `#1` is `MERGEABLE` and `CLEAN` on GitHub.
- Recorded approval in the three planning/handoff docs.

Verification:

```text
git pull
gh pr view 1 --json number,headRefName,baseRefName,mergeStateStatus,mergeable,url
npm run check
npm run web:build
```

Results:

- PR `#1`: `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`.
- `npm run check`: passed.
- `npm run web:build`: passed. Supabase DNS fetch warnings occurred because of
  the restricted local network, but the build completed through fallback.
- `git diff --check` found trailing whitespace in
  `docs/04-quality/code-analysis-2026-07-08.md`; this is a cleanup item before
  merge, not a functional blocker.

Issue or misjudgment:

The correct approval boundary must distinguish Session 6 from PR `#1` as a
whole. Session 6 has no schema/RLS/env/auth-file change, but PR `#1` as a whole
still contains earlier high-risk work such as migrations `008` to `011`,
auth/session hardening, and `.env.example` updates.

Decision rule for next time:

When approving a broad PR with multiple sessions, always separate:

```text
latest session diff
full PR diff against main
```

Do not describe the whole PR as "schema unchanged" just because the latest
session is schema unchanged.

Hanbit decision:

- §5 agenda 1, 3-month content-site focus: O.
- §5 agenda 2, 3-category IA + 4-section home + SVG map: O.
- Province-to-region mapping for Week 2 map work: **Option A**,
  code mapping table with no schema change.
- §5 agenda 3, Sol-led development and Hanbit security/maintenance/review: O.
- §5 agenda 4, weekly loop: O.
- §5 agenda 5, Vercel Pro at AdSense timing: O / acknowledged.

Next action:

Start Main Redesign Week 2 map work using Option A. Do not change DB schema,
RLS, or production environment variables for this step.

## 2026-07-13 Team Briefing Document And Git State Explanation

Date:

2026-07-13

Request:

Hanbit asked for the current GitHub/project state to be turned into a team
distribution file, then asked what `untracked` means and what it means that four
older Markdown edits are still uncommitted.

Action:

- Created a team briefing document:

```text
docs/06-team/팀-현재상태-개발방향-브리핑.md
```

- The new document summarizes:
  - current branch and PR state,
  - detailed change/new-item table,
  - Hanbit approval/check responsibilities,
  - remaining work order,
  - existing direction vs changed development direction,
  - priority tiers from P0 to P3,
  - code files that future collaborators must understand.
- Explained that `untracked` means the file exists locally but Git is not yet
  tracking it and it will not be included in a commit until explicitly staged
  with `git add`.
- Explained that there are five local changes at this point:
  - four previously modified Markdown files,
  - one newly created untracked briefing document.
- Explained that the new briefing document can be committed alone, or all five
  local document changes can be committed together.

Current local Git state observed:

```text
M docs/06-team/history.md
M docs/06-team/session-handoff.md
M docs/06-team/기획정렬-한빛대조.md
M docs/06-team/메인개편-작업계획.md
?? docs/06-team/팀-현재상태-개발방향-브리핑.md
```

Important context:

- The local branch is `feature/design-tokens-v2`.
- Earlier in the session, remote `origin/feature/design-tokens-v2` was observed
  to be 14 commits ahead of local.
- The latest remote work includes the Main Redesign Week 2 SVG map work.
- The local worktree has not yet been reconciled with those remote commits
  because local Markdown edits should not be overwritten casually.

Verification:

```text
git diff --check -- docs/06-team/팀-현재상태-개발방향-브리핑.md
```

Result:

- The new briefing document passed `git diff --check`.

Issue or misjudgment:

No code issue was introduced. The main operational risk is Git state confusion:
new files, modified files, local-only changes, remote-only changes, commits, and
pushes are easy to conflate.

Decision rule for next time:

Before telling a teammate that something is available on GitHub, confirm it is:

```text
created locally
staged
committed
pushed
```

These are four different states. A local untracked file is not visible to other
teammates through GitHub.

Hanbit check items:

- Decide whether to commit only:

```text
docs/06-team/팀-현재상태-개발방향-브리핑.md
```

- Or commit the full local document batch:

```text
docs/06-team/history.md
docs/06-team/session-handoff.md
docs/06-team/기획정렬-한빛대조.md
docs/06-team/메인개편-작업계획.md
docs/06-team/팀-현재상태-개발방향-브리핑.md
```

Next action:

If Hanbit wants the briefing distributed through GitHub, stage, commit, and push
the chosen file set. Because the local branch is behind the remote branch, fetch
and reconcile remote changes before pushing if necessary.
