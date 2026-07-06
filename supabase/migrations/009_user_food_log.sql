create table if not exists public.user_food_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  food_id uuid not null references public.foods(id) on delete cascade,
  tried_at timestamptz not null default now(),
  constraint user_food_log_user_food_unique unique (user_id, food_id)
);

create index if not exists user_food_log_user_idx
on public.user_food_log(user_id);

alter table public.user_food_log enable row level security;

drop policy if exists "user_food_log_user_select_own" on public.user_food_log;
drop policy if exists "user_food_log_user_insert_own" on public.user_food_log;
drop policy if exists "user_food_log_user_delete_own" on public.user_food_log;
drop policy if exists "user_food_log_editor_select" on public.user_food_log;

create policy "user_food_log_user_select_own"
on public.user_food_log for select to authenticated
using (user_id = auth.uid());

create policy "user_food_log_user_insert_own"
on public.user_food_log for insert to authenticated
with check (user_id = auth.uid());

create policy "user_food_log_user_delete_own"
on public.user_food_log for delete to authenticated
using (user_id = auth.uid());

create policy "user_food_log_editor_select"
on public.user_food_log for select to authenticated
using (public.is_editor_or_admin());
