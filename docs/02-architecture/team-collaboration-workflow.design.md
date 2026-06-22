# Team Collaboration Workflow Design

Status: Accepted  
Date: 2026-06-22

## Context

The project is moving from solo development to GitHub-based team
collaboration. The repository already contains a deployed Next.js alpha,
Supabase migrations, admin workflows, release docs, and quality reports. The
team needs a workflow that protects the deployed alpha while still allowing
fast iteration.

## Options

### Option A: Documentation Only

Add onboarding docs and keep the current direct-to-main workflow.

Tradeoffs:

- Fastest to start.
- Low process overhead.
- High risk of accidental deploy regressions.
- Hard for new teammates to understand what was verified.

### Option B: Strict Enterprise Workflow

Require issue assignment, protected branches, mandatory reviewers, CI checks,
and release approvals before every merge.

Tradeoffs:

- Strongest safety model.
- Good for larger teams.
- Too heavy for the current early alpha stage.
- Slows down content and small trust-surface improvements.

### Option C: Pragmatic GitHub Collaboration

Keep `main` deployable, use short-lived branches and pull requests, add clear
team docs, use PR templates, and require manual verification notes for risky
areas.

Tradeoffs:

- Good balance of speed and safety.
- Easy for a small team to adopt.
- Leaves room to add branch protection and CI later.
- Requires discipline from contributors when marking verification.

## Decision

Choose Option C.

## Required Artifacts

- `README.md`: current project status, commands, deployment links, doc map.
- `CONTRIBUTING.md`: branch, PR, Supabase, content, and security rules.
- `.github/pull_request_template.md`: shared review checklist.
- `docs/06-team/team-onboarding.md`: first-read guide for new teammates.
- `docs/06-team/team-working-agreement.md`: team rules and definition of done.
- `.gitignore`: keep separated crawling files out of active service commits.

## Selected Workflow

```text
sync main
create branch
make small change
run checks
open pull request
review
merge
verify deployment if production changed
```

## Risk Controls

- High-risk changes need explicit owner review.
- RLS, auth, reports, admin writes, audit logs, and env vars require manual
  verification notes.
- Production fallback data remains disabled.
- Crawling remains separated until intentionally reintroduced.

## Future Improvements

- Add GitHub branch protection for `main`.
- Add CI for `npm run check` and `npm run web:build`.
- Add issue templates for content verification and bug reports.
- Add CODEOWNERS when team ownership is clear.
