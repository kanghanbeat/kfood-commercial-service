# Community UGC Sprint 2 Security Report

Status: Draft verification report  
Date: 2026-06-30  
Scope: profiles, user_posts, user_post_comments, Feed, post creation, comments,
admin moderation

## 1. Reviewed Surfaces

- public profile editing
- user post creation
- comment creation
- public read of published posts/comments
- admin/editor moderation
- audit logging for moderation
- Feed and post detail routes

## 2. Findings

### Medium: Write rate limits are not implemented yet

User post and comment writes are authenticated and length-limited, but there is
no per-user rate limit yet.

Impact:

- a logged-in abusive account could submit many posts/comments
- admin moderation load could increase

Mitigation for current stage:

- public posts enter `pending_review`
- comments only attach to published public posts
- admin can hide/remove comments

Required before broader launch:

- add per-user post/comment rate limits
- add report flow for specific posts/comments

### Low: Image upload remains intentionally disabled

No image upload is exposed in this sprint.

Impact:

- safer launch surface
- Feed remains text-first

Required before image launch:

- storage bucket policy
- file type/size checks
- photo rights notice
- moderation/delete rules

## 3. Positive Controls

- profile updates use `public.update_my_profile(...)` RPC instead of generic
  profile table updates
- user posts require `author_id = auth.uid()`
- public reads require `status = 'published'` and `visibility = 'public'`
- comments require a published public parent post
- users can remove their own comments
- admin/editor moderation writes audit logs through app helpers
- service role keys are not used in public routes

## 4. Release Gate

Do not treat UGC as production-ready until:

```text
1. migration 007 is applied to staging
2. supabase/sql/ugc_rls_verification.sql is completed
3. /mypage profile save is manually tested
4. /feed/new post submission is manually tested
5. /admin/user-posts publish/hide is manually tested
6. /feed/[postId] comment submission is manually tested
7. /admin/comments hide/remove is manually tested
```

