-- seed-shoot-logs-yeosu.sql
-- 여수 1차·2차 촬영 일지 실데이터. 솔이 남긴 촬영 메모를 그대로 옮긴 것.
-- 여러 번 실행해도 안전하다(같은 제목의 회차가 이미 있으면 아무것도 넣지 않는다).
-- 016_shoot_logs.sql 적용 후 실행.

-- ── 여수 1차 (4/3~4/4) ────────────────────────────────────
with new_log as (
  insert into public.shoot_logs
    (round_no, title, region_name, start_date, end_date, status, summary)
  select 1, '여수 1차 촬영', '여수', date '2026-04-03', date '2026-04-04', 'done',
         '게장·장어·선어회 중심. 숙소 디아크리조트.'
  where not exists (
    select 1 from public.shoot_logs where title = '여수 1차 촬영'
  )
  returning id
)
insert into public.shoot_log_stops
  (shoot_log_id, day_number, sort_order, name, category, menu, naver_url, note)
select new_log.id, v.day_number, v.sort_order, v.name,
       v.category::public.shoot_stop_category, v.menu, v.naver_url, v.note
from new_log,
  (values
    (1, 10, '꽃돌게장 1번가', 'meal',    '게장'::text,          'https://naver.me/5eUcAaf8'::text, null::text),
    (1, 20, '디아크리조트',   'stay',    null,                  null,                              '숙소'),
    (1, 30, '자매식당',       'meal',    '장어탕, 장어구이',    null,                              null),
    (1, 40, '해오름선어',     'meal',    '선어회',              'https://naver.me/x2YwlXwE',       null),
    (1, 50, '솔레일',         'cafe',    '롤케이크',            'https://naver.me/IMyGOwyy',       null),
    (2, 10, '바다김밥',       'takeout', null,                  'https://naver.me/GctrGqks',       '포장'),
    (2, 20, '산해반점',       'meal',    null,                  'https://naver.me/5BcjDcqu',       null),
    (2, 30, '여수에서',       'cafe',    null,                  'https://naver.me/G8s9ENYL',       null)
  ) as v(day_number, sort_order, name, category, menu, naver_url, note);

-- ── 여수 2차 (4/30~5/3, 돌아오는 길에 군산) ────────────────
with new_log as (
  insert into public.shoot_logs
    (round_no, title, region_name, start_date, end_date, status, summary)
  select 2, '여수 2차 촬영', '여수 (돌아오는 길에 군산)',
         date '2026-04-30', date '2026-05-03', 'done',
         '3박 4일. 향일암·오동도·퍼레이드까지 관광 컷 확보.'
  where not exists (
    select 1 from public.shoot_logs where title = '여수 2차 촬영'
  )
  returning id
)
insert into public.shoot_log_stops
  (shoot_log_id, day_number, sort_order, name, category, menu, naver_url, note)
select new_log.id, v.day_number, v.sort_order, v.name,
       v.category::public.shoot_stop_category, v.menu, v.naver_url, v.note
from new_log,
  (values
    (1, 10, '한꾼에88',    'dinner',    null::text,   'https://naver.me/GeURDn2P'::text, null::text),
    (1, 20, '여수 시내',   'sight',     null,         null,                             '중앙로, 진남관 간단히 구경'),
    (1, 30, '구봉만두',    'meal',      null,         'https://naver.me/x9BN28M8',      null),
    (2, 10, '복춘식당',    'breakfast', '아구찜',     'https://naver.me/x0UP1ewT',      null),
    (2, 20, '향일암',      'sight',     null,         'https://naver.me/FBe2dBTL',      null),
    (2, 30, '모아핀',      'cafe',      null,         'https://naver.me/GNWk7rNj',      null),
    (2, 40, '무슬소리',    'cafe',      null,         'https://naver.me/5LHsFeru',      '잠깐 들름'),
    (2, 50, '이순신버거',  'dinner',    null,         'https://naver.me/xs3G1VRe',      null),
    (2, 60, '로타리분식',  'dinner',    null,         'https://naver.me/xRhOv2n9',      null),
    (2, 70, '퍼레이드',    'event',     null,         null,                             '구경'),
    (2, 80, '아주커치킨',  'snack',     null,         null,                             '숙소 들어와서'),
    (3, 10, '순심원',      'breakfast', '철판짜장',   'https://naver.me/5CW7Zu3Z',      null),
    (3, 20, '바다김밥',    'takeout',   null,         'https://naver.me/5BcjDcqu',      '포장'),
    (3, 30, '오동도',      'sight',     null,         'https://naver.me/Fuz5ZuR5',      null),
    (3, 40, '명동게장',    'meal',      null,         'https://naver.me/5CW7xpWZ',      null),
    (4, 10, '일해옥',      'meal',      '국밥',       'https://naver.me/xxY2bXVI',      '군산 들러서')
  ) as v(day_number, sort_order, name, category, menu, naver_url, note);
