-- 015_content_image_gallery.sql
-- 콘텐츠 사진 갤러리: 음식·장소·지역·루트에 사진을 여러 장 붙인다.
--
-- 각 테이블의 image_url / hero_image_url(대표 사진)은 그대로 둔다.
-- 갤러리의 첫 번째 사진(display_order가 가장 작은 것)을 대표 사진으로
-- 앱에서 자동 동기화한다 — 목록 카드는 대표 1장만 읽으면 되므로
-- 매번 갤러리를 조회하지 않아도 된다.

create table if not exists public.content_images (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('food', 'place', 'region', 'route')),
  owner_id uuid not null,
  url text not null,
  -- 저장소에서 파일을 지울 때 쓰는 경로(예: food/<id>/xxxx.jpg)
  storage_path text not null,
  -- 대체 텍스트: 사진이 안 보이거나 화면을 읽어주는 도구가 읽는 설명
  alt_text text,
  display_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists content_images_owner_idx
  on public.content_images(owner_type, owner_id, display_order);

alter table public.content_images enable row level security;

drop policy if exists "content_images_public_select" on public.content_images;
drop policy if exists "content_images_editor_manage" on public.content_images;

-- 공개 사이트에서 사진을 봐야 하므로 읽기는 누구나.
-- (비공개 콘텐츠의 사진 주소가 노출돼도 해당 페이지 자체가 안 열린다)
create policy "content_images_public_select"
on public.content_images for select
using (true);

create policy "content_images_editor_manage"
on public.content_images for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
