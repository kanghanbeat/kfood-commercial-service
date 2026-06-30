alter table public.profiles
  add column if not exists bio text,
  add column if not exists preferred_language text not null default 'en';

alter table public.profiles
  drop constraint if exists profiles_preferred_language_check,
  add constraint profiles_preferred_language_check
    check (preferred_language in ('ko', 'en', 'ja', 'zh'));

alter table public.profiles
  drop constraint if exists profiles_display_name_length_check,
  add constraint profiles_display_name_length_check
    check (display_name is null or char_length(display_name) <= 80);

alter table public.profiles
  drop constraint if exists profiles_bio_length_check,
  add constraint profiles_bio_length_check
    check (bio is null or char_length(bio) <= 240);

drop policy if exists "profiles_user_update_own_public_fields" on public.profiles;

create or replace function public.update_my_profile(
  p_display_name text,
  p_bio text,
  p_preferred_language text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_preferred_language not in ('ko', 'en', 'ja', 'zh') then
    raise exception 'unsupported preferred language';
  end if;

  if p_display_name is not null and char_length(p_display_name) > 80 then
    raise exception 'display name is too long';
  end if;

  if p_bio is not null and char_length(p_bio) > 240 then
    raise exception 'bio is too long';
  end if;

  update public.profiles
  set
    display_name = nullif(btrim(p_display_name), ''),
    bio = nullif(btrim(p_bio), ''),
    preferred_language = p_preferred_language,
    updated_at = now()
  where id = auth.uid()
    and is_active = true;
end;
$$;

grant execute on function public.update_my_profile(text, text, text) to authenticated;

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

alter table public.user_posts enable row level security;
alter table public.user_post_comments enable row level security;

drop policy if exists "user_posts_public_select_published" on public.user_posts;
drop policy if exists "user_posts_user_select_own" on public.user_posts;
drop policy if exists "user_posts_user_insert_own" on public.user_posts;
drop policy if exists "user_posts_user_update_own_unmoderated" on public.user_posts;
drop policy if exists "user_posts_editor_manage" on public.user_posts;

create policy "user_posts_public_select_published"
on public.user_posts for select
using (status = 'published' and visibility = 'public');

create policy "user_posts_user_select_own"
on public.user_posts for select to authenticated
using (author_id = auth.uid());

create policy "user_posts_user_insert_own"
on public.user_posts for insert to authenticated
with check (
  author_id = auth.uid()
  and status in ('draft', 'pending_review')
  and visibility in ('public', 'private', 'unlisted')
);

create policy "user_posts_user_update_own_unmoderated"
on public.user_posts for update to authenticated
using (
  author_id = auth.uid()
  and status in ('draft', 'pending_review', 'published')
)
with check (
  author_id = auth.uid()
  and status in ('draft', 'pending_review', 'removed')
);

create policy "user_posts_editor_manage"
on public.user_posts for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "user_post_comments_public_select_published" on public.user_post_comments;
drop policy if exists "user_post_comments_user_select_own" on public.user_post_comments;
drop policy if exists "user_post_comments_user_insert_own" on public.user_post_comments;
drop policy if exists "user_post_comments_user_update_own" on public.user_post_comments;
drop policy if exists "user_post_comments_editor_manage" on public.user_post_comments;

create policy "user_post_comments_public_select_published"
on public.user_post_comments for select
using (
  status = 'published'
  and exists (
    select 1
    from public.user_posts
    where user_posts.id = user_post_comments.post_id
      and user_posts.status = 'published'
      and user_posts.visibility = 'public'
  )
);

create policy "user_post_comments_user_select_own"
on public.user_post_comments for select to authenticated
using (author_id = auth.uid());

create policy "user_post_comments_user_insert_own"
on public.user_post_comments for insert to authenticated
with check (
  author_id = auth.uid()
  and status = 'published'
  and exists (
    select 1
    from public.user_posts
    where user_posts.id = user_post_comments.post_id
      and user_posts.status = 'published'
      and user_posts.visibility = 'public'
  )
);

create policy "user_post_comments_user_update_own"
on public.user_post_comments for update to authenticated
using (
  author_id = auth.uid()
  and status = 'published'
)
with check (
  author_id = auth.uid()
  and status in ('published', 'removed')
);

create policy "user_post_comments_editor_manage"
on public.user_post_comments for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
