# Community Navigation and UGC Architecture Design

Status: Draft for owner review  
Date: 2026-06-29  
Related capability:
`docs/01-product/community-navigation.capability.md`

## 1. Context

The current production alpha is a Next.js public web service backed by
Supabase. It has:

- public curated pages for regions, foods, places, and routes
- public auth foundation
- admin/editor auth
- report/contact/trust pages
- admin workflows for places, reports, audit logs, and content operations

The requested next direction adds:

- `Feed`
- `Search`
- `Recommend`
- `Mypage`
- first entry choices: `Be guest / Sign up / Log in`
- translation for Korean, Chinese, English, Japanese, and later more languages
- user photo/place uploads
- likes
- follows
- user search
- interest-based recommendations

This is an architectural expansion, not a small UI change.

The expansion should not turn the product into a general SNS. The architecture
must preserve the verified directory as the monetizable and trustworthy core,
then attach user-generated records as a controlled community layer.

## 2. Key Decision

Adopt a four-item public navigation:

```text
Feed / Search / Recommend / Mypage
```

Keep curated directory routes as underlying crawlable pages and data sources:

```text
/regions
/foods
/places
/routes
```

But stop treating them as primary user navigation after the community navigation
rollout.

Keep the data hierarchy explicit:

```text
Verified directory data
-> powers search, recommendations, SEO, monetization, and trust

User-generated records
-> add engagement, lived context, and interest signals
```

Do not allow user posts to become the only source for food/place claims. Public
UI should visually distinguish verified content, user records, sponsored
placements, and machine-translated text.

## 3. Architecture Options

### Option A: Minimal UI Re-label

Only add the new menu items and route users to existing pages.

Pros:

- fastest
- low database impact

Cons:

- Feed/Mypage would be fake shells
- upload, likes, follows, and recommendations remain undefined
- high risk of confusing users

### Option B: Full Community Platform First

Build all UGC tables, storage, likes, follows, search, translation, and
recommendation logic before changing navigation.

Pros:

- clean conceptual launch
- fewer temporary UI states

Cons:

- too large for the current stage
- high security and moderation risk
- delays visible progress
- risks over-centering SNS mechanics before the verified content engine is
  mature

### Option C: Staged Community Shell with Trusted Data Core

First ship the navigation and entry model, then add UGC and recommendation
capabilities in controlled slices.

Pros:

- preserves the stable directory
- protects monetization-critical verified pages
- lets users understand the new product direction early
- keeps UGC and storage behind a separate security gate
- avoids overbuilding recommendations before behavior data exists

Cons:

- some early pages will be shells or curated-only
- requires careful copy to avoid overpromising

Recommendation: Option C.

## 4. Route Plan

Public primary routes:

```text
/feed
/search
/recommend
/mypage
```

Supporting auth/entry routes:

```text
/start
/auth/login
/auth/callback
/auth/update-password
/auth/logout
```

Existing routes remain:

```text
/regions
/regions/[regionSlug]
/foods
/foods/[foodSlug]
/places
/places/[placeSlug]
/routes
/routes/[routeSlug]
```

Recommended behavior:

- `/` becomes the service landing/entry surface.
- show `Be guest / Sign up / Log in` for first-time or signed-out users.
- `Be guest` goes to `/feed` or `/search` with no account.
- `Sign up` and `Log in` route through `/auth/login`.
- `/profile` redirects to `/mypage` after the migration.

## 5. Navigation Implementation

Current header should change from:

```text
Regions / Foods / Places / Routes / Report / Contact / Sign in
```

To:

```text
Feed / Search / Recommend / Mypage
```

Footer can keep trust/support links:

```text
Report
Contact
Editorial Policy
Content Policy
Disclosures
Maps Notice
Privacy
Terms
```

Admin navigation remains separate under `/admin`.

## 6. Data Model Additions

Design rule:

```text
UGC tables reference verified entities; they do not replace them.
```

Where possible, user content should link to existing `regions`, `foods`,
`places`, and `route_guides`. This lets Feed activity strengthen Search and
Recommend instead of fragmenting the product into disconnected posts.

### Profiles Extension

Existing `profiles` should be extended gradually:

```text
username
bio
preferred_language
home_region_id nullable
public_profile_enabled
```

Do not add `avatar_url` in the Mypage profile stage. Profile images should be
designed later with user post image upload, storage policy, moderation, and
deletion rules.

### User Posts

```sql
user_posts
- id uuid primary key
- user_id uuid references auth.users(id)
- title text
- body text
- location_name text
- region_id uuid nullable
- food_id uuid nullable
- place_id uuid nullable
- visibility text -- public/private/unlisted
- status text -- draft/published/hidden/removed
- language text
- source_type text -- user_record/admin_seed/imported
- verified_entity_confidence text -- linked/unlinked/admin_reviewed
- created_at timestamptz
- updated_at timestamptz
```

`source_type` and `verified_entity_confidence` are optional in the first
migration, but the concept should be preserved in implementation. The UI must
not imply that a user post has the same authority as an admin-verified place or
food page.

### Post Images

```sql
post_images
- id uuid primary key
- post_id uuid references user_posts(id)
- user_id uuid references auth.users(id)
- storage_path text
- alt_text text
- sort_order integer
- created_at timestamptz
```

### Likes

```sql
post_likes
- post_id uuid references user_posts(id)
- user_id uuid references auth.users(id)
- created_at timestamptz
- primary key (post_id, user_id)
```

### Follows

```sql
user_follows
- follower_id uuid references auth.users(id)
- following_id uuid references auth.users(id)
- created_at timestamptz
- primary key (follower_id, following_id)
```

### Recommendations

```sql
recommendation_collections
- id uuid primary key
- slug text unique
- title text
- summary text
- status publication_status
- sort_order integer
- created_by uuid nullable
- created_at timestamptz
- updated_at timestamptz

recommendation_items
- id uuid primary key
- collection_id uuid references recommendation_collections(id)
- entity_type text -- food/region/place/route/post
- entity_id uuid nullable
- external_url text nullable
- title text nullable
- summary text nullable
- sort_order integer
```

### Post Reports

Either extend existing report tables or add:

```sql
post_reports
- id uuid primary key
- post_id uuid references user_posts(id)
- reporter_id uuid nullable
- reason text
- message text
- status report_status
- created_at timestamptz
- reviewed_by uuid nullable
- reviewed_at timestamptz nullable
```

## 7. Storage Architecture

Add bucket:

```text
user-post-images
```

Policies:

- authenticated users can upload into their own prefix
- users can read images for published public posts
- users can delete their own unmoderated images
- admins/editors can moderate or remove images through service logic

Example storage path:

```text
user-post-images/{user_id}/{post_id}/{image_id}.jpg
```

## 8. RLS Direction

Required RLS principles:

- public can read only `status = 'published'` and `visibility = 'public'`
- user can create posts only for `auth.uid()`
- user can update/delete own draft or published posts unless locked by
  moderation
- user can like/follow only as self
- user cannot create another user's profile, likes, follows, posts, or images
- admin/editor can read moderation queues
- admin/editor can hide/remove posts through controlled operations

Do not use service role keys in public routes.

## 9. Translation Architecture

### Phase 1: UI Dictionaries

Files:

```text
web/lib/i18n.ts
web/components/language-switcher.tsx
```

Language source:

- query param for quick switching
- cookie for guest session
- `profiles.preferred_language` for logged-in users

### Phase 2: Curated Content Locales

Use structured localized fields or translation tables.

Pragmatic starting point:

```text
name_en
name_ko
name_ja
name_zh
summary_en
summary_ko
summary_ja
summary_zh
```

Long-term option:

```text
content_translations(entity_type, entity_id, locale, fields jsonb)
```

### Phase 3: User Post Translation

Do not launch automatic post translation until:

- cost is understood
- user privacy policy is updated
- translated text is labeled as machine-generated
- report flow supports translation errors

## 10. Search Architecture

Phase 1:

- server-side Supabase queries
- `ilike` search across curated foods, regions, places, posts, and user profiles
- tabbed results
- verified results should appear before user-generated records when relevance is
  similar

Phase 2:

- Postgres full-text search
- weighted ranking
- language-aware search fields

Phase 3:

- embeddings or recommendation engine only after enough data exists

## 11. Recommend Architecture

Phase 1:

- admin-curated recommendation collections
- route and food/place/entity references
- explicit labels for editorial, sponsored, affiliate, and user-signal-assisted
  recommendations

Phase 2:

- simple interest matching:
  - liked foods
  - liked posts
  - followed users
  - preferred language
  - selected area

Phase 3:

- behavior-based ranking
- sponsored/affiliate separation
- explainable recommendation labels

Recommendation ranking should not be driven by likes/follows alone. Likes and
follows can be signals, but verified content quality, editorial intent,
freshness, and disclosure labels must remain first-class ranking inputs.

## 12. Monetization Architecture

The most direct monetization surfaces remain verified and curated pages:

```text
food pages
region pages
place pages
route pages
recommendation collections
premium guide surfaces
```

UGC supports these surfaces by creating:

- session depth
- return visits
- interest signals
- real-world context around verified entities
- early demand signals for missing content

The technical architecture should therefore keep clear foreign keys or link
tables between user posts and verified entities:

```text
post_foods
post_regions
post_places
post_routes
```

These may be deferred until after the first shell, but the first post schema
should not block this direction.

## 13. Page Implementation Slices

### Slice 1: Navigation and Entry

Files likely touched:

```text
web/app/page.tsx
web/app/layout.tsx
web/app/auth/login/page.tsx
web/app/profile/page.tsx
web/app/mypage/page.tsx
web/app/feed/page.tsx
web/app/search/page.tsx
web/app/recommend/page.tsx
```

Outcome:

- user sees `Be guest / Sign up / Log in`
- primary nav shows four community items
- existing directory is linked from Search/Recommend

### Slice 2: Mypage Profile

Outcome:

- `/mypage` replaces `/profile`
- preferred language and basic profile state are visible

### Slice 3: Feed Read Shell

Outcome:

- `/feed` renders public/community records shell
- no upload until DB/storage is ready
- feed cards reserve space for linked food/region/place labels

### Slice 4: UGC Database and Storage

Outcome:

- migrations
- storage bucket
- RLS tests
- admin moderation design

### Slice 5: Record Creation

Outcome:

- logged-in users can create posts
- image upload works
- moderation/report path exists

### Slice 6: Search and Recommend Expansion

Outcome:

- unified search
- admin-curated recommendations
- verified results and recommendation disclosures remain visible

## 14. Security Review Trigger

Run a security review before launching any of:

- image upload
- public post creation
- likes/follows
- user profile search
- automatic translation
- interest-based recommendations

Required review areas:

- storage RLS
- file type/size validation
- abuse and spam
- profile privacy
- post reporting
- moderation audit
- account deletion
- minors/portrait-rights/photo policy
- incorrect user claims about places, ingredients, prices, or safety

## 15. Rollback Strategy

Navigation/entry changes:

- can be rolled back by restoring old header links and `/profile` route.

UGC changes:

- should be hidden behind route-level and database status controls.
- if abuse appears, disable post creation while keeping read-only curated pages.
- verified directory and recommendation pages must remain usable if Feed is
  disabled.

Recommended feature flag:

```text
NEXT_PUBLIC_ENABLE_COMMUNITY_SHELL
NEXT_PUBLIC_ENABLE_USER_POSTING
```

## 16. Open Decisions

Owner should confirm before implementation:

1. Should `/` default to entry choices or show the current discovery hero with
   entry choices embedded?
2. Should `Be guest` route to `/feed` or `/search`?
3. Should `/profile` redirect to `/mypage` immediately?
4. Should user posts require admin approval before public display, or use
   publish-now plus report/hide moderation?
5. Should translation Phase 1 include only navigation/UI, or also curated food
   names and summaries?
6. Should Feed cards require at least one verified food/region/place tag before
   public posting?
7. Should unlinked user posts be allowed at all, or saved only as private
   records until linked?

## 17. Recommendation

Proceed with Option C:

```text
Staged Community Shell with Trusted Data Core
```

First implementation should not build uploads yet. It should make the new
product shape visible:

```text
/ -> Be guest / Sign up / Log in
Feed / Search / Recommend / Mypage navigation
Search/Recommend reuse existing curated content
Mypage absorbs profile
```

Only after that should database/storage work for user records begin.

Strategic guardrail:

```text
Build community features to strengthen verified K-food discovery and revenue
conversion, not to replace the product with a general social feed.
```
