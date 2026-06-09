-- Seoul alpha verification seed.
-- This is intentionally small and deterministic. Replace with verified
-- production content only after source review.

insert into public.regions (
  slug,
  name_en,
  name_ko,
  intro,
  best_for_tags,
  status,
  display_order
)
values
  (
    'myeongdong',
    'Myeongdong',
    '명동',
    'Beginner-friendly Seoul food area for first-time visitors.',
    array['street_food', 'first_time'],
    'published',
    10
  ),
  (
    'hongdae',
    'Hongdae',
    '홍대',
    'Youthful Seoul area for casual food, cafes, and nightlife.',
    array['nightlife', 'solo_travel'],
    'draft',
    20
  ),
  (
    'gangnam',
    'Gangnam',
    '강남',
    'Modern Seoul dining area for polished K-food and trend-driven restaurants.',
    array['premium', 'modern'],
    'draft',
    30
  ),
  (
    'jongno',
    'Jongno',
    '종로',
    'Old Seoul food area with traditional soups, pancakes, and alley routes.',
    array['traditional', 'history'],
    'draft',
    40
  ),
  (
    'gwangjang-market',
    'Gwangjang Market',
    '광장시장',
    'Market food area known for classic Seoul street food.',
    array['market', 'street_food'],
    'draft',
    50
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ko = excluded.name_ko,
  intro = excluded.intro,
  best_for_tags = excluded.best_for_tags,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.foods (
  slug,
  name_en,
  name_ko,
  romanized_name,
  description,
  taste_profile,
  spicy_level,
  beginner_note,
  status,
  display_order
)
values
  (
    'tteokbokki',
    'Tteokbokki',
    '떡볶이',
    'tteokbokki',
    'Chewy rice cakes in a sweet-spicy gochujang sauce.',
    'sweet, spicy, chewy',
    3,
    'Ask for mild sauce if available and pair it with fried snacks.',
    'published',
    10
  ),
  (
    'draft-kalguksu',
    'Draft Kalguksu',
    '칼국수',
    'kalguksu',
    'Draft-only noodle entry for RLS verification.',
    'mild, warm, wheat noodles',
    0,
    'Draft row should not be publicly visible.',
    'draft',
    999
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ko = excluded.name_ko,
  romanized_name = excluded.romanized_name,
  description = excluded.description,
  taste_profile = excluded.taste_profile,
  spicy_level = excluded.spicy_level,
  beginner_note = excluded.beginner_note,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.region_foods (
  region_id,
  food_id,
  is_representative,
  display_order
)
select
  regions.id,
  foods.id,
  true,
  10
from public.regions
cross join public.foods
where regions.slug = 'myeongdong'
  and foods.slug = 'tteokbokki'
on conflict (region_id, food_id) do update
set
  is_representative = excluded.is_representative,
  display_order = excluded.display_order;

insert into public.places (
  slug,
  region_id,
  name_en,
  name_ko,
  editorial_note,
  tourist_tags,
  trust_tags,
  caution_tags,
  last_verified_at,
  status,
  display_order
)
select
  'myeongdong-street-food-loop',
  regions.id,
  'Myeongdong Street Food Loop',
  '명동 길거리 음식 루프',
  'A beginner-friendly evening walk for snacks, shopping, and easy transit.',
  array['first_time', 'shopping'],
  array['tourist_friendly', 'near_transit'],
  array['prices_vary_by_stall'],
  current_date,
  'published',
  10
from public.regions
where regions.slug = 'myeongdong'
on conflict (slug) do update
set
  region_id = excluded.region_id,
  name_en = excluded.name_en,
  name_ko = excluded.name_ko,
  editorial_note = excluded.editorial_note,
  tourist_tags = excluded.tourist_tags,
  trust_tags = excluded.trust_tags,
  caution_tags = excluded.caution_tags,
  last_verified_at = excluded.last_verified_at,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.place_foods (
  place_id,
  food_id,
  is_signature,
  display_order
)
select
  places.id,
  foods.id,
  true,
  10
from public.places
cross join public.foods
where places.slug = 'myeongdong-street-food-loop'
  and foods.slug = 'tteokbokki'
on conflict (place_id, food_id) do update
set
  is_signature = excluded.is_signature,
  display_order = excluded.display_order;

insert into public.route_guides (
  slug,
  region_id,
  title,
  summary,
  estimated_duration,
  transport_mode,
  recommended_for_tags,
  status,
  display_order
)
select
  'myeongdong-first-night',
  regions.id,
  'Myeongdong First Night',
  'A low-risk first evening route for snacks, shopping, and easy transit.',
  '90 minutes',
  'walk',
  array['first_time', 'street_food'],
  'published',
  10
from public.regions
where regions.slug = 'myeongdong'
on conflict (slug) do update
set
  region_id = excluded.region_id,
  title = excluded.title,
  summary = excluded.summary,
  estimated_duration = excluded.estimated_duration,
  transport_mode = excluded.transport_mode,
  recommended_for_tags = excluded.recommended_for_tags,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.route_guide_places (
  route_guide_id,
  place_id,
  step_order,
  step_note
)
select
  route_guides.id,
  places.id,
  1,
  'Start with a compact snack loop near transit and shopping streets.'
from public.route_guides
cross join public.places
where route_guides.slug = 'myeongdong-first-night'
  and places.slug = 'myeongdong-street-food-loop'
on conflict (route_guide_id, place_id) do update
set
  step_order = excluded.step_order,
  step_note = excluded.step_note;
