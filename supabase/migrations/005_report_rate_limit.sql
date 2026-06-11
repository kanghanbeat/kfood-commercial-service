alter table public.content_reports
  add column if not exists reporter_fingerprint text,
  add column if not exists rate_limit_window timestamptz;

create index if not exists content_reports_reporter_window_idx
on public.content_reports(reporter_fingerprint, rate_limit_window);

create table if not exists public.report_submission_windows (
  reporter_fingerprint text not null,
  window_start timestamptz not null,
  submission_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (reporter_fingerprint, window_start),
  constraint report_submission_windows_count_positive
    check (submission_count >= 0)
);

alter table public.report_submission_windows enable row level security;

create or replace function public.register_report_submission(
  p_reporter_fingerprint text,
  p_window_start timestamptz,
  p_limit integer default 5
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  registered_count integer;
begin
  if p_reporter_fingerprint is null
    or length(p_reporter_fingerprint) < 32
    or p_window_start is null
    or p_limit < 1
  then
    return false;
  end if;

  insert into public.report_submission_windows (
    reporter_fingerprint,
    window_start,
    submission_count,
    updated_at
  )
  values (
    p_reporter_fingerprint,
    p_window_start,
    1,
    now()
  )
  on conflict (reporter_fingerprint, window_start)
  do update set
    submission_count = public.report_submission_windows.submission_count + 1,
    updated_at = now()
  where public.report_submission_windows.submission_count < p_limit
  returning submission_count into registered_count;

  return registered_count is not null;
end;
$$;

revoke all on function public.register_report_submission(text, timestamptz, integer)
from public;

grant execute on function public.register_report_submission(text, timestamptz, integer)
to anon, authenticated;
