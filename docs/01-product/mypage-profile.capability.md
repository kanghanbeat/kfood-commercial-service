# Mypage Profile Capability

Status: Draft for owner review  
Date: 2026-06-29  
Decision: Option C staged expansion, excluding `avatar_url`

## 1. Capability Summary

Expand `/mypage` from a simple account display into the user's K-food activity
and preference hub.

This sprint should only add text/profile preference fields that are needed
before Feed, likes, follows, and recommendations become real:

```text
display_name
bio
preferred_language
```

Do not add `avatar_url` in this capability.

## 2. Why This Comes Before Feed Uploads

Feed posts, likes, follows, and recommendations need a stable user profile
foundation.

Before a user uploads records, the service should know:

- what display name to show
- which language the user prefers
- whether a short public-facing bio exists
- how `/mypage` will organize future activity sections

This keeps the community layer connected to identity and preference, without
starting image upload/storage work too early.

## 3. Chosen Scope

### Included Now

Users can view and update:

- display name
- bio
- preferred language

Mypage can show placeholders for:

- my records
- liked posts
- following/followers
- account settings

### Deferred

Defer to later capability contracts:

- username
- public profile URL
- public profile enabled/disabled
- record uploads
- liked post data
- follow data
- account deletion flow

### Explicitly Excluded

`avatar_url` is excluded.

Reasons:

- avatar requires image upload or external image URL policy
- image upload touches Supabase Storage, file limits, moderation, deletion, and
  portrait/right-of-publicity concerns
- profile image handling should be considered together with user post image
  upload, not as a small profile edit

## 4. Actors

| Actor | Need |
|---|---|
| Guest | Understand that Mypage requires login |
| Public user | Manage basic identity and language preference |
| Admin/editor | Keep admin role data protected from self-edit by public users |
| Future Feed viewer | See a safe display name and optional bio beside posts |

## 5. User-Visible Promise

The first real Mypage profile version should promise:

```text
Set how your K-food account appears and which language you prefer.
```

It should not promise:

- public creator profiles
- image/avatar upload
- full account settings
- account deletion
- saved places
- post history
- follower analytics

## 6. Profile Fields

### display_name

Purpose:

- visible name for Mypage and later Feed records

Rules:

- optional but recommended
- trim leading/trailing spaces
- max length: 80
- no uniqueness requirement
- fallback to email or "K-food member"

### bio

Purpose:

- short self-description for later user records/profile surfaces

Rules:

- optional
- max length: 240
- no links in the first implementation
- plain text only

### preferred_language

Purpose:

- default UI/content language preference

Allowed initial values:

```text
ko
en
ja
zh
```

Fallback:

```text
en
```

## 7. Mypage Sections

Initial `/mypage` layout:

```text
Profile
Language preference
My records placeholder
Liked posts placeholder
Following / followers placeholder
Account actions
```

Only Profile and Language preference should save in this capability.

## 8. Data Ownership

The signed-in user owns their own public profile fields:

```text
display_name
bio
preferred_language
```

The user must not be able to self-edit:

```text
role
is_active
created_at
admin/editor-only fields
```

Admin/editor role management remains separate from public Mypage editing.

## 9. Risk Controls

This is lower risk than user photo uploads, but still touches identity and
public-facing text.

Controls:

- authenticated users only
- update only own row
- field length limits
- language allowlist
- plain text bio
- no `avatar_url`
- no username uniqueness or slug policy yet
- role/is_active protected from self-edit

## 10. Success Criteria

This capability is ready when:

- logged-out `/mypage` redirects to login
- logged-in user can see current profile values
- logged-in user can update display name, bio, and preferred language
- invalid language is rejected
- overlong display name or bio is rejected
- `role` and `is_active` cannot be changed by the public profile form
- admin login/authorization remains unchanged
- `npm run check` passes
- `npm run web:build` passes

## 11. Recommended Implementation Order

After owner approval:

```text
1. Add migration for bio and preferred_language
2. Add RLS policy allowing users to update only safe own profile fields
3. Add typed profile read/update helpers
4. Add /mypage edit form
5. Add validation and success/error states
6. Verify admin/editor auth remains intact
```

