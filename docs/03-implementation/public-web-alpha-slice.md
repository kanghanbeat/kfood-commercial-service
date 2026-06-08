# Public Web Alpha Slice

Status: Implemented v1  
Date: 2026-06-08

## Scope

The first Next.js public web slice turns the service skeleton into a browsable
editorial directory.

Implemented routes:

```text
/
/regions
/regions/[regionSlug]
/foods
/foods/[foodSlug]
/places
/places/[placeSlug]
/routes
```

## Data

`packages/data` now contains connected alpha data for:

- 5 Seoul regions
- 5 K-food items
- 5 editorial place directions
- 2 route ideas

This is still editorial placeholder data. It is structured to match the real
service model, but should not be treated as verified production content.

## Verification

Completed:

```text
npm run typecheck
npm run lint
npm run web:build
```

HTTP checks against the local dev server:

```text
/                              200
/regions                       200
/regions/myeongdong            200
/foods/tteokbokki              200
/places/gwangjang-bindaetteok-row 200
```

## Fixes Made During Verification

- Dynamic route `params` were updated to the Next.js 16 async params model.
- Next workspace root warning was fixed with `turbopack.root`.
- Lint script was updated from `next lint` to `eslint .`.

## Next Work

1. Add verified Seoul alpha seed data.
2. Add image/content source fields before publishing real place pages.
3. Add report/contact routes.
4. Add sitemap and metadata generation.
5. Connect public pages to Supabase after migration verification.
