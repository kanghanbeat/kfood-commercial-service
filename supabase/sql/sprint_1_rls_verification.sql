-- Sprint 1 RLS verification queries.
-- Run after applying migrations and seed data.
-- These queries are intended for local Supabase or a staging project.

-- 1. Confirm publication-state coverage exists.
select
  'regions' as table_name,
  status,
  count(*) as row_count
from public.regions
group by status
union all
select
  'foods' as table_name,
  status,
  count(*) as row_count
from public.foods
group by status
union all
select
  'places' as table_name,
  status,
  count(*) as row_count
from public.places
group by status
union all
select
  'route_guides' as table_name,
  status,
  count(*) as row_count
from public.route_guides
group by status
order by table_name, status;

-- 2. Simulate anonymous public reads. Expected result:
--    - published rows are visible
--    - draft rows are not visible
begin;
set local role anon;

select slug, status
from public.regions
order by display_order, slug;

select slug, status
from public.foods
order by display_order, slug;

select slug, status
from public.places
order by display_order, slug;

select slug, status
from public.route_guides
order by display_order, slug;

rollback;

-- 3. Simulate anonymous report insert. Expected result:
--    insert succeeds, then rollback removes the test row.
begin;
set local role anon;

insert into public.content_reports (
  page_url,
  entity_type,
  report_type,
  message,
  user_email
)
values (
  'https://example.test/places/myeongdong-street-food-loop',
  'place',
  'incorrect_info',
  'Sprint 1 anonymous report insert verification.',
  'traveler@example.test'
)
returning id, status, created_at;

rollback;

-- 4. Confirm sensitive admin tables are not exposed to anon.
-- Expected result under anon: zero rows or permission denied depending on the
-- execution surface.
begin;
set local role anon;

select count(*) as visible_reports_to_anon
from public.content_reports;

select count(*) as visible_audit_logs_to_anon
from public.admin_audit_logs;

rollback;

-- 5. Admin/editor verification requires an authenticated user with a profile
-- role of editor or admin. After creating such a user, run targeted dashboard
-- checks for create/update/hide/publish flows.
