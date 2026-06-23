create policy "profiles_user_insert_own"
on public.profiles for insert to authenticated
with check (
  id = auth.uid()
  and role = 'user'::public.user_role
);
