-- 장소 보강: 신규 음식 20종 ↔ 장소 연결 — 2026-07-08, 솔
-- 1) 지역 단위(area-level) 신규 장소 4곳 추가
-- 2) 기존/신규 장소 ↔ 신규 음식 place_foods 연결 13건
-- 확실한 연관만 넣는다(우래옥=불고기, 광장시장=육회 등). 애매한 음식은 비워둔다.
-- 재실행 안전: on conflict do nothing. 되돌리기: 아래 slug로 delete.

insert into public.places
  (slug, region_id, name_en, name_ko, editorial_note, trust_tags, caution_tags, display_order, status)
select v.slug, r.id, v.name_en, v.name_ko, v.editorial_note,
       v.trust_tags::text[], v.caution_tags::text[], v.display_order, 'published'
from (values
  ('hongdae-dakgalbi-area', 'hongdae',
   'Hongdae Dak Galbi Area', '홍대 닭갈비 골목',
   'A casual cluster of dak-galbi and jjimdak restaurants suited to groups and budget dinners before a night out.',
   '{"budget_friendly","group_friendly"}', '{"weekend_wait"}', 610),
  ('insadong-bibimbap-area', 'jongno',
   'Insadong Bibimbap Area', '인사동 비빔밥 거리',
   'Traditional dining streets around Insadong where bibimbap and Korean table sets fit a culture-walk day.',
   '{"traditional","tourist_friendly"}', '{"peak_lunch_queue"}', 620),
  ('dongdaemun-gamjatang-alley', 'dongdaemun',
   'Dongdaemun Gamjatang Alley', '동대문 감자탕 골목',
   'Late-night gamjatang spots near the market blocks — a warming stop after shopping or a night walk.',
   '{"late_hours","hearty"}', '{"crowded_late_night"}', 630),
  ('gangnam-dessert-cafe-area', 'gangnam',
   'Gangnam Dessert Cafe Area', '강남 디저트 카페 거리',
   'Polished dessert cafes around Gangnam where bingsu and seasonal desserts anchor an afternoon break.',
   '{"modern","card_accepted"}', '{"prices_vary"}', 640)
) as v(slug, region_slug, name_en, name_ko, editorial_note, trust_tags, caution_tags, display_order)
join public.regions r on r.slug = v.region_slug
on conflict (slug) do nothing;

insert into public.place_foods (place_id, food_id, display_order)
select p.id, f.id, v.display_order
from (values
  ('wooraeok',                    'bulgogi',        10),
  ('mapo-jeong-daepo',            'samgyeopsal',    20),
  ('gwangjang-market',            'yukhoe',         30),
  ('gwangjang-market',            'sundae',         40),
  ('gwangjang-market',            'gimbap',         50),
  ('gwangjang-market',            'haemul-pajeon',  60),
  ('myeongdong-street-food-loop', 'eomuk',          70),
  ('myeongdong-street-food-loop', 'gyeranppang',    80),
  ('hongdae-dakgalbi-area',       'dak-galbi',      90),
  ('hongdae-dakgalbi-area',       'jjimdak',       100),
  ('insadong-bibimbap-area',      'bibimbap',      110),
  ('dongdaemun-gamjatang-alley',  'gamjatang',     120),
  ('gangnam-dessert-cafe-area',   'bingsu',        130)
) as v(place_slug, food_slug, display_order)
join public.places p on p.slug = v.place_slug
join public.foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;
