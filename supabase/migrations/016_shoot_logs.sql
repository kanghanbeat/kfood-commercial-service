-- 016_shoot_logs.sql
-- 촬영 일지: "어디에 다녀와서 무엇을 찍었나"를 남기는 내부 기록.
-- 인사이트 → 기획(content_plans) → 촬영(shoot_logs) → 제작(productions) 흐름의 촬영 단계.
--
-- 두 테이블로 나눈다.
--   shoot_logs      : 촬영 회차 하나 (예: "2차 여수 촬영, 4/30~5/3")
--   shoot_log_stops : 그 회차에 들른 곳 하나하나 (식당·카페·숙소·명소)
-- 공개 사이트에는 노출되지 않는다(내부 기록이라 public select 정책 없음).
-- 001/002/012 컨벤션 준수(감사 로그는 앱 레이어에서 admin_audit_logs에 기록).

do $$
begin
  -- planned: 예정 / in_progress: 촬영 중 / done: 다녀옴(기록 완료)
  create type public.shoot_log_status as enum ('planned', 'in_progress', 'done');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  -- 들른 곳의 성격. 나중에 장소 콘텐츠로 옮길 때 분류 기준이 된다.
  create type public.shoot_stop_category as enum (
    'breakfast', -- 아침
    'lunch',     -- 점심
    'dinner',    -- 저녁
    'snack',     -- 간식·야식
    'meal',      -- 식사 (시간 미정)
    'cafe',      -- 카페·디저트
    'takeout',   -- 포장
    'stay',      -- 숙소
    'sight',     -- 관광·명소
    'event',     -- 축제·행사
    'etc'        -- 기타
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.shoot_logs (
  id uuid primary key default gen_random_uuid(),
  -- 회차 번호 (1차, 2차 …). 같은 지역을 여러 번 갈 때 구분용
  round_no integer,
  -- 촬영 제목 (예: "여수 2차 촬영")
  title text not null,
  -- 다녀온 지역 (예: "여수", "여수·군산")
  region_name text,
  start_date date,
  end_date date,
  status public.shoot_log_status not null default 'done',
  -- 이번 촬영 한 줄 요약
  summary text,
  -- 다음 촬영에 참고할 점 (동선·시간대·조명·웨이팅 등)
  lesson text,
  -- 이 촬영으로 만든 제작 콘텐츠
  production_id uuid references public.productions(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shoot_logs_start_date_idx on public.shoot_logs(start_date);
create index if not exists shoot_logs_status_idx on public.shoot_logs(status);
create index if not exists shoot_logs_production_idx on public.shoot_logs(production_id);

create table if not exists public.shoot_log_stops (
  id uuid primary key default gen_random_uuid(),
  shoot_log_id uuid not null references public.shoot_logs(id) on delete cascade,
  -- 며칠차에 들렀는지 (1일차 = 1)
  day_number integer not null default 1,
  -- 같은 날 안에서의 순서
  sort_order integer not null default 100,
  -- 상호명 (예: "꽃돌게장 1번가")
  name text not null,
  category public.shoot_stop_category not null default 'meal',
  -- 먹은 메뉴 / 찍은 대상 (예: "게장", "장어탕, 장어구이")
  menu text,
  naver_url text,
  google_url text,
  -- 실제로 촬영했는지 (들르기만 한 곳과 구분)
  shot boolean not null default false,
  -- 1~5점. 콘텐츠로 쓸 만한지 판단용
  rating smallint check (rating is null or (rating between 1 and 5)),
  -- 맛·분위기·촬영 조건 메모 (예: "웨이팅 30분, 내부 어두움")
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shoot_log_stops_log_idx
  on public.shoot_log_stops(shoot_log_id, day_number, sort_order);

alter table public.shoot_logs enable row level security;
alter table public.shoot_log_stops enable row level security;

drop policy if exists "shoot_logs_editor_manage" on public.shoot_logs;
drop policy if exists "shoot_log_stops_editor_manage" on public.shoot_log_stops;

-- 내부 촬영 기록이라 공개 select 정책을 두지 않는다(에디터·관리자만 접근).
create policy "shoot_logs_editor_manage"
on public.shoot_logs for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "shoot_log_stops_editor_manage"
on public.shoot_log_stops for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
