alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.foods enable row level security;
alter table public.places enable row level security;
alter table public.route_guides enable row level security;
alter table public.region_foods enable row level security;
alter table public.place_foods enable row level security;
alter table public.route_guide_places enable row level security;
alter table public.content_reports enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid() and is_active = true),
    'user'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'::public.user_role;
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('editor'::public.user_role, 'admin'::public.user_role);
$$;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "profiles_admin_select_all"
on public.profiles for select to authenticated
using (public.is_admin());

create policy "profiles_admin_update_all"
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "regions_public_select_published"
on public.regions for select
using (status = 'published'::public.publication_status);

create policy "regions_editor_manage"
on public.regions for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "foods_public_select_published"
on public.foods for select
using (status = 'published'::public.publication_status);

create policy "foods_editor_manage"
on public.foods for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "places_public_select_published"
on public.places for select
using (status = 'published'::public.publication_status);

create policy "places_editor_manage"
on public.places for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "route_guides_public_select_published"
on public.route_guides for select
using (status = 'published'::public.publication_status);

create policy "route_guides_editor_manage"
on public.route_guides for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "region_foods_public_select"
on public.region_foods for select
using (
  exists (select 1 from public.regions where regions.id = region_foods.region_id and regions.status = 'published')
  and exists (select 1 from public.foods where foods.id = region_foods.food_id and foods.status = 'published')
);

create policy "region_foods_editor_manage"
on public.region_foods for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "place_foods_public_select"
on public.place_foods for select
using (
  exists (select 1 from public.places where places.id = place_foods.place_id and places.status = 'published')
  and exists (select 1 from public.foods where foods.id = place_foods.food_id and foods.status = 'published')
);

create policy "place_foods_editor_manage"
on public.place_foods for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "route_guide_places_public_select"
on public.route_guide_places for select
using (
  exists (select 1 from public.route_guides where route_guides.id = route_guide_places.route_guide_id and route_guides.status = 'published')
  and exists (select 1 from public.places where places.id = route_guide_places.place_id and places.status = 'published')
);

create policy "route_guide_places_editor_manage"
on public.route_guide_places for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "content_reports_public_insert"
on public.content_reports for insert
with check (
  status = 'pending'::public.report_status
  and length(message) between 1 and 2000
);

create policy "content_reports_admin_select"
on public.content_reports for select to authenticated
using (public.is_editor_or_admin());

create policy "content_reports_admin_update"
on public.content_reports for update to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin_audit_logs_admin_select"
on public.admin_audit_logs for select to authenticated
using (public.is_editor_or_admin());

create policy "admin_audit_logs_admin_insert"
on public.admin_audit_logs for insert to authenticated
with check (public.is_editor_or_admin());
