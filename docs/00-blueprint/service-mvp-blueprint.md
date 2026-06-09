# K-food Service MVP Blueprint

Status: Draft v1.2  
Date: 2026-06-08  
Input: `docs/00-blueprint/service-product-definition.md` v1.2  
Architecture decision: `docs/02-architecture/service-architecture-reset.md`

## Executive Summary

The first real MVP is a web-first, SEO-driven K-food discovery directory for
English-speaking tourists and K-food fans.

The MVP promise is:

```text
Help foreign visitors decide what Korean food to eat, where to try it,
and how to follow simple food routes by region without installing an app.
```

The service should launch as a narrow editorial directory:

```text
Home -> Regions -> Foods -> Places -> Routes/Guides -> Search -> Report/Contact
```

The MVP should not inherit the prototype's SNS, AI, marketplace, native-app, or
complex gamification ambitions. Those are deferred until the service proves:

- search traffic
- content quality
- repeat usage
- trustworthy recommendations
- operational ability to keep data updated

## Core Experience

### Public User Experience

Users should get a useful answer in under 30 seconds:

- what to eat in a region
- where to try it
- how spicy or beginner-friendly it is
- whether the place is editorial, sponsored, affiliate-linked, or outdated
- how to open Google Maps or Naver Map
- how to report stale or incorrect information

No login is required for the public MVP.

### Admin Experience

Admins should be able to maintain content without code changes:

- create and edit regions, foods, places, and routes/guides
- publish or hide content
- update last verified dates
- label sponsored or affiliate content
- review and resolve reports
- record basic audit logs

Operational target:

```text
A common place correction, such as closed place or wrong map link,
should take under two minutes.
```

## MVP Geography

### Alpha: Seoul Only

Launch quality depends on focus. Alpha starts with Seoul and five tourist-heavy
areas.

| Area | Primary audience | K-food identity | Route theme |
|---|---|---|---|
| Myeongdong | first-time tourists | street food, beginner-friendly K-food, familiar BBQ | street food night route |
| Hongdae | Gen Z, solo travelers | trendy cafes, casual pubs, chimaek, budget eats | youth nightlife and casual food route |
| Gangnam | premium seekers | modern K-food, clean K-BBQ, trend-driven dining | trendy and polished dining route |
| Jongno | culture/history travelers | traditional soups, pajeon, old Seoul dishes | old Seoul alley food walk |
| Gwangjang Market | street-food adventurers | bindaetteok, mayak kimbap, market classics | market food exploration route |

### Beta

Expand only after alpha gates pass:

- Busan
- Jeonju

### Public Launch

Public launch should either:

- remain intentionally Seoul-first, or
- expand to 5-7 high-value tourist hubs after SEO and content operations are
  stable.

Do not attempt nationwide coverage in MVP.

## Prototype Keep / Cut / Defer

| Prototype area | MVP decision | Reason |
|---|---|---|
| Home/feed screen | Rebuild as public discovery home | keep entry pattern, remove SNS feed logic |
| Explore/map screen | Keep concept, simplify | map links and regional discovery are core |
| Search screen | Keep concept, redesign | search is a core public utility |
| Region detail route | Keep concept, rebuild | becomes crawlable region page |
| Food detail route | Keep concept, rebuild | becomes crawlable food education page |
| Place detail route | Keep concept, rebuild | becomes conversion and trust page |
| Route/guide concept | Build for MVP | supports travel planning and SEO |
| Journal routes | Defer | UGC/social content is not MVP |
| Upload/create post | Defer | no public UGC at launch |
| Ranking tab | Defer | requires abuse controls and retention data |
| Profile tab | Defer | public MVP should be mostly anonymous |
| Auth screens | Admin only if needed | public users should browse without login |
| Admin screens | Keep concept, rebuild narrowly | founder-friendly CMS is required |
| Mock AI food vision | Defer | cost and trust risk before core value |
| Marketplace/seller services | Defer | partner demand is not validated |
| Gamification services | Defer | retention feature, not discovery MVP |
| Legal/deployment docs | Keep and update | public service needs policies and release discipline |
| Supabase migrations/services | Reuse as reference only | data model must be reset |

## Architecture Commitment

Accepted target:

```text
kfood-commercial/
├── web/        # Next.js public web + admin
├── mobile/     # Expo app, later phase
├── supabase/   # migrations, seed, edge functions
└── packages/
    ├── types/
    ├── data/
    └── config/
```

MVP implementation should use:

- Next.js App Router for `web/`
- Supabase for content, auth, RLS, reports, and audit logs
- shared TypeScript types in `packages/types`
- shared data mappers/query helpers in `packages/data`
- shared route, SEO, trust label, and env constants in `packages/config`

Expo mobile is deferred until web traction and repeat behavior are proven.

## Public Route Map

Recommended MVP public routes:

```text
/
/regions
/regions/[regionSlug]
/foods
/foods/[foodSlug]
/places/[placeSlug]
/routes
/routes/[routeSlug]
/guides
/guides/[guideSlug]
/search
/about
/contact
/report
/privacy
/terms
/content-policy
/maps-notice
/editorial-policy
/disclosures
```

Route note:

- `routes` and `guides` can share the same underlying content model.
- Final naming should be chosen during data model and URL design.
- If only one public term is chosen for MVP, prefer the clearer SEO term after
  keyword research; until then, keep both concepts visible in docs.

## Admin Route Map

Recommended admin routes:

```text
/admin/login
/admin
/admin/regions
/admin/foods
/admin/places
/admin/routes
/admin/reports
/admin/audit-logs
```

Admin requirements:

- public users cannot access `/admin/*`
- only admin role can access admin pages
- service-role keys must never be exposed to client code
- admin mutations must be authorized server-side and protected by Supabase RLS
- publish/hide actions must be explicit
- admin changes should be recorded in audit logs

## Routes To Defer

```text
/journals/[journalId]
/upload
/profile
/ranking
/marketplace
/seller
/ai-food-vision
/user/settings
/user/saved
```

These routes should not be built in the MVP unless a later product decision
explicitly reopens the scope.

## First User Flows

### Flow 1: Discover By Region

```text
Home
-> Regions
-> Seoul
-> representative foods
-> recommended places
-> route guide
-> map link or share
```

Acceptance:

- user can understand what to eat in Seoul within 30 seconds
- page has clear title, summary, representative foods, places, routes, share
  path, and report path
- editorial recommendations are separated from sponsored content

### Flow 2: Understand A Food

```text
Home/Search
-> Food page
-> taste/spice/beginner notes
-> related regions
-> recommended places
-> route guide
```

Acceptance:

- page explains dish context in simple English
- page does not make medical, allergy, or dietary safety guarantees
- related places and routes are visible
- spicy level and beginner-friendly notes are visible

### Flow 3: Decide On A Place

```text
Region/Food/Search
-> Place page
-> editorial note
-> tourist-friendly labels
-> last verified date
-> Google Maps / Naver Map
-> report issue
```

Acceptance:

- user can identify whether the place is editorial, sponsored, or
  affiliate-linked
- Google Maps and Naver Map links work
- stale or incorrect information can be reported
- last verified date is visible

### Flow 4: Follow A Simple Route

```text
Region/Food/Place
-> Route/Guide page
-> route duration
-> ordered places
-> transport mode
-> map links
-> share
```

Acceptance:

- route is simple enough for a tourist to follow without app installation
- each step links to a place page
- each place has a working map link
- duration and transport mode are clear

### Flow 5: Admin Updates Content

```text
Admin login
-> content list
-> edit region/food/place/route
-> publish/hide
-> update last verified date
-> resolve report
```

Acceptance:

- common place correction can be completed in under two minutes
- public users cannot access admin paths
- changes are recorded in a basic audit log

## First Content Model

Detailed DDL belongs in `kfood-service-data-model`. This blueprint defines the
minimum content model and required fields.

### Region

Required:

- id
- slug
- name_en
- name_ko
- intro
- hero_image_url
- seo_title
- seo_description
- best_for_tags
- display_order
- published_status
- created_at
- updated_at

Relations:

- representative foods
- recommended places
- routes/guides

### Food

Required:

- id
- slug
- name_en
- name_ko
- romanized_name
- description
- taste_profile
- spicy_level
- beginner_note
- eating_guide
- caution_note
- image_url
- seo_title
- seo_description
- display_order
- published_status
- created_at
- updated_at

Relations:

- regions
- places
- routes/guides

### Place

Required:

- id
- slug
- name_en
- name_ko
- region_id
- address_ko
- address_en
- editorial_note
- google_maps_url
- naver_maps_url
- image_url
- tourist_tags
- trust_tags
- last_verified_at
- sponsorship_status
- affiliate_url
- published_status
- created_at
- updated_at

Relations:

- foods
- routes/guides
- reports

### Route / Guide

Required:

- id
- slug
- title
- region_id
- summary
- estimated_duration
- transport_mode
- recommended_for_tags
- ordered_place_ids
- editorial_note
- hero_image_url
- seo_title
- seo_description
- published_status
- created_at
- updated_at

Relations:

- region
- foods
- places

### Report

Required:

- id
- page_url
- report_type
- message
- user_email_optional
- status
- admin_note
- created_at
- resolved_at

Recommended report types:

- wrong_information
- closed_place
- broken_map_link
- outdated_information
- sponsorship_concern
- offensive_or_inappropriate
- other

### Audit Log

Required:

- id
- actor_id
- action
- entity_type
- entity_id
- before_data
- after_data
- created_at

## Trust And Monetization Policy

Trust controls are part of the MVP.

Rules:

- sponsored placements must display a visible `Sponsored Placement` label
- affiliate buttons must display partner/affiliate disclosure
- monetized content must not be hidden inside organic ranking
- `last_verified_at` must appear on place pages
- draft/hidden content must not appear in sitemap or public routes

UI labels:

- Editor's Pick
- Tourist Friendly
- Near Transit
- Local Classic
- Beginner Friendly
- Spicy Warning
- English Menu Available
- Card Accepted
- Solo Friendly
- Last Verified
- Sponsored
- Affiliate Link

## Admin MVP

Build:

- admin login
- admin route guard
- content list and edit forms for regions, foods, places, routes/guides
- publish/hide state
- sponsored/affiliate label controls
- last verified date update
- report issue inbox
- basic audit log

Defer:

- public user management
- seller onboarding
- AI review workflow
- advanced analytics dashboard
- ranking controls
- payment management
- booking management

## SEO Requirements

Because the MVP is web-first, SEO is core product scope.

MVP must support:

- clean slugs
- crawlable public routes
- static generation, ISR, or server rendering through Next.js
- page-level title and meta description
- Open Graph title, description, and image
- sitemap.xml generated from published content
- robots.txt
- canonical URLs
- image alt text
- structured data where practical
- mobile performance review
- fast first content load
- share preview validation

Operational SEO architecture:

```text
Supabase published data
-> Next.js server/static rendering
-> generateMetadata
-> sitemap.xml excludes draft/hidden content
-> JSON-LD where practical
```

Structured data targets:

- `LocalBusiness`-like markup for place pages where appropriate
- `Thing` or food-topic markup for food pages where appropriate
- route/guide metadata for guide pages where practical

## Analytics Events

Minimum events:

- `page_view`
- `search_submitted`
- `search_no_results`
- `filter_applied`
- `region_clicked`
- `food_clicked`
- `place_clicked`
- `route_clicked`
- `map_link_clicked`
- `place_map_provider_clicked`
- `report_issue_clicked`
- `content_report_submitted`
- `affiliate_link_clicked`
- `sponsored_impression`
- `share_clicked`

Do not build an advanced dashboard yet. Capture clean events and review them
manually or through a lightweight analytics tool such as GA4, Plausible, or
Umami.

## Sprint Sequence

### Sprint 1: Architecture And Data Decision

Goal:

- formalize the Next.js + Supabase + shared packages direction.

Outputs:

- architecture reset document
- selected stack decision
- data model document
- route map decision
- schema direction
- prototype reuse/retire list

Gate:

- selected stack supports SEO, Supabase, admin, mobile web, and safe deployment.

Status:

- Architecture direction is accepted in
  `docs/02-architecture/service-architecture-reset.md`.

### Sprint 2: Real Data Foundation

Goal:

- create the minimum real backend for public content.

Outputs:

- Supabase schema or schema plan
- seed content for Seoul alpha
- service contracts for regions, foods, places, routes/guides
- published/draft data status model
- report table/model
- audit log model

Gate:

- public pages can read real or staging data through services
- hidden/draft content is not publicly visible

### Sprint 3: Public Directory Alpha

Goal:

- build crawlable public pages for Seoul alpha.

Outputs:

- home
- region listing
- region detail
- food listing
- food detail
- place detail
- route/guide detail
- search
- policy/contact/report/disclosure pages

Internal alpha content gate:

- 10+ foods
- 20+ places
- 3+ routes/guides
- all core links work
- all map links work
- all pages have basic SEO metadata

### Sprint 4: Admin CMS Alpha

Goal:

- allow founder/operator to update core content.

Outputs:

- admin login/guard
- region editing
- food editing
- place editing
- route/guide editing
- report issue inbox
- last verified update
- basic audit log

Gate:

- common place correction can be completed in under two minutes
- publish/hide works
- sponsored/affiliate labels can be edited

### Sprint 5: Beta Readiness

Goal:

- harden public web for limited external users.

Outputs:

- SEO metadata
- sitemap/robots/canonical
- analytics events
- error monitoring
- mobile web QA
- security review
- content QA checklist

Private beta content gate:

- 20+ foods
- 50+ places
- 5+ routes/guides
- report issue flow works
- analytics events are captured

### Sprint 6: Monetization Prep

Goal:

- prepare but do not overbuild revenue experiments.

Outputs:

- affiliate link field
- sponsored label field
- disclosure page
- editorial policy page
- premium guide hypothesis
- monetized content display rules

Gate:

- monetized content is visibly labeled
- sponsored content is separated from editorial ranking
- affiliate outbound clicks can be tracked

## Release Gates

### Alpha Gate

- Seoul-only content is enough to test the service.
- public pages render from structured data.
- admin can update content.
- policy/contact/report/disclosure pages exist.
- no service-role, OpenAI, or private API secrets exist in client code.
- all core routes are reachable.
- map links work on mobile web.

### Beta Gate

- SEO metadata and sitemap are verified.
- report issue flow works.
- analytics events are captured.
- Supabase RLS/admin access is reviewed.
- mobile web UX is usable.
- 20+ foods, 50+ places, and 5+ routes/guides are ready.
- external users can test without account creation.

### Public Launch Gate

- 5-7 high-value tourist hubs are ready, or launch positioning is intentionally
  Seoul-first.
- deployment and rollback are documented.
- monitoring is active.
- trust labels and sponsored/affiliate labels are visible.
- first monetization experiment is defined.
- monetized content is not hidden in organic ranking.
- legal, privacy, terms, content policy, maps notice, editorial policy, and
  disclosure pages are published.

## Success Criteria

The MVP blueprint is ready when:

- kept features map directly to the product statement
- deferred prototype features are explicit
- first public routes are named
- first admin routes are named
- first content model is clear enough for data modeling
- SEO requirements are treated as core requirements
- alpha, beta, and public launch gates are observable
- next skill is `kfood-service-data-model`

## Next Skill

Use `kfood-service-data-model` next.

The next document must define:

- exact Supabase/Postgres schema
- table relationships
- publication/draft rules
- RLS policy matrix
- seed data plan for Seoul alpha
- report and audit log lifecycle
- sponsored/affiliate fields
- shared TypeScript types for `packages/types`
