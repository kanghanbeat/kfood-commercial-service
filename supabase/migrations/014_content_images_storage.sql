-- 014_content_images_storage.sql
-- 콘텐츠 사진 저장소(Supabase Storage). 어드민에서 파일을 올리면 여기에 저장되고,
-- 공개 페이지는 이 버킷의 주소를 그대로 읽어 사진을 보여준다.
--
-- 버킷(bucket): 파일을 담는 폴더 같은 공간. public=true면 주소를 아는 사람은
-- 누구나 볼 수 있다(공개 사이트에 사진을 띄우려면 필요).
-- 올리기·바꾸기·지우기는 editor/admin만 가능하도록 아래 정책으로 막는다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-images',
  'content-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "content_images_public_read" on storage.objects;
drop policy if exists "content_images_editor_insert" on storage.objects;
drop policy if exists "content_images_editor_update" on storage.objects;
drop policy if exists "content_images_editor_delete" on storage.objects;

-- 읽기: 누구나 (공개 사이트에서 사진을 봐야 하므로)
create policy "content_images_public_read"
on storage.objects for select
using (bucket_id = 'content-images');

-- 올리기·바꾸기·지우기: editor/admin만
create policy "content_images_editor_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'content-images' and public.is_editor_or_admin());

create policy "content_images_editor_update"
on storage.objects for update to authenticated
using (bucket_id = 'content-images' and public.is_editor_or_admin())
with check (bucket_id = 'content-images' and public.is_editor_or_admin());

create policy "content_images_editor_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'content-images' and public.is_editor_or_admin());
