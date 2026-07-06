# Community Acquisition Capability

Status: Draft for owner review  
Date: 2026-06-29  
Owner decision needed: Choose the first acquisition experiment and landing path

## 1. Capability Summary

Build a community acquisition path that turns external attention into useful
K-food Service traffic, feedback, and repeatable learning.

This capability is not a generic follower-growth campaign. The goal is to bring
qualified visitors into the product's verified K-food discovery core and the
new community shell:

```text
external community visitor
-> understands the service
-> enters Feed, Search, or Recommend
-> explores verified food/place/route pages
-> leaves feedback, signs up, or remembers the service
```

This capability supports the real service body:

```text
kfood-commercial/web
```

It should not live as a separate marketing bot or disconnected campaign page.

## 2. Why This Matters

The K-food alpha already has public content:

- regions
- foods
- places
- routes
- report/contact/trust pages
- admin workflows

But external community visitors need a different first page from Google search
visitors.

Google search visitors often land on a specific food or place page. Reddit
visitors, Instagram viewers, travel-community members, and K-food fans often
need quick context:

- What is this?
- Why should I trust it?
- Is it useful for Korea travel?
- Should I browse as a guest, search, or sign up?
- What can I click right now: Feed, Search, Recommend, or a verified page?
- What feedback is the builder asking for?

The acquisition path should answer those questions before sending users deeper
into the service.

## 3. Strategic Positioning

The acquisition strategy must reinforce the product direction:

```text
Verified K-food directory core + community layer
```

External campaigns should not position the service as a general SNS. They
should position it as:

```text
trusted K-food discovery with user records attached
```

This matters for revenue conversion. Verified pages and curated
recommendations are the surfaces that can later support ads, affiliate links,
sponsored placements, premium guides, or partner routes. User posts increase
engagement and provide interest signals, but they should lead users back into
verified food, region, place, route, and recommendation content.

## 4. Acquisition Channels

### First Experiment Channel

Reddit remains the recommended first experiment because it supports:

- honest founder/building-in-public feedback
- long-form explanation
- travel and K-food communities
- early qualitative learning before paid growth

### Later Expansion Channels

Keep the strategy open to:

- Instagram
- Threads
- TikTok
- YouTube Shorts
- personal blog or SEO posts
- travel forums
- expat communities
- K-food fan communities
- Korea trip planning groups

Each channel should point to the same product system, not a disconnected
campaign:

```text
/feed
/search
/recommend
/report
/contact
verified detail pages
```

Use UTM parameters for channel attribution.

Examples:

```text
/feed?utm_source=reddit&utm_medium=community&utm_campaign=alpha_feedback_01
/search?utm_source=instagram&utm_medium=social&utm_campaign=food_search_01
/recommend?utm_source=youtube&utm_medium=shorts&utm_campaign=beginner_route_01
```

## 5. Actors

| Actor | Need |
|---|---|
| External community visitor | Understand whether the service helps plan Korean food decisions |
| Reddit traveler | Give thoughtful product feedback and browse useful pages |
| Social viewer | Move from a short-form post into Feed, Search, or Recommend |
| K-food fan | Browse dishes and route ideas without installing an app |
| Founder/operator | Learn what content is missing or unclear |
| Admin/editor | See feedback that can improve public pages |
| Moderator/community | Avoid spammy, misleading, or undisclosed promotion |

## 6. User-Visible Promise

The page should promise:

```text
A practical K-food discovery guide for travelers and K-food fans, currently in
alpha, with verified Seoul-focused foods, places, route ideas, and a growing
community record layer.
```

It should not promise:

- complete Korea-wide coverage
- restaurant booking
- medical, allergy, halal, vegan, or dietary safety guarantees
- real-time opening hours
- official government, Reddit, or moderator endorsement
- fully open social networking
- unmoderated user reviews
- guaranteed recommendation accuracy

## 7. Recommended Entry Paths

Preferred initial route for broad external traffic:

```text
/
```

Why:

- now contains `Be guest / Sign up / Log in`
- explains the directory core plus community layer
- routes users to Feed, Search, and Recommend

Preferred route for community feedback posts:

```text
/feed
```

Why:

- shows the community direction
- supports guest browsing
- can later show user records

Preferred route for search-intent campaigns:

```text
/search
```

Why:

- preserves the verified directory value
- matches "find food by area" or "find area by food" intent

Possible dedicated future route:

```text
/alpha
```

Use `/alpha` only if a dedicated alpha explanation page becomes necessary. For
now, keep channel-specific tracking in UTM parameters instead of creating
Reddit-only or Instagram-only routes.

Example:

```text
/?utm_source=reddit&utm_medium=community&utm_campaign=alpha_feedback_01
```

## 8. Required Acquisition Jobs

Any acquisition landing path must do five jobs:

1. Explain the service in plain English.
2. Show that the current alpha has real content.
3. Send users to Feed, Search, Recommend, or verified pages fast.
4. Ask for specific feedback.
5. Disclose that this is an alpha project connected to the poster.

## 9. Required Content Blocks

Minimum implementation:

```text
Hero
-> Alpha coverage proof
-> Be guest / Sign up / Log in
-> Feed / Search / Recommend paths
-> Verified foods, places, routes proof
-> Why this is different
-> Feedback request
-> Trust/disclosure note
```

Recommended section copy direction:

```text
K-food guide for travelers who do not want another generic restaurant list.
Browse as a guest, search verified foods and areas, and tell us what would make
it useful.
```

## 10. Channel Strategy

### Reddit

Best use:

- feedback request
- trip-planning discussion
- K-food explanation post
- transparent alpha launch post

Landing:

```text
/?utm_source=reddit...
/feed?utm_source=reddit...
/search?utm_source=reddit...
```

### Instagram / Threads

Best use:

- visual food clips
- "what is this dish?" posts
- short area guides
- behind-the-scenes build updates

Landing:

```text
/feed
/search
/foods/[foodSlug]
```

### TikTok / YouTube Shorts

Best use:

- short food explainers
- beginner route ideas
- "K-food before you order" clips

Landing:

```text
/recommend
/routes/[routeSlug]
/foods/[foodSlug]
```

### Blogs / SEO Posts

Best use:

- durable travel planning articles
- food-by-area guides
- beginner K-food explainers

Landing:

```text
/search
/regions/[regionSlug]
/foods/[foodSlug]
```

### Travel and Expat Communities

Best use:

- practical planning feedback
- stale information reports
- missing food/place suggestions

Landing:

```text
/report
/contact
/search
```

## 11. Detailed Reddit Alpha Page Options

The following section is preserved from the original Reddit-specific acquisition
draft. Treat Reddit as the first experiment, not the full acquisition strategy.

The following are 12 distinct design directions. They are intentionally varied
so the owner can choose a mood and conversion strategy before implementation.

### Option 1: Editorial Alpha Brief

Best for:

- serious Reddit feedback post
- trust-first positioning
- explaining the product without hype

Layout:

```text
Large text hero
short alpha explanation
coverage metrics
three exploration links
feedback CTA
trust/disclosure footer block
```

Tone:

```text
We are building a practical K-food guide for travelers. The alpha is Seoul-first.
```

Strengths:

- fastest to implement
- matches current visual system
- least likely to feel like an ad

Risks:

- visually modest
- may not feel exciting enough for social traffic

Use when:

```text
First Reddit pilot asks for feedback and includes one alpha link.
```

### Option 2: Traveler Decision Flow

Best for:

- visitors who arrive with intent but not a specific dish
- explaining the core product promise

Layout:

```text
Hero question: What should I eat in Seoul?
Step 1: Choose an area
Step 2: Pick a dish
Step 3: Open a place or route
Step 4: Send feedback
```

Tone:

```text
Start with a decision, not a directory.
```

Strengths:

- makes the service immediately understandable
- maps directly to product statement

Risks:

- needs careful links to avoid feeling like a fake wizard

Use when:

```text
Reddit post is framed around trip planning.
```

### Option 3: Seoul Food Map Teaser

Best for:

- visual sense of coverage
- showing regions quickly

Layout:

```text
Two-column hero
left: service explanation
right: stylized Seoul area map/list
region cards
route previews
feedback CTA
```

Tone:

```text
Seoul-first, route-aware K-food discovery.
```

Strengths:

- strong visual hook
- reinforces geography

Risks:

- map-like visuals can imply precision if not labeled clearly

Use when:

```text
Target community discusses Korea travel neighborhoods.
```

### Option 4: Dish-First Explorer

Best for:

- K-food fans
- food-specific Reddit communities

Layout:

```text
Hero: Understand Korean dishes before ordering
featured food cards
spice/beginner/context highlights
links to food pages
feedback prompt about missing dishes
```

Tone:

```text
Learn what a dish tastes like, where it fits, and where to try it.
```

Strengths:

- fits K-food communities better than generic travel copy
- can drive users into `/foods`

Risks:

- less effective for route/travel planning users

Use when:

```text
Reddit post asks what dish explanations foreigners need.
```

### Option 5: Trust Gap Explainer

Best for:

- establishing differentiation
- explaining why the service is not another listicle

Layout:

```text
Problem statement
Trust gap checklist
how the service reduces uncertainty
examples: freshness, map links, labels, report path
feedback CTA
```

Tone:

```text
The hard part is not finding Korean food. It is knowing what to trust.
```

Strengths:

- aligns deeply with product definition
- makes feedback more thoughtful

Risks:

- can feel less immediately browseable

Use when:

```text
The post is targeted at experienced travelers or expats.
```

### Option 6: Route Guide Showcase

Best for:

- users planning a day or evening route
- highlighting differentiated route content

Layout:

```text
Hero: Build a simple food route
route cards
area/dish/place chain
sample route timeline
CTA to routes
feedback prompt about route usefulness
```

Tone:

```text
Not just what to eat, but how to put it into a real trip.
```

Strengths:

- highlights a unique product angle
- useful for travel planning

Risks:

- route data must be polished before sending traffic

Use when:

```text
A Reddit post asks about food walks, markets, or first-night plans.
```

### Option 7: Builder Feedback Letter

Best for:

- transparent founder/community tone
- minimizing promotional feel

Layout:

```text
Short letter from builder
what exists today
what needs feedback
links to 3 sample pages
feedback form CTA
disclosure
```

Tone:

```text
I am building this and want honest feedback before making it bigger.
```

Strengths:

- very Reddit-compatible if done sincerely
- disclosure is natural

Risks:

- depends on founder voice
- less polished as product marketing

Use when:

```text
The poster is comfortable speaking as the builder.
```

### Option 8: Comparison Page

Best for:

- showing how this differs from Google Maps, blogs, and listicles

Layout:

```text
Hero
comparison table
K-food taxonomy explanation
examples of labels and report flow
CTA to browse
feedback CTA
```

Tone:

```text
Maps tell you where. We help explain what, why, and how to choose.
```

Strengths:

- clarifies differentiation quickly

Risks:

- must avoid attacking other products

Use when:

```text
Users complain that existing recommendations are fragmented.
```

### Option 9: Minimal Mobile Landing

Best for:

- mobile Reddit traffic
- fast load and low cognitive load

Layout:

```text
single-column hero
4 big links
coverage proof
feedback CTA
short disclosure
```

Tone:

```text
Open, browse, respond.
```

Strengths:

- simplest mobile conversion
- low implementation complexity

Risks:

- less storytelling

Use when:

```text
Most traffic is expected from mobile app browsers.
```

### Option 10: Alpha Coverage Dashboard

Best for:

- showing that real pages already exist
- data-backed confidence

Layout:

```text
coverage metrics
published area/food/place/route sections
recently verified notes
known limitations
feedback CTA
```

Tone:

```text
Here is what the alpha covers, and what it still does not.
```

Strengths:

- transparent
- fits alpha stage well

Risks:

- can feel operational rather than emotional

Use when:

```text
The service wants credibility before broader promotion.
```

### Option 11: Question-Led Landing

Best for:

- Reddit posts that start from a question
- matching visitor intent from the post

Layout:

```text
Hero question
three answer cards:
- what to eat
- where to try it
- how to route it
sample links
feedback question
```

Tone:

```text
Three questions, one guide.
```

Strengths:

- matches the service product statement exactly
- easy to scan

Risks:

- must avoid overpromising completeness

Use when:

```text
The first post title asks what travelers need before choosing K-food.
```

### Option 12: Community Review Board

Best for:

- making feedback the central conversion
- inviting corrections and missing content ideas

Layout:

```text
Hero: Help review this alpha guide
what to review
sample pages
feedback categories
form CTA
what happens with feedback
```

Tone:

```text
Help us make this more useful before wider launch.
```

Strengths:

- honest and community-oriented
- directly supports Reddit pilot

Risks:

- weaker as a general landing page

Use when:

```text
The main campaign goal is learning, not traffic volume.
```

## 12. Reddit Pilot Shortlist

For the first Reddit-driven alpha page, choose one of these three:

| Rank | Option | Why |
|---|---|---|
| 1 | Option 11: Question-Led Landing | Matches the core promise: what to eat, where to try it, how to route it |
| 2 | Option 7: Builder Feedback Letter | Most Reddit-native and transparent |
| 3 | Option 10: Alpha Coverage Dashboard | Best for proving the alpha is real without hype |

Recommended first implementation:

```text
Option 11 with pieces of Option 7 and Option 10.
```

This means:

- use the three-question structure
- include a short builder/alpha disclosure
- include coverage proof
- route users to real pages
- invite feedback

## 13. Current Product Entry Wireframe

Because the current product now has a community shell, the first acquisition
path can use `/` rather than creating `/alpha` immediately.

Recommended `/` acquisition structure:

```text
Header

Hero:
  H1: Find what to eat, where to try it, and how to route it.
  Body: Trusted K-food guidance plus real user records.
  CTA 1: Be guest -> /feed
  CTA 2: Sign up -> /auth/login?next=/mypage
  CTA 3: Log in -> /auth/login?next=/feed

Community path:
  Feed -> user records shell
  Search -> verified foods, areas, places, routes
  Recommend -> curated food and route picks

Coverage proof:
  regions
  foods
  place directions
  routes

Trusted data layer:
  Seoul alpha areas
```

Future dedicated `/alpha` structure if needed:

```text
Header

Hero:
  Eyebrow: Seoul alpha guide
  H1: What should I eat, where should I try it, and how can I route it?
  Body: A K-food discovery guide for travelers, currently Seoul-first.
  CTA 1: Browse the alpha
  CTA 2: Give feedback

Coverage strip:
  23 regions
  30 foods
  30 place directions
  5 routes

Three-question section:
  What should I eat? -> /foods
  Where should I try it? -> /places
  How can I plan a simple food route? -> /routes

Sample paths:
  Seoul area link
  Food link
  Place link
  Route link

Feedback section:
  What would make this useful for your trip?
  CTA -> /alpha-feedback or /report?context=alpha

Disclosure:
  This is an alpha project. The builder is asking for feedback.
  No restaurant has paid for placement unless clearly labeled.
```

## 14. Feedback Form Boundary

The acquisition path should link to a feedback form, but the feedback form can
be implemented in a separate sprint.

Preferred route:

```text
/feedback
```

Acceptable temporary route:

```text
/report
```

Minimum fields:

- page reviewed
- visitor type
- what was useful
- what was missing
- what food/area/place should be added
- optional email
- honeypot

Data recommendation:

```text
Create a separate product_feedback table instead of overloading content_reports.
```

Reason:

- `content_reports` is for stale or incorrect information.
- acquisition feedback is product/marketing learning.
- mixing them can confuse admin operations.

## 15. Channel Link Strategy

Initial Reddit link can point to:

```text
https://kfood-commercial-service-web.vercel.app/?utm_source=reddit&utm_medium=community&utm_campaign=alpha_feedback_01
```

If a dedicated alpha explainer is later created, use:

```text
https://kfood-commercial-service-web.vercel.app/alpha?utm_source=reddit&utm_medium=community&utm_campaign=alpha_feedback_01
```

Do not create separate routes for every channel. Use UTM parameters instead.

## 16. Content And Disclosure Rules

The landing page and external post must:

- disclose that the poster is connected to the project
- avoid pretending to be a neutral user
- avoid mass-posting the same content
- avoid medical, allergy, halal, vegan, or dietary safety guarantees
- avoid claims that restaurant info is real-time
- avoid implying official endorsement

Suggested disclosure:

```text
Disclosure: I am connected to this alpha project and am asking for feedback.
If this kind of post is not appropriate for the community, I will remove it.
```

## 17. Events And Measurement

Minimum manual tracking:

- channel
- post URL
- community or account
- post date
- linked page
- comments received
- feedback submissions
- service changes caused by feedback

Future analytics events:

```text
acquisition_landing_view
acquisition_feed_click
acquisition_search_click
acquisition_recommend_click
acquisition_feedback_click
acquisition_feedback_submit
```

## 18. Acceptance Criteria

The acquisition path is ready when:

- it clearly explains what the service is
- it links to Feed, Search, Recommend, and verified detail pages
- it includes alpha status and disclosure
- it avoids unsupported safety/health claims
- it is mobile friendly
- it has metadata suitable for sharing
- it provides a feedback path
- `npm run check` passes
- `npm run web:build` passes

## 19. Implementation Sequence

Recommended next steps:

1. Use current `/` as the first broad acquisition path.
2. Add or refine feedback CTA using `/report` first.
3. Decide whether `/feedback` or `/alpha` is needed after the first pilot.
4. Add metadata and no misleading claims.
5. Run `npm run check`.
6. Run `npm run web:build`.
7. Deploy.
8. Draft first Reddit or travel-community post.
9. Owner approves exact channel, title, body, link, and disclosure.
10. Manual pilot.
11. Record a retrospective after one week.

## 20. Recommended Owner Choice

My recommendation:

```text
Use the current home/community shell as the first acquisition landing path.
Use Reddit as the first experiment channel.
Keep Option 11 + Option 7 + Option 10 as the fallback dedicated /alpha page
direction if the home page proves too broad.
```

This best serves the first acquisition pilot because it is clear, useful,
honest, and directly connected to the service's current product shape:

```text
Be guest / Sign up / Log in
Feed / Search / Recommend / Mypage
Verified directory core + community layer
```
