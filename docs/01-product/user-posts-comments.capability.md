# User Posts and Comments Capability

Status: Draft for owner review  
Date: 2026-06-30  
Related architecture:
`docs/02-architecture/user-posts-comments.design.md`

## 1. Capability Summary

Add user-generated food records and comments to K-food Service while preserving
the verified directory as the trusted and monetizable core.

The user-facing promise is:

```text
Users can record K-food experiences, connect them to trusted foods/areas/places,
and discuss those records through moderated comments.
```

This is not a general SNS feature. User posts and comments should strengthen
verified K-food discovery by adding real visit context, but they must not
replace admin/editor verified information.

## 2. Product Positioning

The service model remains:

```text
Verified K-food guide
+ community records
+ controlled discussion
```

Not:

```text
Open-ended social network
```

Posts and comments should make these existing surfaces more useful:

- Feed
- Search
- Recommend
- Mypage
- food pages
- region pages
- place pages
- route pages

The platform should always distinguish:

```text
Verified information
User record
User comment
Sponsored/affiliate content
Machine translated content
```

## 3. Actors

### Anonymous Visitor

Can:

- read published public posts
- read visible comments on published posts
- open verified food/area/place/route pages
- report problematic content if report flow allows anonymous reports

Cannot:

- create posts
- upload images
- comment
- like
- follow
- edit profile

### Authenticated User

Can:

- create a user post
- connect a post to foods, regions, places, or routes
- upload post images after storage policy is ready
- comment on public posts
- edit or delete own comments while allowed
- edit own draft or visible posts while allowed
- like posts
- follow users
- report posts and comments

Cannot:

- edit another user's post or comment
- publish unmoderated unsafe content if moderation requires review
- represent user content as verified service information
- bypass image, abuse, or rate limits

### Admin or Editor

Can:

- view moderation queues
- hide or remove posts
- hide or remove comments
- resolve reports
- review linked food/region/place claims
- create audit log entries for moderation actions

Cannot:

- silently change a user's post into verified editorial content without a clear
  editorial workflow

## 4. User Posts

User posts are personal K-food records connected to service data.

Required first version fields:

```text
body
language
visibility
status
linked foods/regions/places/routes when available
created_at
updated_at
```

Post examples:

```text
I tried kalguksu near Myeongdong after checking the route guide.
The line was short at lunch, but check current opening hours before going.
```

Post UI labels should make authority clear:

```text
User record
Verified food
Area guide
Place direction
```

## 5. Comments

Comments are discussion attached to a user post.

The first version should support:

- one-level comments only
- authenticated user creation
- public read for visible comments on public posts
- own comment edit/delete
- admin/editor hide/remove
- comment reports

The first version should not support:

- nested replies
- image comments
- comment likes
- realtime comment streaming
- rich text
- hashtags
- mentions
- automatic translation of comments
- public user profile pages

Reason:

Comments are an engagement layer, but they also create the fastest path to spam,
harassment, misinformation, and moderation load. A shallow model is safer for
alpha.

## 6. States

### Post Status

```text
draft
pending_review
published
hidden
removed
```

Recommended first launch:

```text
draft -> pending_review -> published
published -> hidden
hidden -> published
published/hidden -> removed
```

### Comment Status

```text
published
hidden
removed
```

Comment status meaning:

- `published`: visible below a public post
- `hidden`: admin/editor hid it from public display
- `removed`: user or admin removed it; keep record for audit/report context

## 7. Interface Contract

### Feed

Shows public published posts.

Each card should eventually include:

- user display name
- post body excerpt
- linked verified food/area/place labels
- image thumbnail if available
- comment count
- like count
- report action

### Post Detail

Recommended route:

```text
/feed/[postId]
```

Contains:

- full post
- linked verified entities
- images
- comments
- comment form for logged-in users
- login prompt for guests
- report actions

### Mypage

Shows:

- my posts
- drafts
- hidden/removed status explanation
- my comments later
- saved/liked records later

### Admin

Needs moderation views later:

```text
/admin/user-posts
/admin/comments
```

Admin actions:

- hide post
- hide comment
- resolve report
- add moderation note
- create audit log

## 8. Moderation and Trust Rules

Content rules:

- posts and comments must not claim official verification
- food safety, allergy, pricing, and opening-hour claims should be treated as
  user statements unless verified by admin/editor
- place closure or map errors should route into report/admin workflow
- comments should not be used as source data for verified pages without review

Abuse controls required before public posting:

- authenticated-only write
- body length limits
- per-user rate limits
- report flow
- admin hide/remove
- audit log for moderation
- storage file type/size validation before images launch

## 9. Non-Goals

Do not build these in the first implementation:

- general SNS timeline
- direct messaging
- nested comment threads
- creator monetization
- restaurant owner replies
- paid boosting
- algorithmic feed ranking
- automatic translation of user posts/comments
- public profile pages with usernames
- avatar upload

## 10. Success Criteria

The capability is ready for implementation when:

1. Public visitors can understand that posts are user records, not verified
   editorial content.
2. Logged-in users have a clear path to create a post.
3. Comments cannot exist without a post.
4. Guests can read but not comment.
5. Users can only create/edit/delete their own posts/comments.
6. Admin/editor can hide or remove problematic posts/comments.
7. Reports can be connected to posts and comments.
8. Feed/Search/Recommend can continue to prioritize verified content.
9. Image upload is blocked until storage and moderation policy is ready.
10. The feature can be disabled without breaking verified directory pages.

## 11. Recommended Next Step

Proceed to architecture using a staged plan:

```text
Slice 1: post/comment data model and RLS design
Slice 2: feed read from published posts
Slice 3: post creation without images
Slice 4: comment creation and moderation
Slice 5: image upload and storage policy
```

