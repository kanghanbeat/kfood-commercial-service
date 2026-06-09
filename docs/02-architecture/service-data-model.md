# Service Data Model

Status: Draft v1  
Date: 2026-06-08  
Inputs:

- `docs/00-blueprint/service-product-definition.md`
- `docs/00-blueprint/service-mvp-blueprint.md`
- `docs/02-architecture/service-architecture-reset.md`

## Decision Summary

The real MVP data model is editorial-directory first:

```text
regions -> foods -> places -> routes/guides
reports -> admin audit logs
trust labels + sponsored/affiliate fields
```

The current prototype schema includes useful concepts, but it is too oriented
toward posts, uploads, AI labels, gamification, and UGC. The MVP schema should
be reset around crawlable public content and founder-friendly admin operations.

## Core Entity Map

| Entity | Purpose | Public? | Admin managed? |
|---|---|---|---|
| `regions` | Seoul areas and later tourist hubs | published rows only | yes |
| `foods` | K-food dish encyclopedia pages | published rows only | yes |
| `places` | restaurant/market/place pages | published rows only | yes |
| `route_guides` | ordered food routes/guides | published rows only | yes |
| `region_foods` | many-to-many region-food relationship | via public joins | yes |
| `place_foods` | many-to-many place-food relationship | via public joins | yes |
| `route_guide_places` | ordered route steps | via public joins | yes |
| `content_reports` | user feedback on stale/wrong content | insert public, read admin | yes |
| `admin_audit_logs` | record admin changes | admin only | system/admin |
| `profiles` | admin/editor identity and roles | private/admin | yes |

## Lifecycle States

Use one shared publication state for editorial content.

```sql
create type public.publication_status as enum (
  'draft',
  'published',
  'hidden',
  'archived'
);
```

Meaning:

| State | Public visibility | Use |
|---|---|---|
| `draft` | no | work in progress |
| `published` | yes | public route/sitemap eligible |
| `hidden` | no | temporarily removed, broken/stale |
| `archived` | no | retired content kept for history |

Reports use a separate state:

```sql
create type public.report_status as enum (
  'pending',
  'in_review',
  'resolved',
  'ignored'
);
```

## Trust And Monetization Fields

These are product fields, not optional decorations.

Common content fields:

- `source_note`
- `editorial_note`
- `last_verified_at`
- `reviewed_by`
- `reviewed_at`
- `is_sponsored`
- `affiliate_url`
- `sponsorship_note`

Place-specific trust arrays:

- `tourist_tags`
- `trust_tags`
- `caution_tags`

Recommended controlled labels live in `packages/config`:

```text
editor_pick
tourist_friendly
near_transit
local_classic
beginner_friendly
spicy_warning
english_menu
card_accepted
solo_friendly
sponsored
affiliate_link
```

## Proposed Supabase DDL

This DDL is a target for the new root `supabase/` directory after repository
restructure. It should not be applied on top of the existing prototype database
without migration review.

```sql
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
```

## Index Plan

```sql
create index if not exists regions_status_display_idx on public.regions(status, display_order);
create index if not exists foods_status_display_idx on public.foods(status, display_order);
create index if not exists places_region_status_display_idx on public.places(region_id, status, display_order);
create index if not exists places_last_verified_idx on public.places(last_verified_at);
create index if not exists route_guides_region_status_display_idx on public.route_guides(region_id, status, display_order);
create index if not exists route_guide_places_order_idx on public.route_guide_places(route_guide_id, step_order);
create index if not exists content_reports_status_created_idx on public.content_reports(status, created_at desc);
create index if not exists admin_audit_logs_entity_idx on public.admin_audit_logs(entity_type, entity_id, created_at desc);
```

## Relationship Rules

- A region can have many foods through `region_foods`.
- A food can appear in many regions.
- A place belongs to one primary region.
- A place can feature many foods through `place_foods`.
- A route guide belongs to one region.
- A route guide contains ordered places through `route_guide_places`.
- Reports can point to a page URL and optionally to an entity.
- Audit logs record admin mutations and are admin-only.

## RLS Policy Matrix

| Table | Anonymous select | Anonymous insert | Authenticated select | Admin/editor write |
|---|---|---|---|---|
| `profiles` | no | no | own profile only | admin can read/update role data |
| `regions` | published only | no | published only | yes |
| `foods` | published only | no | published only | yes |
| `places` | published only | no | published only | yes |
| `route_guides` | published only | no | published only | yes |
| `region_foods` | only joins where both sides published | no | same as anonymous | yes |
| `place_foods` | only joins where both sides published | no | same as anonymous | yes |
| `route_guide_places` | only joins where route/place published | no | same as anonymous | yes |
| `content_reports` | no | yes, limited fields | admin only | admin update status |
| `admin_audit_logs` | no | no | admin only | admin/system insert |

Helper functions:

```sql
public.current_user_role()
public.is_admin()
public.is_editor_or_admin()
```

Publication rule:

```text
Public reads must filter to status = 'published'.
Draft, hidden, and archived content must never appear in public routes,
sitemap generation, or public search.
```

## RLS Policy Intent

Policy examples to implement in migration:

```sql
create policy "regions_public_select_published"
on public.regions
for select
using (status = 'published');

create policy "regions_editor_manage"
on public.regions
for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
```

For join tables, prefer policies that verify published parent rows for anonymous
select. If policies become too complex, expose public data through security
definer RPCs or carefully reviewed views.

## Storage Buckets

MVP buckets:

| Bucket | Public read | Write | Purpose |
|---|---|---|---|
| `public-content-images` | yes | editor/admin only | region, food, place, route images |
| `admin-working-assets` | no | editor/admin only | drafts, source assets |

Do not add user upload buckets in MVP.

## Shared TypeScript Types

Initial `packages/types` should expose:

```ts
export type PublicationStatus = 'draft' | 'published' | 'hidden' | 'archived';
export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'ignored';
export type UserRole = 'user' | 'editor' | 'admin';

export type Region = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  intro: string;
  heroImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  bestForTags: string[];
  displayOrder: number;
  status: PublicationStatus;
};

export type Food = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  romanizedName?: string | null;
  description: string;
  tasteProfile?: string | null;
  spicyLevel: 0 | 1 | 2 | 3 | 4;
  beginnerNote?: string | null;
  eatingGuide?: string | null;
  cautionNote?: string | null;
  imageUrl?: string | null;
  status: PublicationStatus;
};

export type Place = {
  id: string;
  slug: string;
  regionId: string;
  nameEn: string;
  nameKo?: string | null;
  addressEn?: string | null;
  addressKo?: string | null;
  editorialNote: string;
  googleMapsUrl?: string | null;
  naverMapsUrl?: string | null;
  touristTags: string[];
  trustTags: string[];
  cautionTags: string[];
  lastVerifiedAt?: string | null;
  isSponsored: boolean;
  affiliateUrl?: string | null;
  sponsorshipNote?: string | null;
  status: PublicationStatus;
};

export type RouteGuide = {
  id: string;
  slug: string;
  regionId: string;
  title: string;
  summary: string;
  estimatedDuration?: string | null;
  transportMode?: string | null;
  recommendedForTags: string[];
  status: PublicationStatus;
};
```

## Seoul Alpha Seed Plan

Target alpha content:

- 10+ foods
- 20+ places
- 3+ route guides

Private beta content:

- 20+ foods
- 50+ places
- 5+ route guides

Seed by area:

| Area | Minimum foods | Minimum places | Minimum routes |
|---|---:|---:|---:|
| Myeongdong | 2 | 4 | 1 |
| Hongdae | 2 | 4 | 1 |
| Gangnam | 2 | 4 | 1 |
| Jongno | 2 | 4 | 1 shared or later |
| Gwangjang Market | 2 | 4 | 1 shared or later |

Initial food candidates:

- Bibimbap
- Samgyeopsal
- Tteokbokki
- Gimbap
- Bindaetteok
- Dakgalbi
- Kalguksu
- Gukbap
- Chimaek
- Hotteok

Each seed place must have:

- region
- at least one food relation
- map link
- editorial note
- last verified date or explicit unverified state
- status

## Migration Sequence

After repository restructuring:

1. Move existing prototype `supabase/` to root as reference.
2. Create new migration series with unambiguous ordering.
3. Add enums and core tables.
4. Add join tables.
5. Add report and audit tables.
6. Add indexes.
7. Add RLS helper functions.
8. Add RLS policies.
9. Add seed data.
10. Run RLS audit queries.

Do not reuse duplicate `002_*.sql` numbering from the prototype.

## Open Questions

- Should public URL terminology use `routes`, `guides`, or both?
- Should places require both Google Maps and Naver Map links, or allow one?
- Which analytics provider will be used first: GA4, Plausible, or Umami?
- Should content images be externally hosted initially or uploaded into
  Supabase Storage from day one?
- Will admin use Supabase Studio for alpha, or must the web admin CMS exist
  before alpha?

## Ready Criteria

The data model is ready for backend implementation when:

- every public page has a source table
- every relationship has a join table or explicit field
- public visibility is controlled by `status = 'published'`
- admin edits are auditable
- reports have a lifecycle
- sponsored and affiliate fields can be labeled in UI
- seed content requirements are measurable

## Next Skill

Use `kfood-service-real-backend` next.

The next phase should create the actual root `supabase/` migration plan, shared
types package, and first backend implementation tasks after repository
restructure is approved.
