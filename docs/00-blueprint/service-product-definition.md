# K-food Service Product Definition

Status: Draft v1.2  
Date: 2026-06-08  
Scope: Real service redesign from the current practice/prototype app

## Product Statement

K-food Service is a web-first, SEO-driven K-food discovery service for foreign
tourists and global K-food fans who want to answer three practical questions:

```text
What should I eat?
Where should I try it?
How can I plan a simple food route around it?
```

The first real product is not a full SNS, AI image app, marketplace, booking
service, or point game. It is a trustworthy public discovery service built
around curated region, food, place, and route pages.

The service should provide:

- searchable K-food information
- region-aware food recommendations
- curated places and route ideas
- mobile-friendly travel UX
- admin-managed editorial content
- clear trust, freshness, sponsored, and affiliate labels
- a path to revenue through ads, affiliate links, sponsored placements, and
  premium guides

## Cross-review Synthesis

This v1.2 combines three product-definition passes:

- Original Codex direction: reset from prototype to public web-first discovery
  service, defer SNS/AI/marketplace/payments.
- Gemini feedback: sharpen the SEO/curation strategy, introduce the Trust Gap,
  narrow launch geography, add stronger admin and freshness controls.
- ChatGPT feedback: expand core page models, SEO requirements, admin MVP,
  revenue priority, and risk controls.

The combined direction is:

```text
Start as a narrow, high-trust K-food directory and route guide.
Earn traffic through useful crawlable pages.
Earn revenue only after trust and content quality are protected.
```

## Current Prototype Interpretation

The current `kfood-commercial/frontend` app is a learning prototype and
reference asset, not the final product requirement.

Useful references:

- Expo/React Native/TypeScript setup
- Expo Router route experience
- home, map/explore, search, ranking, profile, upload, and admin screen patterns
- Supabase-ready service concepts
- legal, deployment, release, and security checklists
- early admin, AI review, and trust/safety concepts

Important reset:

```text
Prototype priority: SNS, AI, gamification, marketplace possibilities.
Real MVP priority: crawlable editorial K-food discovery and route pages.
```

Architecture remains open. The current Expo foundation may be reused only if
`kfood-service-architecture-reset` confirms it can meet SEO, performance,
admin, and deployment requirements. A web-first framework such as Next.js or
Remix may be considered if crawlability and static generation become decisive.

## First Target User

Primary user:

```text
English-speaking foreign tourists planning a Korea trip or already traveling
in Korea who need confident food decisions by region.
```

Initial behavioral assumptions:

- searches through Google, Reddit, Instagram, YouTube, and map apps
- is overwhelmed by fragmented or sponsored recommendations
- wants simple answers while mobile
- values English-friendly explanations, map links, and practical context
- may not understand regional food identity, spice level, ordering norms, or
  tourist accessibility

Secondary later users:

- K-food fans abroad building future travel bucket lists
- expats or Korean locals guiding non-Korean friends
- restaurants or local partners seeking transparent visibility
- internal content editors/admins maintaining K-food data
- tourism organizations or regional partners after traction exists

## Core Problem: The Trust Gap

Foreign visitors often know famous dishes but lack practical, trustworthy,
region-aware guidance at the moment of decision.

The Trust Gap appears when users cannot easily know:

- which dish fits a specific region
- what the dish tastes like
- how spicy or beginner-friendly it is
- whether pork, seafood, alcohol, or common allergens may be involved
- where to try it without relying on random listicles
- whether a place is tourist-friendly, solo-friendly, or group-friendly
- whether the recommendation is editorial, sponsored, or affiliate-linked
- whether the place information is still current

The service should reduce this uncertainty with curated structure, clear labels,
freshness dates, map links, and report paths.

## First MVP Bet

The first MVP bet is:

```text
Curated region -> food -> place -> route pages will create more immediate
and compounding value than a broad social feed.
```

Why this is stronger than launching as a social app:

- discovery pages are useful even with zero users
- each page can become an organic search landing page
- links are natural for travel planning and sharing
- editorial content quality is easier to control
- monetization experiments are easier on public pages
- native mobile can come later after usage patterns are proven

## Initial Launch Geography

Do not attempt nationwide coverage in the MVP.

| Phase | Geography | Exit Criteria |
|---|---|---|
| Alpha | Seoul only, focused on high-tourist areas such as Myeongdong, Hongdae, Gangnam, Jongno, and Gwangjang Market | 20+ foods, 50+ places, 5+ routes, no broken core links, admin update flow works |
| Beta | Seoul + Busan + Jeonju | report issue flow receives and resolves real feedback, SEO pages indexed, analytics events reviewed |
| Public Launch | 5-7 high-value tourist hubs | sitemap and metadata stable, content update loop proven, first monetization test ready |

The MVP should choose content quality over coverage.

## Service Promise

Users can:

- browse K-food by region
- understand representative dishes
- compare taste, spice, beginner friendliness, and practical eating context
- find curated places or simple routes
- open Google Maps and Naver Map links
- search by food, region, place, tag, or travel purpose
- share useful pages
- see freshness, editorial, sponsored, and affiliate labels
- report inaccurate information
- access privacy, terms, contact, report, maps, AI, and UGC policy notices

Admins can:

- manage regions, foods, places, and routes
- publish or hide content
- correct content without code changes
- mark sponsored or affiliate placements
- update last verified dates
- review and resolve user reports
- preserve basic audit history

## Differentiation

The service should differentiate through:

- K-food-specific taxonomy rather than generic restaurant listings
- tourist-facing explanations in English first
- region and route context, not just place cards
- editorial trust and data quality before user-generated scale
- freshness labels and report issue loops
- transparent sponsored and affiliate labeling
- practical mobile web UX for real travel moments
- clean SEO pages that answer long-tail K-food questions

## Launch Surface

Initial launch surface:

```text
Responsive public web service first.
Native app later only after web traction and repeat behavior are proven.
```

Architecture options remain open until `kfood-service-architecture-reset`:

- Option A: harden the current Expo app for web-first launch.
- Option B: rebuild the public web inside the current repo with clearer service
  and page boundaries.
- Option C: split public web now and defer mobile/native app.

The architecture decision must explicitly evaluate:

- SEO crawlability
- static generation or server rendering
- clean URL slugs
- sitemap generation
- mobile performance
- admin productivity
- Supabase integration
- founder maintenance burden

## MVP Feature Scope

### Keep For MVP

- public home/discovery page
- crawlable region pages
- crawlable food pages
- crawlable place pages
- crawlable curated route/guide pages
- search and filters
- mobile web UX
- Google Maps and Naver Map deep links
- trust labels and last verified dates
- report inaccurate info flow
- admin-managed content
- policy/contact/report pages
- Supabase-backed data
- SEO metadata, Open Graph tags, sitemap, robots, canonical URLs
- basic analytics and error monitoring

### Consider After MVP

- user accounts
- saved lists
- user-generated reviews or journals
- ranking and point system
- AI food image analysis
- personalized recommendations
- multilingual expansion beyond English/Korean
- native app store release
- marketplace or seller onboarding
- bookings, payments, coupons, refunds

### Retire Or Defer From Prototype

- SNS feed as the primary product surface
- comments and open UGC before moderation exists
- complex gamification before retention exists
- mock AI analysis screens as user-facing value
- marketplace assumptions before partner demand exists
- broad admin tooling before core content operations are defined
- full native app release before web traction is validated

## Core Page Model

The MVP should be built around four public content types.

### Region Page

Purpose:

- help users understand what to eat in a specific area

Required fields:

- region name, English name, Korean name, slug
- short intro
- hero image
- representative foods
- recommended places
- recommended routes
- best-for tags
- SEO title and description
- Open Graph image

### Food Page

Purpose:

- help users understand a Korean dish and where to try it

Required fields:

- food name
- English name
- Korean name
- romanized name
- description
- taste profile
- spicy level
- beginner-friendly note
- eating guide
- common ingredients or caution notes
- recommended regions
- related places
- related routes
- image
- SEO title and description

Spice levels should use practical benchmarks when possible, for example:

```text
0 none
1 mild
2 Shin Ramyun-like
3 very spicy
4 Buldak-like
```

Dietary and allergy notes must be guidance only, never safety guarantees.

### Place Page

Purpose:

- help users decide whether to visit a specific food place

Required fields:

- place name
- region
- address in Korean and English when available
- representative foods
- short editorial note
- tourist-friendly tags
- solo/group-friendly tags
- English menu/card accepted/near transit hints if verified
- Google Maps link
- Naver Map link
- affiliate or sponsored label when applicable
- last verified date
- report issue link
- SEO title and description

### Route / Guide Page

Purpose:

- help users follow a simple food plan

Required fields:

- route title
- target region
- recommended user type
- estimated duration
- transport mode
- included foods
- included places
- route order
- map links
- editorial note
- share image
- SEO title and description

## Trust System And Labeling Policy

Trust is a core product feature, not decoration.

Visible labels may include:

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
- Report Issue

Trust rule:

```text
Revenue must not hide paid influence inside organic recommendations.
```

Sponsored and affiliate content must be visible, auditable, and separable from
editorial ranking.

Every place page should show a `Last Verified: YYYY-MM-DD` value. If users
report a closure, relocation, wrong map link, or outdated info, the admin flow
must support resolution and verification-date updates.

## Revenue Hypothesis

Revenue should start with low-risk experiments.

Priority order:

1. Display ads on public information pages after traffic exists.
2. Affiliate links for tours, experiences, maps, transport passes, classes, or
   booking partners.
3. Sponsored regional or restaurant placements with visible labels.
4. Premium downloadable or unlockable K-food route guides.
5. Later B2B partner pages for restaurants, local brands, or tourism
   organizations.

Do not build payments, refunds, bookings, coupons, or seller tools in MVP.

Potential revenue ladder:

```text
Traffic -> affiliate experiments -> sponsored placements -> premium guides
```

## Admin MVP

The first admin system should be a founder-friendly content CMS, not a complex
operations suite.

MVP admin features:

- create/edit/publish regions
- create/edit/publish foods
- create/edit/publish places
- create/edit/publish routes
- set featured content
- set sponsored or affiliate labels
- view and resolve user reports
- update last verified dates
- preserve basic audit log entries

Defer:

- user management
- ranking management
- marketplace seller approval
- AI review workflow
- complex moderation queues
- advanced analytics dashboards

Admin design principle:

```text
An operator should be able to correct a closed restaurant, wrong map link,
or outdated note in under two minutes.
```

## SEO Requirements

Because the service is web-first, SEO is a product requirement.

MVP should include:

- static or crawlable URLs for regions, foods, places, and routes
- clean human-readable slugs
- page-level title and meta description
- Open Graph title, description, and image
- sitemap.xml
- robots.txt
- canonical URLs
- structured data where practical
- mobile performance review
- image alt text

Example URL structure:

```text
/
/regions
/regions/seoul
/foods/bibimbap
/places/gwangjang-market
/routes/seoul-street-food-half-day
/search
/about
/contact
/report
/privacy
/terms
```

SEO architecture questions for the next architecture phase:

- Can Expo Web deliver the required crawlability and metadata quality?
- Do public pages need SSG, ISR, SSR, or another rendering strategy?
- Should the public web move to Next.js or Remix while preserving useful
  prototype concepts?
- How will sitemap and metadata be generated from Supabase data?

## Analytics Requirements

MVP analytics should answer:

- which regions, foods, places, and routes get traffic
- which search terms users use
- which map links are clicked
- which report issue reasons appear
- which affiliate links are clicked
- which pages convert to saved/shared/contact actions

Do not overbuild dashboards in MVP. Capture clean events first.

## Non-goals

The first real service will not:

- launch as a full social network
- depend on AI image recognition as the core value
- support payments, refunds, bookings, or coupons
- promise allergy, medical, health, or dietary safety guarantees
- allow unmoderated user-generated content at launch
- expose admin routes publicly
- use OpenAI keys or service-role secrets in client code
- optimize for every city, language, or food category at once
- build full marketplace flows before partner demand is validated
- ship native iOS/Android as the initial launch surface

## Top Risks And Controls

| Risk | Why it matters | Early control |
|---|---|---|
| Scope creep | Prototype has many tempting features | Strict MVP keep/cut list |
| Data quality | Discovery value depends on trustworthy content | Editor-managed content first |
| SEO weakness | Web-first strategy needs search visibility | Static/crawlable URLs, metadata, sitemap, content depth |
| Trust erosion | Ads/sponsorship can weaken recommendations | Clear labels and ranking separation |
| Backend insecurity | Real users require safe data access | Supabase RLS, admin route protection, secret boundaries |
| Founder overload | Non-developer founder should not manage large prompt chains | Small Codex tasks and clear acceptance gates |
| Content decay | Closed or moved places damage trust | Last verified date and report issue flow |
| Architecture mismatch | Current Expo setup may not satisfy SEO needs | Architecture reset before implementation |

## Success Criteria

The product definition is ready when:

- the primary user is English-speaking foreign tourists and K-food fans planning
  Korea food discovery
- the core job is regional K-food discovery and simple route planning
- the first launch surface is web-first unless architecture review rejects it
- the initial launch geography is intentionally narrow
- MVP excludes full SNS, AI analysis, marketplace, payments, native app release,
  and complex points
- revenue starts as ads, affiliate links, sponsored placements, and premium
  guide experiments
- sponsored and affiliate labeling rules are explicit
- SEO, trust signals, freshness controls, analytics, and admin content
  operations are included as core MVP requirements

## Next Skill

Use `kfood-service-mvp-blueprint` next.

The next document should define:

- exact MVP scope
- current prototype keep/cut list
- first route map
- first database schema
- first content model
- first admin model
- SEO requirements
- analytics events
- release sequence
- alpha, beta, and launch exit gates
