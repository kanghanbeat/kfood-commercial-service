-- Capital-region alpha seed.
-- Food and region candidates were user-reviewed on 2026-06-10.
-- Places and routes remain intentionally small until place-level verification.

insert into public.regions (
  slug,
  name_en,
  name_ko,
  intro,
  best_for_tags,
  source_note,
  status,
  display_order
)
values
  (
    'seoul',
    'Seoul',
    '서울',
    'Capital city launch region for beginner-friendly K-food discovery.',
    array['capital_region', 'first_time', 'transit_friendly'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    5
  ),
  (
    'myeongdong',
    'Myeongdong',
    '명동',
    'Beginner-friendly Seoul food area for first-time visitors.',
    array['street_food', 'first_time'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    10
  ),
  (
    'hongdae',
    'Hongdae',
    '홍대',
    'Youthful Seoul area for casual food, cafes, and nightlife.',
    array['nightlife', 'solo_travel'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    20
  ),
  (
    'gangnam',
    'Gangnam',
    '강남',
    'Modern Seoul dining area for polished K-food and trend-driven restaurants.',
    array['premium', 'modern'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    30
  ),
  (
    'jongno',
    'Jongno',
    '종로',
    'Old Seoul food area with traditional soups, pancakes, and alley routes.',
    array['traditional', 'history'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    40
  ),
  (
    'gwangjang-market',
    'Gwangjang Market',
    '광장시장',
    'Market food area known for classic Seoul street food.',
    array['market', 'street_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    50
  ),
  (
    'sindang',
    'Sindang',
    '신당동',
    'Seoul tteokbokki district for spicy snack routes.',
    array['tteokbokki', 'street_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    60
  ),
  (
    'dongdaemun',
    'Dongdaemun',
    '동대문',
    'Central Seoul area for late food, markets, and dakhanmari routes.',
    array['market', 'late_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    70
  ),
  (
    'jangchung',
    'Jangchung-dong',
    '장충동',
    'Seoul area associated with jokbal and shared late meals.',
    array['jokbal', 'shared_meal'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    80
  ),
  (
    'mapo',
    'Mapo',
    '마포',
    'Seoul dining area for BBQ, grilled dishes, and nightlife routes.',
    array['bbq', 'night_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    90
  ),
  (
    'incheon',
    'Incheon',
    '인천',
    'Port city launch region for Chinatown, market snacks, and seafood routes.',
    array['port_city', 'chinatown', 'market'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    100
  ),
  (
    'suwon',
    'Suwon',
    '수원',
    'Gyeonggi city known for galbi and short-trip food routes.',
    array['galbi', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    110
  ),
  (
    'uijeongbu',
    'Uijeongbu',
    '의정부',
    'Gyeonggi city strongly associated with budae-jjigae.',
    array['budae_jjigae', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    120
  ),
  (
    'anyang',
    'Anyang',
    '안양',
    'Gyeonggi city candidate for local market food discovery.',
    array['market', 'local_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    130
  ),
  (
    'icheon',
    'Icheon',
    '이천',
    'Gyeonggi city known for rice-table dining.',
    array['rice', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    140
  ),
  (
    'pocheon',
    'Pocheon',
    '포천',
    'Gyeonggi day-trip city associated with Idong galbi.',
    array['galbi', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    150
  ),
  (
    'yangpyeong',
    'Yangpyeong',
    '양평',
    'Gyeonggi day-trip area for soup and countryside food routes.',
    array['soup', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    160
  ),
  (
    'gapyeong',
    'Gapyeong',
    '가평',
    'Gyeonggi travel area for pine nut and noodle food candidates.',
    array['pine_nut', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    170
  ),
  (
    'namhansanseong',
    'Namhansanseong',
    '남한산성',
    'Fortress and hiking area for chicken soup route candidates.',
    array['hiking', 'chicken_soup'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    180
  ),
  (
    'paju',
    'Paju',
    '파주',
    'Gyeonggi city for ingredient-led soybean food candidates.',
    array['soybean', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    190
  ),
  (
    'ansan',
    'Ansan',
    '안산',
    'Gyeonggi city for multicultural food street discovery.',
    array['multicultural', 'local_food'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    200
  ),
  (
    'yongin',
    'Yongin',
    '용인',
    'Gyeonggi city for market food and family day-trip routes.',
    array['market', 'day_trip'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    210
  ),
  (
    'gwangmyeong',
    'Gwangmyeong',
    '광명',
    'Near-Seoul market food candidate region.',
    array['market', 'near_seoul'],
    'User-reviewed Sprint 3 capital-region content scope.',
    'published',
    220
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_ko = excluded.name_ko,
  intro = excluded.intro,
  best_for_tags = excluded.best_for_tags,
  source_note = excluded.source_note,
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
  source_note,
  status,
  display_order
)
values
  (
    'tteokbokki',
    'Tteokbokki',
    '떡볶이',
    'tteokbokki',
    'Chewy rice cakes in a sweet-spicy sauce, with Sindang as an important Seoul association for this alpha scope.',
    'sweet, spicy, chewy',
    3,
    'Ask for mild sauce if available and pair it with fried snacks.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    10
  ),
  (
    'gireum-tteokbokki',
    'Gireum Tteokbokki',
    '기름떡볶이',
    'gireum tteokbokki',
    'A less saucy oil-style tteokbokki candidate for Seoul market routes.',
    'spicy, oily, chewy',
    2,
    'Good for travelers who want a different tteokbokki texture.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    20
  ),
  (
    'seolleongtang',
    'Seolleongtang',
    '설렁탕',
    'seolleongtang',
    'A mild beef-bone soup that works well for first-time Korean soup discovery.',
    'mild, savory, comforting',
    0,
    'Season at the table with salt and green onion if served separately.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    30
  ),
  (
    'gwangjang-bindaetteok',
    'Gwangjang Bindaetteok',
    '광장시장 빈대떡',
    'bindaetteok',
    'A crispy mung-bean pancake candidate for Seoul market food routes.',
    'crispy, nutty, savory',
    0,
    'Easy to share and approachable for first-time market visitors.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    40
  ),
  (
    'mayak-gimbap',
    'Mayak Gimbap',
    '마약김밥',
    'mayak gimbap',
    'Small seaweed rice rolls often used as a quick market snack candidate.',
    'savory, bite-sized, light',
    0,
    'Good as a snack rather than a full meal.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    50
  ),
  (
    'dakhanmari',
    'Dakhanmari',
    '닭한마리',
    'dakhanmari',
    'A shareable chicken hot pot candidate for central Seoul food routes.',
    'warm, savory, shareable',
    1,
    'The dipping sauce may be spicy; taste it first.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    60
  ),
  (
    'jangchung-jokbal',
    'Jangchung Jokbal',
    '장충동 족발',
    'jokbal',
    'Braised pork trotter candidate for shared late meals in Seoul.',
    'savory, rich, chewy',
    1,
    'Contains pork and is usually better for groups.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    70
  ),
  (
    'samgyetang',
    'Samgyetang',
    '삼계탕',
    'samgyetang',
    'Ginseng chicken soup that gives travelers a non-spicy traditional option.',
    'mild, herbal, comforting',
    0,
    'A good choice when someone in the group wants a gentle meal.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    80
  ),
  (
    'myeongdong-kalguksu',
    'Myeongdong Kalguksu',
    '명동 칼국수',
    'kalguksu',
    'Knife-cut noodle soup candidate for a simple Myeongdong lunch.',
    'mild, warm, noodle',
    0,
    'Good for travelers who want a low-spice meal.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    90
  ),
  (
    'seoul-naengmyeon',
    'Seoul Naengmyeon',
    '냉면',
    'naengmyeon',
    'Cold noodle candidate for Seoul summer meals and BBQ pairings.',
    'cold, tangy, refreshing',
    1,
    'Ask about spicy sauce if ordering bibim-style naengmyeon.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    100
  ),
  (
    'korean-bbq',
    'Korean BBQ',
    '고기구이',
    'gogi gui',
    'Grilled meat with wraps, sauces, and side dishes; a high-demand traveler food.',
    'savory, smoky, shareable',
    1,
    'Confirm whether staff help with grilling and whether there is a minimum order.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    110
  ),
  (
    'gopchang-gui',
    'Gopchang Gui',
    '곱창구이',
    'gopchang gui',
    'Grilled intestine candidate for adventurous Seoul dining routes.',
    'rich, chewy, grilled',
    1,
    'Best for adventurous eaters; explain that it is offal.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    120
  ),
  (
    'chimaek',
    'Chimaek',
    '치맥',
    'chimaek',
    'Korean fried chicken with beer or soft drinks, useful for nightlife routes.',
    'crispy, saucy, casual',
    2,
    'Order mixed flavors if the group wants to compare sauces.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    130
  ),
  (
    'hotteok',
    'Hotteok',
    '호떡',
    'hotteok',
    'Sweet filled pancake candidate for market and winter street-snack routes.',
    'sweet, warm, chewy',
    0,
    'The filling can be very hot right after cooking.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    140
  ),
  (
    'bungeoppang',
    'Bungeoppang',
    '붕어빵',
    'bungeoppang',
    'Fish-shaped pastry candidate for seasonal street-snack discovery.',
    'sweet, warm, pastry',
    0,
    'Usually seasonal and availability varies by street stall.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    150
  ),
  (
    'suwon-galbi',
    'Suwon Galbi',
    '수원갈비',
    'suwon galbi',
    'Beef rib BBQ candidate with a strong Suwon city association.',
    'savory, grilled, premium',
    1,
    'Good for groups; check price and portion size before ordering.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    160
  ),
  (
    'uijeongbu-budae-jjigae',
    'Uijeongbu Budae-jjigae',
    '의정부 부대찌개',
    'budae jjigae',
    'Spicy sausage and kimchi stew with a strong Uijeongbu association.',
    'spicy, savory, stew',
    3,
    'Contains processed meat and can be salty or spicy.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    170
  ),
  (
    'incheon-jajangmyeon',
    'Incheon Jajangmyeon',
    '인천 짜장면',
    'jajangmyeon',
    'Black bean noodles with a strong Incheon Chinatown travel hook.',
    'savory, sweet, noodle',
    0,
    'Good for travelers who want a familiar noodle format.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    180
  ),
  (
    'sinpo-dakgangjeong',
    'Sinpo Dakgangjeong',
    '신포 닭강정',
    'dakgangjeong',
    'Sweet-crispy chicken candidate for Incheon market routes.',
    'sweet, crispy, saucy',
    1,
    'Can be eaten as a snack or shared dish.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    190
  ),
  (
    'incheon-seafood',
    'Incheon Seafood',
    '인천 해산물',
    'incheon seafood',
    'Port-city seafood direction for Incheon coastal food planning.',
    'fresh, seafood, coastal',
    0,
    'Check shellfish/seafood allergies before recommending.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    200
  ),
  (
    'anyang-sundae-gopchang',
    'Anyang Sundae Gopchang',
    '안양 순대곱창',
    'sundae gopchang',
    'Sundae and gopchang candidate for Anyang local market discovery.',
    'savory, chewy, market',
    2,
    'Explain blood sausage and offal clearly for travelers.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    210
  ),
  (
    'icheon-rice-table',
    'Icheon Rice Table',
    '이천쌀밥',
    'icheon ssal bap',
    'Rice-table meal candidate built around Icheon rice identity.',
    'mild, varied, set meal',
    0,
    'Good for travelers who want many side dishes in one meal.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    220
  ),
  (
    'pocheon-idong-galbi',
    'Pocheon Idong Galbi',
    '포천 이동갈비',
    'idong galbi',
    'Galbi candidate for Pocheon day-trip food planning.',
    'savory, grilled, shareable',
    1,
    'Plan transportation carefully for day-trip dining.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    230
  ),
  (
    'yangpyeong-haejangguk',
    'Yangpyeong Haejangguk',
    '양평 해장국',
    'haejangguk',
    'Hearty hangover soup candidate for Yangpyeong day-trip routes.',
    'savory, hearty, soup',
    2,
    'May include beef blood or offal depending on style.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    240
  ),
  (
    'gapyeong-pine-nut-makguksu',
    'Gapyeong Pine Nut Makguksu',
    '가평 잣막국수',
    'jat makguksu',
    'Buckwheat noodle candidate tied to Gapyeong pine nut identity.',
    'nutty, cold, noodle',
    1,
    'Mention pine nut allergy risk where relevant.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    250
  ),
  (
    'namhansanseong-dakbaeksuk',
    'Namhansanseong Dakbaeksuk',
    '남한산성 닭백숙',
    'dakbaeksuk',
    'Whole chicken soup candidate for a hiking-and-meal route.',
    'mild, chicken, restorative',
    0,
    'Usually better for groups and slower meals.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    260
  ),
  (
    'paju-jangdan-soybean',
    'Paju Jangdan Soybean Dishes',
    '파주 장단콩 음식',
    'jangdan kong',
    'Soybean-based food candidate for Paju ingredient-led discovery.',
    'nutty, bean, local',
    0,
    'Good for travelers interested in regional ingredients.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    270
  ),
  (
    'ansan-multicultural-food-street',
    'Ansan Multicultural Food Street',
    '안산 다문화거리 음식',
    'ansan multicultural food',
    'Multicultural food street candidate for a broader capital-region food route.',
    'varied, multicultural, casual',
    1,
    'Not strictly K-food; label as a local food culture route.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    280
  ),
  (
    'yongin-market-sundae',
    'Yongin Market Sundae',
    '용인 순대',
    'yongin sundae',
    'Market sundae candidate for Yongin local food discovery.',
    'savory, market, chewy',
    1,
    'Explain blood sausage clearly for first-time travelers.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    290
  ),
  (
    'gwangmyeong-market-food',
    'Gwangmyeong Market Food',
    '광명시장 먹거리',
    'gwangmyeong market food',
    'Near-Seoul market food direction for casual snack discovery.',
    'varied, market, casual',
    1,
    'Use as a market route category until exact signature items are selected.',
    'User-reviewed Sprint 3 capital-region food draft.',
    'published',
    300
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
    'RLS verification draft row.',
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
  source_note = excluded.source_note,
  status = excluded.status,
  display_order = excluded.display_order;

with links(region_slug, food_slug, is_representative, display_order) as (
  values
    ('sindang', 'tteokbokki', true, 10),
    ('myeongdong', 'tteokbokki', false, 20),
    ('seoul', 'tteokbokki', false, 30),
    ('seoul', 'gireum-tteokbokki', false, 40),
    ('seoul', 'seolleongtang', true, 50),
    ('jongno', 'seolleongtang', false, 60),
    ('gwangjang-market', 'gwangjang-bindaetteok', true, 70),
    ('gwangjang-market', 'mayak-gimbap', true, 80),
    ('dongdaemun', 'dakhanmari', true, 90),
    ('jongno', 'dakhanmari', false, 100),
    ('jangchung', 'jangchung-jokbal', true, 110),
    ('jongno', 'samgyetang', true, 120),
    ('seoul', 'samgyetang', false, 130),
    ('myeongdong', 'myeongdong-kalguksu', true, 140),
    ('seoul', 'seoul-naengmyeon', false, 150),
    ('mapo', 'korean-bbq', true, 160),
    ('gangnam', 'korean-bbq', false, 170),
    ('hongdae', 'korean-bbq', false, 180),
    ('seoul', 'korean-bbq', false, 190),
    ('mapo', 'gopchang-gui', true, 200),
    ('seoul', 'gopchang-gui', false, 210),
    ('hongdae', 'chimaek', true, 220),
    ('gangnam', 'chimaek', false, 230),
    ('seoul', 'chimaek', false, 240),
    ('seoul', 'hotteok', false, 250),
    ('gwangjang-market', 'hotteok', false, 260),
    ('seoul', 'bungeoppang', false, 270),
    ('suwon', 'suwon-galbi', true, 280),
    ('uijeongbu', 'uijeongbu-budae-jjigae', true, 290),
    ('incheon', 'incheon-jajangmyeon', true, 300),
    ('incheon', 'sinpo-dakgangjeong', true, 310),
    ('incheon', 'incheon-seafood', false, 320),
    ('anyang', 'anyang-sundae-gopchang', true, 330),
    ('icheon', 'icheon-rice-table', true, 340),
    ('pocheon', 'pocheon-idong-galbi', true, 350),
    ('yangpyeong', 'yangpyeong-haejangguk', true, 360),
    ('gapyeong', 'gapyeong-pine-nut-makguksu', true, 370),
    ('namhansanseong', 'namhansanseong-dakbaeksuk', true, 380),
    ('paju', 'paju-jangdan-soybean', true, 390),
    ('ansan', 'ansan-multicultural-food-street', true, 400),
    ('yongin', 'yongin-market-sundae', true, 410),
    ('gwangmyeong', 'gwangmyeong-market-food', true, 420)
)
insert into public.region_foods (
  region_id,
  food_id,
  is_representative,
  display_order
)
select
  regions.id,
  foods.id,
  links.is_representative,
  links.display_order
from links
join public.regions on regions.slug = links.region_slug
join public.foods on foods.slug = links.food_slug
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
