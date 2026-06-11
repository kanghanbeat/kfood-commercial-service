alter table public.places
  add column if not exists business_hours_note text,
  add column if not exists business_info_note text;
