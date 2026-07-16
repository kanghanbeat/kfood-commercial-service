create table if not exists public.platform_settings (
  key text primary key,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.platform_settings (key, enabled)
values ('community', true)
on conflict (key) do nothing;

alter table public.platform_settings enable row level security;

drop policy if exists "platform_settings_public_select" on public.platform_settings;
drop policy if exists "platform_settings_editor_manage" on public.platform_settings;

create policy "platform_settings_public_select"
on public.platform_settings for select
using (true);

create policy "platform_settings_editor_manage"
on public.platform_settings for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
