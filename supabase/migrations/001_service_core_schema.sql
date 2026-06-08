create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('user', 'editor', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.publication_status as enum ('draft', 'published', 'hidden', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.report_status as enum ('pending', 'in_review', 'resolved', 'ignored');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'user',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ko text not null,
  intro text not null,
  hero_image_url text,
  seo_title text,
  seo_description text,
  best_for_tags text[] not null default '{}',
  display_order integer not null default 100,
  status public.publication_status not null default 'draft',
  source_note text,
  editorial_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ko text not null,
  romanized_name text,
  description text not null,
  taste_profile text,
  spicy_level integer not null default 0,
  beginner_note text,
  eating_guide text,
  caution_note text,
  image_url text,
  seo_title text,
  seo_description text,
  display_order integer not null default 100,
  status public.publication_status not null default 'draft',
  source_note text,
  editorial_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint foods_spicy_level_range check (spicy_level between 0 and 4)
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  region_id uuid not null references public.regions(id) on delete restrict,
  name_en text not null,
  name_ko text,
  address_en text,
  address_ko text,
  editorial_note text not null,
  google_maps_url text,
  naver_maps_url text,
  image_url text,
  tourist_tags text[] not null default '{}',
  trust_tags text[] not null default '{}',
  caution_tags text[] not null default '{}',
  last_verified_at date,
  is_sponsored boolean not null default false,
  affiliate_url text,
  sponsorship_note text,
  seo_title text,
  seo_description text,
  display_order integer not null default 100,
  status public.publication_status not null default 'draft',
  source_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint places_sponsorship_note_required check (
    is_sponsored = false or sponsorship_note is not null
  )
);

create table if not exists public.route_guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  region_id uuid not null references public.regions(id) on delete restrict,
  title text not null,
  summary text not null,
  estimated_duration text,
  transport_mode text,
  recommended_for_tags text[] not null default '{}',
  editorial_note text,
  hero_image_url text,
  seo_title text,
  seo_description text,
  display_order integer not null default 100,
  status public.publication_status not null default 'draft',
  source_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.region_foods (
  region_id uuid not null references public.regions(id) on delete cascade,
  food_id uuid not null references public.foods(id) on delete cascade,
  is_representative boolean not null default false,
  display_order integer not null default 100,
  primary key (region_id, food_id)
);

create table if not exists public.place_foods (
  place_id uuid not null references public.places(id) on delete cascade,
  food_id uuid not null references public.foods(id) on delete cascade,
  is_signature boolean not null default false,
  display_order integer not null default 100,
  primary key (place_id, food_id)
);

create table if not exists public.route_guide_places (
  route_guide_id uuid not null references public.route_guides(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete restrict,
  step_order integer not null,
  step_note text,
  primary key (route_guide_id, place_id),
  constraint route_guide_places_step_order_positive check (step_order > 0)
);

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  entity_type text,
  entity_id uuid,
  report_type text not null,
  message text not null,
  user_email text,
  status public.report_status not null default 'pending',
  admin_note text,
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists regions_status_display_idx on public.regions(status, display_order);
create index if not exists foods_status_display_idx on public.foods(status, display_order);
create index if not exists places_region_status_display_idx on public.places(region_id, status, display_order);
create index if not exists places_last_verified_idx on public.places(last_verified_at);
create index if not exists route_guides_region_status_display_idx on public.route_guides(region_id, status, display_order);
create index if not exists route_guide_places_order_idx on public.route_guide_places(route_guide_id, step_order);
create index if not exists content_reports_status_created_idx on public.content_reports(status, created_at desc);
create index if not exists admin_audit_logs_entity_idx on public.admin_audit_logs(entity_type, entity_id, created_at desc);
