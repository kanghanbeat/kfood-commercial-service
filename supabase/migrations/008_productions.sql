-- 007_productions.sql
-- 촬영·제작 콘텐츠(B): 우리가 직접 만든 영상·블로그·릴스 등.
-- 참조 콘텐츠(지역/음식/장소/루트)를 태그로 연결한다.
-- 작성: 솔 (한빛 리뷰 대상 — 신규 테이블 + RLS). 001/002 컨벤션 준수.

do $$
begin
  create type public.production_type as enum ('video', 'blog', 'reels', 'shorts', 'photo');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.productions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ko text,
  type public.production_type not null default 'video',
  channel text,
  summary text,
  body text,
  external_url text,
  thumbnail_url text,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  display_order integer not null default 100,
  editorial_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 태그: 촬영 콘텐츠 ↔ 참조 엔티티 연결 (범용 태그).
create table if not exists public.production_tags (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references public.productions(id) on delete cascade,
  entity_type text not null check (entity_type in ('region', 'food', 'place', 'route')),
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (production_id, entity_type, entity_id)
);

create index if not exists productions_status_idx on public.productions(status);
create index if not exists production_tags_production_idx on public.production_tags(production_id);
create index if not exists production_tags_entity_idx on public.production_tags(entity_type, entity_id);

alter table public.productions enable row level security;
alter table public.production_tags enable row level security;

create policy "productions_public_select_published"
on public.productions for select
using (status = 'published'::public.publication_status);

create policy "productions_editor_manage"
on public.productions for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "production_tags_public_select"
on public.production_tags for select
using (
  exists (
    select 1 from public.productions
    where productions.id = production_tags.production_id
      and productions.status = 'published'::public.publication_status
  )
);

create policy "production_tags_editor_manage"
on public.production_tags for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
