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

with place_seed (
  slug,
  region_slug,
  name_en,
  name_ko,
  editorial_note,
  tourist_tags,
  trust_tags,
  caution_tags,
  display_order
) as (
  values
    ('sindang-tteokbokki-town', 'sindang', 'Sindang-dong Tteokbokki Town', '신당동 떡볶이 타운', 'A practical first stop for spicy tteokbokki in a compact food-street setting.', array['food_street', 'casual'], array['area_level', 'near_transit'], array['confirm_hours', 'spice_varies'], 10),
    ('tongin-market', 'jongno', 'Tongin Market', '통인시장', 'A traditional market candidate for gireum tteokbokki and lunchbox-style browsing near Gyeongbokgung.', array['market', 'daytime'], array['area_level', 'near_palace'], array['confirm_hours', 'stall_availability_varies'], 20),
    ('imun-seolnongtang', 'jongno', 'Imun Seolnongtang', '이문설농탕', 'A historic Seoul seolleongtang candidate for travelers who want a classic soup stop.', array['historic', 'soup'], array['restaurant_candidate', 'heritage_story'], array['confirm_hours', 'queues_possible'], 30),
    ('gwangjang-market', 'gwangjang-market', 'Gwangjang Market', '광장시장', 'A high-signal market stop for bindaetteok, mayak gimbap, and beginner-friendly Korean market eating.', array['market', 'street_food'], array['area_level', 'tourist_friendly'], array['crowds', 'prices_vary_by_stall'], 40),
    ('dongdaemun-dakhanmari-alley', 'dongdaemun', 'Dongdaemun Dak Hanmari Alley', '동대문 닭한마리 골목', 'A dish-specific alley for whole-chicken soup, shared pots, noodles, and a longer seated meal.', array['food_alley', 'group_meal'], array['area_level', 'dish_specific'], array['shared_pot', 'portion_size'], 50),
    ('jangchung-jokbal-street', 'jangchung', 'Jangchung-dong Jokbal Street', '장충동 족발 골목', 'A classic Seoul jokbal area suited to late meals, group orders, and anju-style eating.', array['food_street', 'group_meal'], array['area_level', 'dish_specific'], array['portion_size', 'late_hours_vary'], 60),
    ('tosokchon-samgyetang', 'jongno', 'Tosokchon Samgyetang', '토속촌 삼계탕', 'A high-recognition samgyetang candidate near the palace area, useful for a classic chicken-ginseng soup stop.', array['restaurant_candidate', 'palace_area'], array['known_candidate', 'near_transit'], array['queues_possible', 'confirm_hours'], 70),
    ('myeongdong-kyoja', 'myeongdong', 'Myeongdong Kyoja', '명동교자', 'A recognizable Myeongdong kalguksu candidate for a simple noodle meal in a dense shopping district.', array['restaurant_candidate', 'shopping'], array['known_candidate', 'tourist_friendly'], array['queues_possible', 'branch_choice'], 80),
    ('wooraeok', 'seoul', 'Woo Lae Oak', '우래옥', 'A Seoul naengmyeon candidate for travelers interested in cold noodles with a long-standing restaurant story.', array['restaurant_candidate', 'noodles'], array['known_candidate', 'classic_food'], array['confirm_hours', 'price_level_varies'], 90),
    ('mapo-jeong-daepo', 'mapo', 'Mapo Jeong Daepo', '마포정대포', 'A Mapo Korean barbecue candidate for a casual grilled-meat meal and first BBQ route planning.', array['restaurant_candidate', 'bbq'], array['known_candidate', 'group_meal'], array['smoke', 'confirm_hours'], 100),
    ('mapo-gopchang-area', 'mapo', 'Mapo Gopchang Area', '마포 곱창 지역', 'An area-level gopchang candidate that can later be narrowed into specific verified shops.', array['area', 'grill'], array['area_level', 'specialty_cluster'], array['shop_selection_needed', 'strong_flavors'], 110),
    ('hongdae-chimaek-area', 'hongdae', 'Hongdae Chimaek Area', '홍대 치맥 지역', 'A casual evening area candidate for fried chicken, beer, nightlife, and flexible group plans.', array['area', 'nightlife'], array['area_level', 'group_friendly'], array['noise', 'late_hours_vary'], 120),
    ('namdaemun-market-hotteok', 'seoul', 'Namdaemun Market Hotteok Area', '남대문시장 호떡 지역', 'A market-level hotteok candidate for seasonal sweet street-food browsing.', array['market', 'street_food'], array['area_level', 'seasonal'], array['seasonal_availability', 'cash_may_help'], 130),
    ('seoul-winter-bungeoppang-stalls', 'seoul', 'Seoul Winter Bungeoppang Stalls', '서울 겨울 붕어빵 노점', 'A seasonal guidance placeholder for bungeoppang until fixed winter stall data is verified.', array['seasonal', 'street_food'], array['food_only_bridge', 'seasonal'], array['seasonal_availability', 'stall_locations_change'], 140),
    ('suwon-galbi-street', 'suwon', 'Suwon Galbi Street', '수원 갈비 거리', 'A city-signature galbi area for a Gyeonggi day-trip meal centered on marinated beef ribs.', array['food_street', 'day_trip'], array['area_level', 'city_signature'], array['price_level_varies', 'reservation_may_help'], 150),
    ('uijeongbu-budaejjigae-street', 'uijeongbu', 'Uijeongbu Budaejjigae Street', '의정부 부대찌개 거리', 'A dish-specific street for army stew and an easy north-of-Seoul food trip.', array['food_street', 'day_trip'], array['area_level', 'dish_specific'], array['spicy', 'shared_pot'], 160),
    ('incheon-chinatown-jajangmyeon-area', 'incheon', 'Incheon Chinatown Jajangmyeon Area', '인천 차이나타운 자장면 지역', 'A food-history district for jajangmyeon, Chinatown walking, and museum-adjacent context.', array['district', 'food_history'], array['area_level', 'route_ready'], array['crowds', 'restaurant_choice_needed'], 170),
    ('sinpo-international-market', 'incheon', 'Sinpo International Market', '신포국제시장', 'A market-level dakgangjeong candidate that can support an Incheon snack route.', array['market', 'snack'], array['area_level', 'city_signature'], array['queues_possible', 'stall_availability_varies'], 180),
    ('incheon-seafood-market-area', 'incheon', 'Incheon Seafood Market Area', '인천 해산물 시장 지역', 'A seafood-market candidate for seasonal Incheon seafood guidance after exact market choice is confirmed.', array['market', 'seafood'], array['area_level', 'seasonal'], array['prices_vary', 'confirm_market_choice'], 190),
    ('anyang-central-market', 'anyang', 'Anyang Central Market', '안양중앙시장', 'A market-level candidate for sundae, gopchang, and casual local food discovery.', array['market', 'local_food'], array['area_level', 'local_market'], array['stall_availability_varies', 'confirm_hours'], 200),
    ('icheon-rice-table-area', 'icheon', 'Icheon Rice Table Area', '이천 쌀밥 지역', 'A city-level rice-table candidate for Korean set meals built around Icheon rice.', array['area', 'day_trip'], array['city_signature', 'meal_candidate'], array['restaurant_choice_needed', 'travel_time'], 210),
    ('pocheon-idong-galbi-village', 'pocheon', 'Pocheon Idong Galbi Village', '포천 이동갈비촌', 'A day-trip food village candidate centered on Pocheon Idong galbi.', array['food_village', 'day_trip'], array['area_level', 'city_signature'], array['driving_may_help', 'price_level_varies'], 220),
    ('yangpyeong-haejangguk-area', 'yangpyeong', 'Yangpyeong Haejangguk Area', '양평 해장국 지역', 'An area-level haejangguk candidate for a hearty soup stop east of Seoul.', array['area', 'soup'], array['city_signature', 'meal_candidate'], array['restaurant_choice_needed', 'confirm_hours'], 230),
    ('gapyeong-pine-nut-noodle-area', 'gapyeong', 'Gapyeong Pine Nut Noodle Area', '가평 잣국수 지역', 'A Gapyeong pine-nut noodle candidate for travelers pairing food with nature routes.', array['area', 'day_trip'], array['ingredient_region', 'seasonal'], array['dish_wording_to_confirm', 'travel_time'], 240),
    ('namhansanseong-restaurant-area', 'namhansanseong', 'Namhansanseong Restaurant Area', '남한산성 식당 지역', 'A fortress-area chicken soup candidate that pairs food with a heritage walk.', array['area', 'heritage'], array['area_level', 'route_ready'], array['hillside_access', 'confirm_hours'], 250),
    ('paju-jangdan-soybean-area', 'paju', 'Paju Jangdan Soybean Area', '파주 장단콩 지역', 'A Paju soybean-food candidate for future tofu or set-meal verification near day-trip routes.', array['area', 'ingredient'], array['ingredient_region', 'candidate'], array['restaurant_choice_needed', 'travel_time'], 260),
    ('ansan-wongok-multicultural-food-street', 'ansan', 'Wongok-dong Multicultural Food Street', '원곡동 다문화 음식거리', 'A multicultural food-street candidate for a different side of capital-region food discovery.', array['food_street', 'multicultural'], array['area_level', 'distinctive'], array['cuisine_scope_varies', 'confirm_current_name'], 270),
    ('yongin-jungang-market', 'yongin', 'Yongin Jungang Market', '용인중앙시장', 'A local market candidate for sundae and simple food stops near central Yongin.', array['market', 'local_food'], array['area_level', 'near_transit'], array['stall_availability_varies', 'confirm_hours'], 280),
    ('gwangmyeong-traditional-market', 'gwangmyeong', 'Gwangmyeong Traditional Market', '광명전통시장', 'A market-level candidate for broad Gyeonggi snack and meal discovery.', array['market', 'local_food'], array['area_level', 'near_seoul'], array['food_items_to_confirm', 'crowds'], 290),
    ('myeongdong-street-food-loop', 'myeongdong', 'Myeongdong Street Food Loop', '명동 길거리 음식 루프', 'A beginner-friendly evening walk for snacks, shopping, and easy transit.', array['first_time', 'shopping'], array['tourist_friendly', 'near_transit'], array['prices_vary_by_stall'], 300)
)
insert into public.places (
  slug,
  region_id,
  name_en,
  name_ko,
  editorial_note,
  google_maps_url,
  naver_maps_url,
  tourist_tags,
  trust_tags,
  caution_tags,
  business_hours_note,
  business_info_note,
  last_verified_at,
  status,
  display_order
)
select
  place_seed.slug,
  regions.id,
  place_seed.name_en,
  place_seed.name_ko,
  place_seed.editorial_note,
  'https://www.google.com/maps/search/?api=1&query=' || replace(place_seed.name_en, ' ', '+'),
  'https://map.naver.com/p/search/' || replace(place_seed.name_ko, ' ', '%20'),
  place_seed.tourist_tags,
  place_seed.trust_tags,
  place_seed.caution_tags,
  case
    when 'area_level' = any(place_seed.trust_tags) then
      'Area-level guide. Opening hours vary by individual shop or stall, so check the linked live map before visiting.'
    when 'seasonal' = any(place_seed.tourist_tags) then
      'Seasonal availability can change quickly. Check the linked live map and recent reviews before visiting.'
    when 'restaurant_candidate' = any(place_seed.tourist_tags) then
      'Restaurant hours, break times, last orders, and holidays can change. Check the linked live map before visiting.'
    when 'market' = any(place_seed.tourist_tags) then
      'Market and stall hours can vary by vendor and day. Check the linked live map before visiting.'
    else
      'Business hours are not independently verified yet. Check the linked live map before visiting.'
  end,
  case
    when 'area_level' = any(place_seed.trust_tags) then
      'This is an area-level place direction, not a single verified storefront. Use map results to choose a current shop.'
    when 'restaurant_candidate' = any(place_seed.tourist_tags) then
      'This is a restaurant candidate. Confirm the exact branch, current operation, and queue/reservation conditions.'
    when 'market' = any(place_seed.tourist_tags) then
      'This is a market-level candidate. Individual stalls, prices, menus, and availability may change.'
    else
      'Confirm address, current operation, and route fit in the linked map before relying on this place.'
  end,
  current_date,
  'published',
  place_seed.display_order
from place_seed
join public.regions on regions.slug = place_seed.region_slug
on conflict (slug) do update
set
  region_id = excluded.region_id,
  name_en = excluded.name_en,
  name_ko = excluded.name_ko,
  editorial_note = excluded.editorial_note,
  google_maps_url = excluded.google_maps_url,
  naver_maps_url = excluded.naver_maps_url,
  tourist_tags = excluded.tourist_tags,
  trust_tags = excluded.trust_tags,
  caution_tags = excluded.caution_tags,
  business_hours_note = excluded.business_hours_note,
  business_info_note = excluded.business_info_note,
  last_verified_at = excluded.last_verified_at,
  status = excluded.status,
  display_order = excluded.display_order;

with links (place_slug, food_slug, is_signature, display_order) as (
  values
    ('sindang-tteokbokki-town', 'tteokbokki', true, 10),
    ('tongin-market', 'gireum-tteokbokki', true, 20),
    ('imun-seolnongtang', 'seolleongtang', true, 30),
    ('gwangjang-market', 'gwangjang-bindaetteok', true, 40),
    ('gwangjang-market', 'mayak-gimbap', true, 50),
    ('dongdaemun-dakhanmari-alley', 'dakhanmari', true, 60),
    ('jangchung-jokbal-street', 'jangchung-jokbal', true, 70),
    ('tosokchon-samgyetang', 'samgyetang', true, 80),
    ('myeongdong-kyoja', 'myeongdong-kalguksu', true, 90),
    ('wooraeok', 'seoul-naengmyeon', true, 100),
    ('mapo-jeong-daepo', 'korean-bbq', true, 110),
    ('mapo-gopchang-area', 'gopchang-gui', true, 120),
    ('hongdae-chimaek-area', 'chimaek', true, 130),
    ('namdaemun-market-hotteok', 'hotteok', true, 140),
    ('seoul-winter-bungeoppang-stalls', 'bungeoppang', true, 150),
    ('suwon-galbi-street', 'suwon-galbi', true, 160),
    ('uijeongbu-budaejjigae-street', 'uijeongbu-budae-jjigae', true, 170),
    ('incheon-chinatown-jajangmyeon-area', 'incheon-jajangmyeon', true, 180),
    ('sinpo-international-market', 'sinpo-dakgangjeong', true, 190),
    ('incheon-seafood-market-area', 'incheon-seafood', true, 200),
    ('anyang-central-market', 'anyang-sundae-gopchang', true, 210),
    ('icheon-rice-table-area', 'icheon-rice-table', true, 220),
    ('pocheon-idong-galbi-village', 'pocheon-idong-galbi', true, 230),
    ('yangpyeong-haejangguk-area', 'yangpyeong-haejangguk', true, 240),
    ('gapyeong-pine-nut-noodle-area', 'gapyeong-pine-nut-makguksu', true, 250),
    ('namhansanseong-restaurant-area', 'namhansanseong-dakbaeksuk', true, 260),
    ('paju-jangdan-soybean-area', 'paju-jangdan-soybean', true, 270),
    ('ansan-wongok-multicultural-food-street', 'ansan-multicultural-food-street', true, 280),
    ('yongin-jungang-market', 'yongin-market-sundae', true, 290),
    ('gwangmyeong-traditional-market', 'gwangmyeong-market-food', true, 300),
    ('myeongdong-street-food-loop', 'tteokbokki', false, 310),
    ('myeongdong-street-food-loop', 'hotteok', false, 320),
    ('myeongdong-street-food-loop', 'bungeoppang', false, 330)
)
insert into public.place_foods (
  place_id,
  food_id,
  is_signature,
  display_order
)
select
  places.id,
  foods.id,
  links.is_signature,
  links.display_order
from links
join public.places on places.slug = links.place_slug
join public.foods on foods.slug = links.food_slug
on conflict (place_id, food_id) do update
set
  is_signature = excluded.is_signature,
  display_order = excluded.display_order;

with route_seed (
  slug,
  region_slug,
  title,
  summary,
  estimated_duration,
  transport_mode,
  recommended_for_tags,
  display_order
) as (
  values
    ('seoul-first-time-street-food', 'seoul', 'Seoul First-Time Street Food', 'A compact beginner route linking Myeongdong, Gwangjang Market, and Dongdaemun-style comfort food.', 'Half day', 'subway and walk', array['first_time', 'street_food', 'market'], 10),
    ('historic-seoul-soups-and-noodles', 'jongno', 'Historic Seoul Soups and Noodles', 'A slower Seoul route for classic soup and noodle candidates near Jongno and Myeongdong.', 'Half day', 'subway and walk', array['classic_food', 'soup', 'noodles'], 20),
    ('incheon-food-origins', 'incheon', 'Incheon Food Origins', 'A day-trip route for Chinatown jajangmyeon, Sinpo dakgangjeong, and seafood-market context.', 'Day trip', 'subway and walk', array['day_trip', 'food_history', 'market'], 30),
    ('gyeonggi-signature-day-trips', 'suwon', 'Gyeonggi Signature Day Trips', 'A planning route for signature Gyeonggi foods across Suwon, Uijeongbu, Pocheon, Icheon, and nearby cities.', 'Multi-stop planning', 'rail, bus, or car', array['day_trip', 'signature_food', 'planning'], 40),
    ('myeongdong-first-night', 'myeongdong', 'Myeongdong First Night', 'A low-risk first evening route for snacks, shopping, and easy transit.', '90 minutes', 'walk', array['first_time', 'street_food'], 50)
)
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
  route_seed.slug,
  regions.id,
  route_seed.title,
  route_seed.summary,
  route_seed.estimated_duration,
  route_seed.transport_mode,
  route_seed.recommended_for_tags,
  'published',
  route_seed.display_order
from route_seed
join public.regions on regions.slug = route_seed.region_slug
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

with route_links (route_slug, place_slug, step_order, step_note) as (
  values
    ('seoul-first-time-street-food', 'myeongdong-street-food-loop', 1, 'Start with an easy shopping-district snack loop.'),
    ('seoul-first-time-street-food', 'gwangjang-market', 2, 'Continue to a market stop for bindaetteok and mayak gimbap.'),
    ('seoul-first-time-street-food', 'dongdaemun-dakhanmari-alley', 3, 'End with a seated shared-pot meal if the group wants dinner.'),
    ('historic-seoul-soups-and-noodles', 'imun-seolnongtang', 1, 'Begin with a classic Seoul soup candidate.'),
    ('historic-seoul-soups-and-noodles', 'myeongdong-kyoja', 2, 'Add a tourist-friendly kalguksu stop in Myeongdong.'),
    ('historic-seoul-soups-and-noodles', 'wooraeok', 3, 'Use the naengmyeon candidate as a separate meal stop.'),
    ('incheon-food-origins', 'incheon-chinatown-jajangmyeon-area', 1, 'Start with Chinatown and jajangmyeon history.'),
    ('incheon-food-origins', 'sinpo-international-market', 2, 'Add a market snack stop for dakgangjeong.'),
    ('incheon-food-origins', 'incheon-seafood-market-area', 3, 'Use the seafood market area as an optional final stop after verification.'),
    ('gyeonggi-signature-day-trips', 'suwon-galbi-street', 1, 'Use Suwon galbi as the strongest first Gyeonggi day-trip anchor.'),
    ('gyeonggi-signature-day-trips', 'uijeongbu-budaejjigae-street', 2, 'Plan Uijeongbu as a separate north-of-Seoul stew trip.'),
    ('gyeonggi-signature-day-trips', 'pocheon-idong-galbi-village', 3, 'Treat Pocheon as a car-friendly or long day-trip option.'),
    ('gyeonggi-signature-day-trips', 'icheon-rice-table-area', 4, 'Use Icheon rice-table meals as another separate day-trip branch.'),
    ('gyeonggi-signature-day-trips', 'namhansanseong-restaurant-area', 5, 'Pair fortress walking with chicken soup candidates after transport checks.'),
    ('myeongdong-first-night', 'myeongdong-street-food-loop', 1, 'Start with a compact snack loop near transit and shopping streets.')
)
insert into public.route_guide_places (
  route_guide_id,
  place_id,
  step_order,
  step_note
)
select
  route_guides.id,
  places.id,
  route_links.step_order,
  route_links.step_note
from route_links
join public.route_guides on route_guides.slug = route_links.route_slug
join public.places on places.slug = route_links.place_slug
on conflict (route_guide_id, place_id) do update
set
  step_order = excluded.step_order,
  step_note = excluded.step_note;
