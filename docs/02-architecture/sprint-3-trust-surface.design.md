# Sprint 3 Trust Surface Design

Status: Implemented  
Date: 2026-06-10

## Goal

Make the public trust pages alpha-launch ready before expanding real place
content.

The trust surface should help travelers understand:

- how content becomes public
- what alpha content can and cannot guarantee
- how commercial influence will be labeled
- how map links should be used
- how reports and contact paths work
- why user-generated reviews and uploads are deferred

## Options

### Option A: Minimal copy edits

Update only the existing placeholder text.

- Files affected: trust pages only
- Delivery speed: fastest
- Risk: pages still feel incomplete and undiscoverable
- Best fit: internal prototype only

### Option B: Full legal/policy system

Create long-form legal documents, consent surfaces, and policy versioning.

- Files affected: trust pages, data model, admin audit, legal versioning
- Delivery speed: slow
- Risk: overbuilding before monetization, accounts, or analytics exist
- Best fit: production with payments, accounts, and legal review

### Option C: Alpha-ready trust surface

Keep the current page structure, replace placeholder language with practical
alpha launch language, and add footer links for discoverability.

- Files affected: trust pages, root layout, global styles
- Delivery speed: fast
- Risk: still needs final legal review before scaled production
- Best fit: current Sprint 3 stage

Selected: Option C.

## Implemented Scope

Updated:

```text
web/app/editorial-policy/page.tsx
web/app/content-policy/page.tsx
web/app/disclosures/page.tsx
web/app/maps-notice/page.tsx
web/app/privacy/page.tsx
web/app/terms/page.tsx
web/app/report/page.tsx
web/app/contact/page.tsx
web/app/layout.tsx
web/app/globals.css
```

## Policy Contracts

### Editorial

- Public content is curated editorial directory content.
- Draft, hidden, and archived records must stay out of public pages, search, and
  sitemap output.
- Alpha ordering is editorial and should not be presented as popularity ranking.

### Disclosures

- Sponsored content must be visibly labeled.
- Affiliate links must not be hidden.
- Sponsorship cannot remove safety, correction, or map limitation notes.

### Maps

- Map links are guidance, not guarantees.
- Users should confirm hours, closures, and addresses in linked map apps before
  visiting.
- Reports are the correction path for stale map guidance.

### Privacy and Terms

- Alpha notices are acceptable for the current stage.
- Broader production requires fuller privacy and terms coverage before
  analytics expansion, accounts, bookings, payments, advertising, affiliate
  programs, or mobile app release.

### Reports and Contact

- Reports are for stale or incorrect public content.
- Reports are not emergency support, restaurant customer service, or a booking
  desk.
- Optional email is for follow-up only.

## Security and Abuse Notes

Already implemented before this pass:

- report type allowlist
- URL validation
- message length guard
- honeypot field

Still required before public alpha deploy:

- deployed rate limit
- operational review queue process
- admin workflow for resolving or ignoring reports

## Next Workstream

Place candidate seed should start as a reviewable research artifact, not a
published seed insert.

Reason:

- real place data changes often
- individual restaurants require direct verification
- market/street candidates are lower risk but still need map confirmation
- only user-verified items should be promoted to `places`, `place_foods`, and
  `route_guides`
