# Community UGC Sprint 2 Foundation Implementation

Status: In progress  
Date: 2026-06-30  
Related docs:

- `docs/01-product/user-posts-comments.capability.md`
- `docs/02-architecture/user-posts-comments.design.md`
- `docs/02-architecture/mypage-profile.design.md`

## 1. Implemented Scope

This sprint implements Option C:

```text
Mypage Profile + UGC Data Foundation
```

It does not yet ship public post/comment writing UI.

## 2. What Changed

### Mypage Profile

Added the implementation path for:

- `display_name`
- `bio`
- `preferred_language`

The profile update path uses a focused Supabase RPC:

```text
public.update_my_profile(display_name, bio, preferred_language)
```

This avoids exposing generic `profiles` table updates to public users.

### UGC Database Foundation

Added migration:

```text
supabase/migrations/007_mypage_profile_and_ugc_foundation.sql
```

It prepares:

- `user_posts`
- `user_post_comments`
- public read policies for published/public posts
- public read policies for visible comments on published/public posts
- own-user insert/update policies
- admin/editor moderation policies

### Type and Data Layer

Added shared types for:

- supported languages
- user profiles
- user post status/visibility
- user comments

Added data helpers for:

- `getMyProfile`
- `updateMyProfile`
- `getPublishedUserPosts`
- `getPublishedUserPost`
- `getPublishedPostComments`

## 3. Comment Feature Status

Comment capability is now represented in:

```text
database schema
RLS direction
shared types
data read helper
```

Comment UI is intentionally not included yet.

Reason:

```text
comments require real parent posts,
post detail pages,
write validation,
rate limits,
and moderation workflow.
```

## 4. Next Implementation Order

Recommended next sequence:

1. Apply migration 007 to local/staging Supabase.
2. Verify RLS for profiles, posts, and comments.
3. Convert `/feed` from preview to read-only published `user_posts`.
4. Add `/feed/[postId]` post detail route.
5. Add post creation without images.
6. Add comment creation on post detail.
7. Add admin moderation for posts/comments.
8. Add image upload only after storage policy review.

## 5. Verification Targets

Before moving to Feed read/write:

```text
npm run check
npm run web:build
supabase migration push or db push
RLS verification SQL for anon/authenticated/admin
manual Mypage save test
```

