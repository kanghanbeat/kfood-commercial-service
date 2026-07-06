# Community Navigation Capability

Status: Draft for owner review  
Date: 2026-06-29  
Scope: Community-oriented navigation, guest entry, translation, feed, search,
recommendation, and mypage direction

## 1. Capability Summary

Evolve K-food Service from a curated discovery directory into a community-aware
K-food experience while keeping the top navigation simple:

```text
Feed / Search / Recommend / Mypage
```

The existing curated directory remains valuable. It should not disappear.
Instead, `regions`, `foods`, `places`, and `routes` become the trusted data
layer behind search, recommendations, feed tagging, and user records.

The new user-facing promise is:

```text
Browse verified K-food guidance, see real user food records, and keep your own
K-food activity connected across languages.
```

## 2. Strategic Positioning

This is not a pivot into a general SNS.

The product should remain a trustworthy K-food information platform and add
community posting as an engagement layer:

```text
Verified K-food information = trust, search traffic, and monetization surface
User records = engagement, freshness signals, and interest data
```

The business reason for this direction is that verified food, region, place,
route, and recommendation pages are easier to monetize than an unstructured
social feed. Community posts should increase usefulness and repeat visits, but
they should not replace the editorial information layer.

Recommended service model:

```text
Directory core + community layer
```

Not:

```text
General food SNS
```

## 3. Product Direction

Current product identity:

```text
Curated K-food discovery service for trustworthy regions, foods, places, and
routes.
```

Next product identity:

```text
K-food discovery + user daily records, grounded in verified food/place data.
```

This avoids becoming a generic SNS. User posts should be connected to verified
or structured service data:

- foods
- regions
- places
- routes or recommendation contexts
- language and translation needs
- trust and moderation controls

The editorial layer remains the primary source of truth. User posts provide
real-life context, but the service should continue to distinguish:

```text
Admin/editor verified information
User-generated records
Sponsored or affiliate placements
Machine translated content
```

## 4. Monetization Logic

The community layer should support revenue conversion, not distract from it.

Primary monetizable surfaces:

- verified food pages
- verified region pages
- verified place pages
- curated route pages
- admin-curated recommendation collections
- premium guides or partner placements later

Community posts support monetization indirectly by:

- increasing session depth and return visits
- showing real user context around verified foods and places
- producing interest signals for recommendations
- creating shareable entry points into verified pages
- helping admins identify missing or stale content

This means the Feed should link back into the verified data model whenever
possible:

```text
post -> food
post -> region
post -> place
post -> route/recommendation context
```

## 5. First Entry Experience

When a first-time visitor opens the service, show a lightweight entry choice:

```text
Be guest
Sign up
Log in
```

### Be Guest

User can browse without friction.

Allowed:

- view Feed public posts
- use Search
- view Recommend
- open curated food, region, place, and route pages
- change UI language for the session

Restricted until login:

- create records
- like posts
- follow users
- save preferences
- manage profile

### Sign Up

User creates or connects a public account.

Initial providers:

- Google
- Kakao
- later: email/password if needed

After sign-up, route to:

```text
/mypage
```

### Log In

Existing users authenticate and continue.

After login:

- if a `next` path exists, continue there
- otherwise route to `/feed` or `/mypage`

## 6. Top Navigation Contract

Keep the primary navigation small:

```text
Feed
Search
Recommend
Mypage
```

Do not keep `Regions / Foods / Places / Routes` as primary top-level links after
the community navigation shift. They remain available inside Search and
Recommend.

Recommended mapping:

| Existing Surface | New Location |
|---|---|
| `/regions` | Search: Areas tab |
| `/foods` | Search: Foods tab |
| `/places` | Search: Places tab |
| `/routes` | Recommend: Routes/Itineraries section |
| `/profile` | Redirect or migrate to `/mypage` |
| `/report` | Linked from post/place actions and footer |
| `/contact` | Footer/support surface |

## 7. Feed Capability

Feed is the home for user food records.

Feed is not the source of truth for food or place facts. It is an experience
surface that should point users back to verified foods, regions, places, and
routes when relevant.

Primary jobs:

1. Show public user uploads.
2. Let logged-in users create a record.
3. Let users like posts.
4. Let users follow authors.
5. Let users report problematic posts.
6. Keep language/search controls visible.

Feed top controls:

```text
Language selector
Search input
Write record button
```

Feed tabs:

```text
All
Following
Popular
Nearby or Area
```

Initial MVP can ship with only `All`; other tabs can be visible later when data
exists.

## 8. Search Capability

Search becomes the unified exploration surface.

Supported search intents:

```text
food -> region
region -> food
place lookup
user lookup
post lookup
```

Suggested tabs:

```text
All
Foods
Areas
Places
Posts
Users
```

Existing curated pages should remain indexable for SEO, but user-facing
navigation can route through Search.

## 9. Recommend Capability

Recommend is the service-led discovery surface.

Recommend is the most important bridge between community engagement and
monetization. It should prioritize transparent curated recommendations first,
then add personalization after enough user data exists.

Phase 1:

- admin-curated recommendations
- seasonal or situation-based lists
- route ideas
- beginner-friendly K-food paths

Phase 2:

- interest-based recommendations from likes, follows, viewed foods, and
  selected preferences

Suggested sections:

```text
Editor's picks
By area
By food mood
Beginner friendly
Routes
Based on your interests
```

Interest-based recommendations must remain clearly separated from sponsored or
affiliate placements.

## 10. Mypage Capability

Mypage replaces the current public profile direction.

Core sections:

```text
My profile
My records
Liked posts
Following / followers
Language preference
Account settings
```

Mypage should be login-only. Guests who open `/mypage` are redirected to the
entry/login flow.

## 11. Translation Capability

Translation should be a cross-cutting feature, not a separate page.

Initial languages:

```text
ko
en
ja
zh
```

Recommended phases:

### Phase 1: UI Language

Translate navigation, buttons, form labels, status messages, and trust notices.

### Phase 2: Curated Content Translation

Support localized fields for foods, regions, places, routes, and recommendation
collections.

### Phase 3: User Post Translation

Add "see translation" for user records. This should be delayed until privacy,
cost, abuse, and translation-quality handling are designed.

## 12. User Record Capability

A user record is a personal K-food moment:

```text
photo + text + place or area + food tags + optional visibility
```

User can:

- create a record
- upload photos
- tag foods, areas, and places
- edit or delete their own records
- like other records
- follow users
- report content

Every public record should make its relationship to verified data clear:

- linked verified place
- linked area-level guide
- linked food
- linked route or recommendation collection
- or clearly marked as unlinked user content

Admin can:

- hide or remove posts
- review reported posts
- inspect basic moderation/audit history

## 13. Non-Goals for First Community Sprint

Do not include in the first implementation:

- real-time chat
- comments
- direct messages
- restaurant booking
- payment
- creator monetization
- automatic user-post translation
- AI recommendation ranking
- public follower counts as a growth mechanic
- open-ended anonymous posting
- replacing verified food/place pages with user posts
- treating likes or follows as the main ranking signal

## 14. Risk Controls

This capability touches identity, user-generated content, uploaded images, and
social interactions. It requires stronger controls than the current directory.

Required controls:

- login required for writing, liking, following, and mypage
- upload size/type limits
- image rights notice before upload
- public report action for posts
- admin hide/remove workflow
- user profile privacy boundaries
- account deletion plan before broad public launch
- RLS policies for all user-owned data

## 15. Success Criteria

The capability is ready for implementation when:

- top navigation is fixed to four primary items
- guest/sign-up/login entry behavior is clear
- existing directory pages have a new home inside Search/Recommend
- UGC permissions are explicit
- translation phases are agreed
- first sprint can ship without requiring the whole community system
- monetization-critical verified pages remain protected as the service's core
- user posts are defined as supporting records, not replacement facts

## 16. Recommended First Implementation Slice

Build in this order:

```text
1. Entry choice: Be guest / Sign up / Log in
2. Navigation: Feed / Search / Recommend / Mypage
3. Mypage shell replacing public profile
4. Search shell that links existing Foods/Areas/Places
5. Recommend shell that links existing Routes and curated content
6. Feed read shell with no upload yet
7. UGC database/storage/mutation work after security design
```
