-- 013_content_schedule_dates.sql
-- 기획 캘린더용 날짜. 기획·제작에 날짜를 넣으면 캘린더 탭에 날짜순으로 모인다.
--
-- content_plans.target_week(텍스트 "2026 W21")은 지우지 않고 남겨둔다.
-- 화면에서는 날짜만 입력받고 주차는 날짜에서 계산해 표시한다.

alter table public.content_plans
  add column if not exists target_date date;

alter table public.productions
  add column if not exists scheduled_date date;

create index if not exists content_plans_target_date_idx
  on public.content_plans(target_date);

create index if not exists productions_scheduled_date_idx
  on public.productions(scheduled_date);
