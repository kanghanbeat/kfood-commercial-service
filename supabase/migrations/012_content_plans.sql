-- 012_content_plans.sql
-- 콘텐츠 기획: "무엇을 만들 것인가"를 적어두는 내부 테이블.
-- 인사이트에서 발견한 주제 → 기획 → 제작(productions) 흐름의 첫 단계.
--
-- 공개 사이트에는 노출되지 않는다(내부 기획 메모라 public select 정책 없음).
-- 제작으로 이어지면 production_id로 연결된다.
-- 001/002/008 컨벤션 준수(감사 로그는 앱 레이어에서 admin_audit_logs에 기록).

do $$
begin
  create type public.content_plan_priority as enum ('high', 'medium', 'low');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  -- planned: 대기(착수 전) / in_progress: 제작·검수 중 / published: 발행 완료
  -- dropped: 하지 않기로 한 기획(기록은 남김)
  create type public.content_plan_status as enum (
    'planned',
    'in_progress',
    'published',
    'dropped'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.content_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  category text,
  priority public.content_plan_priority not null default 'medium',
  status public.content_plan_status not null default 'planned',
  -- 이 기획을 하게 된 근거 (예: "TikTok 1위 · 이번 주 조회수 12.4M")
  insight_note text,
  -- 목표 주차 (예: "2026 W21")
  target_week text,
  -- 기획 메모: 콘셉트·구성·촬영 준비물 등
  body text,
  -- 제작으로 이어졌을 때 연결되는 촬영·제작 콘텐츠
  production_id uuid references public.productions(id) on delete set null,
  display_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_plans_status_idx on public.content_plans(status);
create index if not exists content_plans_target_week_idx on public.content_plans(target_week);
create index if not exists content_plans_production_idx on public.content_plans(production_id);

alter table public.content_plans enable row level security;

drop policy if exists "content_plans_editor_manage" on public.content_plans;

-- 내부 기획 문서라 공개 select 정책을 두지 않는다(에디터·관리자만 접근).
create policy "content_plans_editor_manage"
on public.content_plans for all to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());
