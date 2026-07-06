# User Posts and Comments Architecture Design

Status: Draft for owner review  
Date: 2026-06-30  
Related capability:
`docs/01-product/user-posts-comments.capability.md`

## 1. Context

K-food Service currently has:

- Next.js public web
- Supabase Auth
- `profiles` roles for user/editor/admin
- public Feed/Search/Recommend/Mypage shells
- verified regions, foods, places, and routes
- reports and admin audit logs
- no real UGC database yet
- no user image upload yet

The next community layer needs user posts and comments, but it must preserve
the verified directory as the trusted source.

## 2. Architecture Decision

Use a staged UGC model:

```text
user_posts first
comments second
images third
likes/follows after moderation basics
```

Comments should attach only to user posts. They should not be enabled globally
on verified food, place, region, or route pages until moderation load is better
understood.

## 3. Architecture Options

### Option A: Comments First UI Shell

Add visible comment boxes to Feed before real posts exist.

Pros:

- fast visual progress
- shows future interaction direction

Cons:

- comments have no real parent object
- encourages fake UI
- creates rework when real post detail pages arrive

Verdict: not recommended.

### Option B: Full UGC Platform

Build posts, images, likes, follows, comments, reports, admin queues, search,
and recommendations in one release.

Pros:

- complete platform shape
- fewer temporary states

Cons:

- too risky for current stage
- high moderation and storage surface
- slows down learning
- harder for collaborators to review safely

Verdict: too large.

### Option C: Pragmatic Staged Foundation

Build data and permission foundation first, then expose UI in thin slices.

Pros:

- safer rollout
- keeps verified service stable
- lets Feed become real without overbuilding SNS mechanics
- supports later comments, images, likes, follows, and search

Cons:

- early UI remains simple
- requires discipline around status and moderation states

Recommendation: Option C.

## 4. Database Design

### Post Status Types

Use text checks first instead of new enum types to reduce migration friction.

```sql
post_status in ('draft', 'pending_review', 'published', 'hidden', 'removed')
post_visibility in ('public', 'private', 'unlisted')
comment_status in ('published', 'hidden', 'removed')
```

### `user_posts`

```sql
create table if not exists public.user_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  language text not null default 'en',
  visibility text not null default 'public',
  status text not null default 'pending_review',
  region_id uuid references public.regions(id) on delete set null,
  food_id uuid references public.foods(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  route_guide_id uuid references public.route_guides(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  hidden_at timestamptz,
  removed_at timestamptz,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderation_note text,
  constraint user_posts_body_length_check
    check (char_length(body) between 1 and 2000),
  constraint user_posts_language_check
    check (language in ('ko', 'en', 'ja', 'zh')),
  constraint user_posts_visibility_check
    check (visibility in ('public', 'private', 'unlisted')),
  constraint user_posts_status_check
    check (status in ('draft', 'pending_review', 'published', 'hidden', 'removed'))
);
```

Notes:

- Use `author_id -> profiles(id)` so app code can join display names and roles.
- Keep only single nullable links in the first version.
- Add many-to-many post link tables later if one post needs multiple foods or
  places.
- Do not add image fields to `user_posts`; images belong in a separate table.

### `user_post_comments`

```sql
create table if not exists public.user_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.user_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  hidden_at timestamptz,
  removed_at timestamptz,
  moderated_by uuid references public.profiles(id) on delete set null,
  moderation_note text,
  constraint user_post_comments_body_length_check
    check (char_length(body) between 1 and 800),
  constraint user_post_comments_status_check
    check (status in ('published', 'hidden', 'removed'))
);
```

Comments intentionally have no parent comment id in the first version.

### Optional Later Tables

```text
user_post_images
post_likes
user_follows
user_post_reports
user_comment_reports
```

For the first migration, reports can either use dedicated UGC report tables or
extend the existing `content_reports` pattern. Dedicated tables are cleaner for
moderation, but the existing report workflow can be reused conceptually.

## 5. Indexes

Recommended first indexes:

```sql
create index if not exists user_posts_public_feed_idx
on public.user_posts(created_at desc)
where status = 'published' and visibility = 'public';

create index if not exists user_posts_author_created_idx
on public.user_posts(author_id, created_at desc);

create index if not exists user_post_comments_post_created_idx
on public.user_post_comments(post_id, created_at asc)
where status = 'published';

create index if not exists user_post_comments_author_created_idx
on public.user_post_comments(author_id, created_at desc);
```

## 6. RLS Direction

Enable RLS:

```sql
alter table public.user_posts enable row level security;
alter table public.user_post_comments enable row level security;
```

Public read:

```text
anon/authenticated can read:
user_posts where status = published and visibility = public
user_post_comments where status = published and parent post is public/published
```

Authenticated post write:

```text
user can insert own user_posts
user can update own draft or pending_review posts
user can request removal of own post
```

Authenticated comment write:

```text
user can insert comments only on published public posts
user can update own published comments
user can mark own comments removed
```

Admin/editor moderation:

```text
admin/editor can select all posts/comments
admin/editor can update status, moderated_by, moderation_note
```

Important:

Use application code or RPCs to prevent user updates from changing fields such
as `author_id`, `status`, `moderated_by`, and moderation notes. RLS `with check`
does not provide column-level update limits by itself.

## 7. Application Service Boundary

Recommended modules:

```text
packages/types/src/index.ts
packages/data/src/user-posts.ts
packages/data/src/user-comments.ts
web/app/feed/page.tsx
web/app/feed/[postId]/page.tsx
web/app/feed/[postId]/actions.ts
web/components/user-post-card.tsx
web/components/comment-list.tsx
web/components/comment-form.tsx
web/app/admin/user-posts/page.tsx
web/app/admin/comments/page.tsx
```

Data helpers:

```ts
getPublishedUserPosts()
getPublishedUserPost(postId)
getPublishedPostComments(postId)
createUserPost(input)
createPostComment(input)
removeOwnComment(commentId)
hideCommentAsAdmin(commentId, note)
```

Server actions should validate:

- session exists
- profile exists and is active
- body length
- allowed language
- parent post is published/public
- rate limit window
- honeypot where applicable

## 8. Page Architecture

### `/feed`

First real version:

- read published user posts
- show verified labels for linked food/region/place/route
- show comment count
- link to post detail
- keep empty state if no posts exist

### `/feed/[postId]`

First detail version:

- full post
- linked verified entities
- comments
- comment form for logged-in users
- login prompt for guests
- report action

### `/mypage`

After post creation:

- my drafts
- my pending posts
- my published posts
- removed/hidden explanation

### `/admin/user-posts` and `/admin/comments`

After public write is enabled:

- moderation queue
- hide/remove
- moderation notes
- audit log

## 9. UI and Design Guidance

Feed cards should not imitate a generic SNS.

Use service-specific labels:

```text
User record
Verified food
Area guide
Place direction
Pending review
Hidden by moderation
```

Comment UI should be quieter than post UI:

- compact text
- no nested card piles
- clear author and timestamp
- visible report affordance
- login prompt only where interaction is blocked

Do not show comments as a replacement for verified facts. If a comment mentions
closure, price, opening hours, safety, allergy, or location changes, route that
signal into reports/admin review rather than auto-updating verified pages.

## 10. Security and Abuse Review

Before enabling writes publicly, review:

- per-user post rate limits
- per-user comment rate limits
- body length and whitespace validation
- profanity/harassment moderation plan
- report workflow
- deletion and account removal behavior
- admin audit log
- storage RLS before images
- privacy terms and content policy updates

Minimum launch controls:

```text
authenticated-only writes
published public read only
body length checks
status moderation
admin hide/remove
report action
rate-limit design
```

## 11. Rollout Plan

### Slice 1: Data Model and RLS

Create migration:

```text
supabase/migrations/007_user_posts_comments.sql
```

Validate:

- anonymous read only published/public
- authenticated insert own post
- authenticated comment only on published/public post
- user cannot edit another user's content
- admin/editor moderation works

### Slice 2: Read-Only Feed

Change `/feed` from preview to real read path.

If no posts exist:

```text
Show curated explanation and link to Search/Recommend.
```

### Slice 3: Post Creation Without Images

Add logged-in create form:

- body
- language
- optional food/region/place link
- submit as `pending_review`

### Slice 4: Comments

Add:

- `/feed/[postId]`
- comment list
- comment form
- own comment removal
- admin comment moderation

### Slice 5: Images

Only after storage security review:

- `user-post-images` bucket
- file size/type limits
- image moderation/delete rules
- photo rights notice

### Slice 6: Likes, Follows, Search, Recommend Signals

After posts/comments are stable:

- likes
- follows
- unified post/user search
- recommendation signals

## 12. Next Implementation Recommendation

Do not implement comments first.

Recommended immediate next work:

```text
Community UGC Sprint 2:
Mypage Profile Fields + UGC Data Model Preparation
```

Why:

1. Comments require real post authors.
2. Post authors need stable profile fields.
3. Feed needs real post data before comment forms matter.
4. Admin moderation should be ready before public write volume increases.

Implementation order:

```text
1. Apply mypage profile fields
2. Add user_posts and user_post_comments migration
3. Add read helpers and types
4. Convert Feed from preview to read-only DB feed
5. Add post detail route
6. Add post creation
7. Add comments
8. Add admin moderation pages
```

