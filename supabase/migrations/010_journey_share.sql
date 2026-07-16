alter table public.profiles
  add column if not exists journey_share_token uuid unique;

create or replace function public.enable_my_journey_share()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token uuid;
begin
  select journey_share_token into v_token
  from public.profiles
  where id = auth.uid();

  if v_token is null then
    v_token := gen_random_uuid();

    update public.profiles
    set journey_share_token = v_token
    where id = auth.uid();
  end if;

  return v_token;
end;
$$;

grant execute on function public.enable_my_journey_share() to authenticated;

create or replace function public.get_public_journey_profile(p_share_token uuid)
returns table(display_name text)
language sql
security definer
set search_path = public
stable
as $$
  select display_name
  from public.profiles
  where journey_share_token = p_share_token;
$$;

grant execute on function public.get_public_journey_profile(uuid) to anon, authenticated;

create or replace function public.get_public_journey(p_share_token uuid)
returns table(food_slug text, tried_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select f.slug, ufl.tried_at
  from public.profiles p
  join public.user_food_log ufl on ufl.user_id = p.id
  join public.foods f on f.id = ufl.food_id
  where p.journey_share_token = p_share_token
    and f.status = 'published'
  order by ufl.tried_at asc;
$$;

grant execute on function public.get_public_journey(uuid) to anon, authenticated;
