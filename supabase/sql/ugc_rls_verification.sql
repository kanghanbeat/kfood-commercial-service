-- Community UGC RLS verification checklist.
-- Run after applying supabase/migrations/007_mypage_profile_and_ugc_foundation.sql.
--
-- This file is intentionally written as a guided SQL checklist because anon,
-- authenticated user, and admin/editor checks require different JWT roles in
-- Supabase Dashboard or API clients.

-- 1. Schema exists.
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles', 'user_posts', 'user_post_comments')
order by table_name, ordinal_position;

-- 2. Public feed should expose only published public posts.
select id, status, visibility, created_at
from public.user_posts
where status = 'published'
  and visibility = 'public'
order by created_at desc
limit 10;

-- 3. Public comments should expose only visible comments on published public posts.
select c.id, c.post_id, c.status, c.created_at
from public.user_post_comments c
join public.user_posts p on p.id = c.post_id
where c.status = 'published'
  and p.status = 'published'
  and p.visibility = 'public'
order by c.created_at asc
limit 10;

-- 4. Authenticated user expected checks.
-- Use a logged-in user JWT, then verify:
-- - insert into public.user_posts with author_id = auth.uid() passes
-- - insert with another author_id fails
-- - insert comment on a published public post passes
-- - insert comment on hidden/private/removed post fails
-- - update own comment from published to removed passes
-- - update another user's comment fails

-- 5. Admin/editor expected checks.
-- Use an admin/editor JWT, then verify:
-- - select all user_posts passes
-- - select all user_post_comments passes
-- - update user_posts.status to published/hidden/removed passes
-- - update user_post_comments.status to published/hidden/removed passes
-- - admin_audit_logs insert passes through app helper

