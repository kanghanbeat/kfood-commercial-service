# Community Shell UX Design Review

Status: Draft for owner review  
Date: 2026-06-29  
Scope: `/`, `/feed`, `/search`, `/recommend`, `/mypage`, public header/footer

Owner decision update:

- Home guest entry uses a combined path: guests can start from trusted Search
  or preview Feed instead of being forced into one route.
- Signed-out header shows `Feed / Search / Recommend / Log in`; `Mypage`
  appears after sign-in.
- Feed shows a clearly labeled sample record structure before real uploads are
  enabled.
- Search uses preview UI and intent cards instead of a disabled input.
- Footer links are grouped into Support, Trust, and Legal.

## 1. Purpose

Review and redesign the visible community shell before adding deeper data
features such as profile editing, user posts, likes, follows, image uploads, or
recommendation ranking.

The current shell has the correct product direction:

```text
Feed / Search / Recommend / Mypage
Be guest / Sign up / Log in
Directory core + community layer
```

But it still reads more like a functional scaffold than a finished service. The
next UI pass should make the product easier to understand on first contact.

## 2. UX Principle

Design should reinforce the strategic product model:

```text
Verified K-food information platform
+ user records/community layer
```

The service should not feel like a generic social feed. It should feel like a
trusted K-food guide where user records add lived context.

## 3. Current UX Issues

### Home

Current strengths:

- entry actions exist
- verified coverage metrics exist
- directory/community positioning is present

Current issues:

- `Be guest`, `Sign up`, and `Log in` are not explained enough
- the hero still feels mostly like the old directory product
- the route visual does not clearly communicate community or search/recommend
  pathways
- first-time users may not know whether to start with Feed, Search, or
  Recommend

### Feed

Current strengths:

- clearly says posting/likes/follows are behind login and moderation
- does not overpromise live UGC yet

Current issues:

- looks like a text placeholder, not a future feed
- no sample card structure for verified food/area/place labels
- language/search/write controls are text chips rather than real controls
- no visual hierarchy between guest browsing and logged-in actions

### Search

Current strengths:

- keeps verified directory data visible
- provides Foods/Areas/Places/Routes entry points

Current issues:

- disabled search input can feel broken
- no tab structure yet
- does not visually explain food-to-area and area-to-food search
- user/post search is mentioned but not represented

### Recommend

Current strengths:

- uses existing foods and routes
- keeps personalization deferred

Current issues:

- does not yet feel curated enough
- no recommendation categories beyond food and route sections
- lacks labels for editorial/sponsored/future interest-based recommendations
- route list looks operational rather than inspirational

### Mypage

Current strengths:

- requires login
- shows account details
- points to future activity sections

Current issues:

- account details dominate the page
- not yet an activity hub
- no profile summary, language preference, or section cards
- next features are described in prose instead of dashboard structure

### Header/Footer

Current strengths:

- top navigation is simple
- Report/Contact moved out of primary navigation
- admin navigation remains separate

Current issues:

- `Log in` appears next to `Mypage`; signed-out users may wonder why both exist
- no language selector location yet
- footer trust links are functional but not grouped

## 4. Target User Flow

### First Visit

```text
Open /
-> understand the service in one sentence
-> choose Be guest, Sign up, or Log in
-> guest lands in Feed or Search
-> user sees verified data pathways, not an empty SNS
```

### Guest Browsing

```text
Feed = see future community record structure
Search = use verified food/area/place/route discovery
Recommend = browse curated picks and routes
Mypage = login required
```

### Logged-In Use

```text
Mypage = profile, language, activity hub
Feed = write record later
Search = discover and connect records later
Recommend = personalized later
```

## 5. Home Redesign Direction

Recommended first viewport:

```text
Left:
  service promise
  short explanation of verified guide + user records
  three entry buttons with helper text

Right:
  structured start panel:
    Be guest -> browse Feed/Search
    Sign up -> keep records/likes/follows later
    Log in -> continue existing account
```

Keep coverage metrics below the first viewport.

Improve button copy:

```text
Be guest
Browse without an account

Sign up
Create your K-food activity hub

Log in
Continue with your account
```

Recommended visual role:

- home should feel like the service gateway
- not a marketing landing page
- not a generic SNS splash

## 6. Feed Redesign Direction

Feed should show the shape of future posts even before upload is enabled.

Recommended layout:

```text
Top utility row:
  Language selector
  Search records input
  Write record button

Tabs:
  All
  Following
  Popular

Feed card prototype:
  image placeholder
  user display name placeholder
  linked verified food label
  linked area/place label
  record text
  like/follow/report actions disabled or signed-in gated
```

Important label pattern:

```text
Verified food
Area guide
User record
```

This prevents Feed from looking like unverified restaurant review content.

## 7. Search Redesign Direction

Search should feel like an exploration engine, not a list of links.

Recommended layout:

```text
Search input
Filter tabs:
  All / Foods / Areas / Places / Posts / Users

Intent cards:
  Food -> Area
  Area -> Food
  Place lookup
  User/Post search

Verified directory cards:
  Foods
  Areas
  Places
  Routes
```

Disabled search inputs should be avoided if possible. If live search is not
ready, make the search field a visual preview with clear copy:

```text
Search preview. Live search comes after the search index is connected.
```

## 8. Recommend Redesign Direction

Recommend should feel curated and editorial.

Recommended sections:

```text
Editor's picks
Beginner friendly
By area
Food mood
Routes
Later: based on your interests
```

Each recommendation card should show:

```text
recommendation type
verified entity
why it is recommended
disclosure label if sponsored/affiliate later
```

Route cards should be more visual and action-oriented than the current list.

## 9. Mypage Redesign Direction

Mypage should become a dashboard, not only an account details page.

Recommended layout:

```text
Profile summary
Edit profile form
Language preference
Activity cards:
  My records
  Liked posts
  Following
Account actions
```

For the next implementation sprint, the design should support:

```text
display_name
bio
preferred_language
```

Do not include avatar UI yet.

## 10. Header/Footer Rules

Primary header:

```text
Feed
Search
Recommend
Mypage
Log in or Mypage state
Language selector later
```

Potential issue:

If both `Mypage` and `Log in` appear while signed out, the header can feel
duplicative. Possible solutions:

### Option A

Keep both for now. `/mypage` intentionally routes signed-out users to login.

### Option B

Show `Mypage` only when signed in. Show `Log in` when signed out.

### Option C

Keep `Mypage` as primary nav, but rename auth link to `Account`.

Recommendation: Option B for clarity after public auth is stable.

Footer grouping:

```text
Support: Report / Contact
Trust: Editorial Policy / Content Policy / Disclosures / Maps Notice
Legal: Privacy / Terms
```

## 11. Mobile Rules

Mobile first checks:

- entry buttons stack cleanly
- top nav wraps without crowding
- Feed utility row stacks
- Search tabs remain tappable
- cards have consistent spacing
- no button text overflows
- route visual does not dominate first viewport

Avoid:

- huge headings inside compact cards
- dense card grids before the user understands the page
- disabled controls that look broken

## 12. Visual System Direction

Keep the current restrained editorial style, but add more product-specific
components:

```text
entry-choice card
feed-record card
search-intent card
recommendation card
profile-dashboard card
verified label
user record label
language selector
```

Palette should remain trust-oriented and not become a one-note social app look.
Use the existing accent/leaf/gold system sparingly:

- accent: primary action
- leaf: verified/trust label
- gold: recommendation/editorial label

## 13. Implementation Priority

Recommended implementation after owner review:

```text
1. Home entry UX polish
2. Feed card prototype and utility row
3. Search tabs and intent cards
4. Recommend curated card system
5. Mypage dashboard layout
6. Footer grouping
7. Header auth/nav refinement
```

Do not implement database changes in this UX pass.

## 14. Acceptance Criteria

The design pass is acceptable when:

- first-time users understand the three entry choices
- Feed looks like a future record feed, not a placeholder page
- Search explains food-area-place-user-post discovery
- Recommend feels curated and trustworthy
- Mypage looks like an activity hub
- existing verified directory value remains visible
- mobile layout is readable
- no new Supabase schema is required

## 15. Owner Decisions Needed

Before implementation, confirm:

1. Should `Be guest` route to `/feed` or `/search`?
2. Should signed-out header show both `Mypage` and `Log in`, or only `Log in`?
3. Should Feed show prototype/sample cards before real posts exist?
4. Should Search input stay disabled, or become a preview/search-like UI?
5. Should footer links be visually grouped into Support/Trust/Legal?
