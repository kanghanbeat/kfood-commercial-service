# Mypage Profile Architecture Design

Status: Draft for owner review  
Date: 2026-06-29  
Related capability: `docs/01-product/mypage-profile.capability.md`

## 1. Context

The current service has:

- Supabase Auth public user foundation
- `profiles` table with `id`, `display_name`, `role`, `is_active`, timestamps
- `/mypage` shell
- `/profile` redirecting to `/mypage`
- public user profile insert policy
- admin/editor authorization based on `profiles.role`

The next step is to make `/mypage` useful before building Feed upload, likes,
follows, or recommendation personalization.

## 2. Selected Direction

Use Option C: staged profile expansion.

Implement now:

```text
display_name
bio
preferred_language
```

Defer:

```text
username
public_profile_enabled
```

Exclude:

```text
avatar_url
```

`avatar_url` is intentionally excluded because profile image handling should be
designed with user post image upload, storage policy, moderation, and deletion
rules.

## 3. Architecture Options

### Option A: Minimal Change

Only expose existing `display_name` in `/mypage`.

Pros:

- smallest migration impact
- low security risk

Cons:

- does not prepare language-aware UX
- bio still missing for future Feed cards

### Option B: Full Profile Model

Add `username`, `avatar_url`, `bio`, `preferred_language`, and public profile
settings now.

Pros:

- closer to a mature social profile

Cons:

- too much policy surface at once
- avatar introduces storage and image safety work
- username needs collision, reserved word, and public URL rules

### Option C: Staged Profile Model

Add only `bio` and `preferred_language`, keep `display_name`, and defer
username/public-profile work.

Pros:

- gives Mypage real value
- prepares Feed and translation
- avoids image upload/storage work
- keeps admin authorization safer

Cons:

- no public username yet
- no avatar visual identity

Recommendation: Option C.

## 4. Database Change

Current table:

```sql
public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'user',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

Proposed migration:

```sql
alter table public.profiles
  add column if not exists bio text,
  add column if not exists preferred_language text not null default 'en';

alter table public.profiles
  add constraint profiles_preferred_language_check
  check (preferred_language in ('ko', 'en', 'ja', 'zh'));
```

Optional field checks:

```sql
alter table public.profiles
  add constraint profiles_display_name_length_check
  check (display_name is null or char_length(display_name) <= 80),
  add constraint profiles_bio_length_check
  check (bio is null or char_length(bio) <= 240);
```

Do not add:

```sql
avatar_url
```

## 5. RLS Policy Direction

Existing policies:

- users can select own profile
- admins can select all profiles
- admins can update all profiles
- users can insert own public profile with `role = 'user'`

Needed for Mypage profile editing:

```sql
create policy "profiles_user_update_own_public_fields"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = 'user'::public.user_role
  and is_active = true
);
```

Important caveat:

Postgres RLS `with check` does not limit columns by itself. Application code
must update only:

```text
display_name
bio
preferred_language
updated_at
```

Do not expose a generic profile update API that accepts arbitrary fields.

If stricter column-level enforcement is desired, use a security-definer RPC:

```text
public.update_my_profile(display_name, bio, preferred_language)
```

Recommendation:

Use a focused server action/helper first. Consider RPC if direct table update
policy becomes too broad.

## 6. Application Modules

Likely files:

```text
supabase/migrations/007_mypage_profile_fields.sql
packages/types/src/index.ts
packages/data/src/profile.ts
web/app/mypage/page.tsx
web/lib/public-auth.ts
```

Possible form component:

```text
web/components/mypage-profile-form.tsx
```

## 7. Data Contract

Profile read shape:

```ts
type PublicProfile = {
  id: string;
  displayName: string | null;
  bio: string | null;
  preferredLanguage: "ko" | "en" | "ja" | "zh";
  role: "user" | "editor" | "admin";
  isActive: boolean;
};
```

Profile update input:

```ts
type UpdateMyProfileInput = {
  displayName: string;
  bio: string;
  preferredLanguage: "ko" | "en" | "ja" | "zh";
};
```

Server-side validation:

- trim display name and bio
- convert empty strings to null where appropriate
- enforce max lengths
- enforce language allowlist
- never accept role/is_active from form input

## 8. Mypage UI

Page behavior:

- logged-out user redirects to `/auth/login?next=/mypage`
- logged-in user sees account details and profile edit form
- form saves `display_name`, `bio`, `preferred_language`
- success message appears after save
- validation error appears without mutating data

Suggested sections:

```text
Profile
Language preference
My records placeholder
Liked posts placeholder
Following / followers placeholder
Account actions
```

## 9. Security Notes

Sensitive fields:

```text
role
is_active
id
created_at
```

Do not let the Mypage form update them.

Do not add `avatar_url`; no image upload, external image URL, or storage policy
belongs in this sprint.

Bio risks:

- spam links
- impersonation
- offensive text

First control:

- max length
- plain text
- no links in UI copy or validation
- admin moderation later if public profiles become browseable

## 10. Test Plan

Automated/local:

```text
npm run check
npm run web:build
```

Manual:

```text
1. Visit /mypage logged out -> redirected to /auth/login?next=/mypage
2. Log in as normal user
3. Edit display name, bio, preferred language
4. Confirm values persist after reload
5. Confirm role/is_active did not change
6. Confirm admin/editor login still works
7. Confirm invalid language is rejected
8. Confirm overlong bio/display name is rejected
```

Supabase:

```text
npx supabase db push
```

Then verify the `profiles` schema and RLS behavior in staging.

## 11. Rollback

Rollback UI:

- hide the edit form and show read-only account details.

Rollback DB:

- new columns can remain unused if a rollback is needed.
- do not drop columns unless there is a data/privacy incident.

## 12. Handoff

Implementation should begin only after owner approval.

Approved scope:

```text
display_name
bio
preferred_language
```

Rejected from this scope:

```text
avatar_url
username
public profile URL
image upload
```

