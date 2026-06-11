# Sprint 3 Photo Source Policy Research

Status: Implemented as review workflow  
Date: 2026-06-11

## Executive Summary

The service should not display food photos until each image has a recorded
source, license, author, attribution requirement, and review date.

For alpha, the safest implementation is a photo-source review surface:

```text
food page -> candidate source links -> manual license review -> approved image later
```

This avoids accidentally publishing copyrighted restaurant, blog, delivery-app,
or news photos while still letting the team research images for the 30 published
foods.

## Key Findings

- Wikimedia Commons accepts free content or public-domain media, and does not
  accept fair-use media or non-commercial-only licenses.
- Commons still places responsibility on reusers to follow the file license and
  any applicable law.
- Creative Commons licenses differ. For a monetized service, avoid `NC`
  (NonCommercial) and be careful with `ND` (NoDerivatives).
- Stock-style sources such as Unsplash and Pexels may allow broad use, but they
  are weaker for dish-specific accuracy and can create endorsement or
  misrepresentation issues.

## Facts vs Inferences

Facts:

- Commons requires free licensing or public domain status and excludes fair use
  and non-commercial-only media.
- CC BY and CC BY-SA can allow commercial use when attribution and license terms
  are followed.
- Unsplash and Pexels have their own platform licenses and restrictions.

Inferences:

- For K-food Service, Commons should be the first image candidate source.
- Openverse is useful for discovery, but every candidate still needs original
  source verification.
- Generic stock photos should be fallback only, because many food images are
  visually close but not dish-accurate.

## Recommendation

Current stage:

- Add `/photo-sources`.
- Add photo-source candidate links to every food detail page.
- Do not store or display actual images yet.
- Use the page as a review board for all 30 food pages.

Later stage:

- Add approved image fields or a reviewed `photo_sources` workflow.
- Store title, author, source URL, license, attribution text, and review date.
- Publish only images that pass commercial-use and attribution review.

## Recheck Results: First Five Problem Items

Status: proposed candidates only. These are not approved public images yet.

| Food | User request | Current candidate | License note | Review note |
| --- | --- | --- | --- | --- |
| Gwangjang Bindaetteok | Exclude photos with visible people | https://commons.wikimedia.org/wiki/File:Bindae-tteok.jpg | KOGL Type 1 | People-free bindaetteok candidate from Korean Culture and Information Service. Verify attribution wording. |
| Myeongdong Kalguksu | No Myeongdong-specific photo; suggest related generic kalguksu | https://commons.wikimedia.org/wiki/File:Kalguksu-01.jpg | CC BY 2.0 | Generic kalguksu candidate. Label as associated dish image, not restaurant-specific image. |
| Chimaek | Find chicken and beer together | https://commons.wikimedia.org/wiki/File:Iksan_City_48_Korean_Style_Fried_chicken.jpg | CC BY-SA 2.0 | Shows Korean fried chicken with beer. Verify share-alike implications before cropping or modifying. |
| Uijeongbu Budae-jjigae | No Uijeongbu-specific photo; suggest related generic budae-jjigae | https://commons.wikimedia.org/wiki/File:Budae_jjigae_before_boiling.jpg | CC BY-SA 2.5 | Generic budae-jjigae candidate. Label as associated dish image, not Uijeongbu-specific proof. |
| Incheon Jajangmyeon | Find jajangmyeon photo for recheck | https://commons.wikimedia.org/wiki/File:Jajangmyeon_by_KFoodaddict.jpg | CC BY 2.0 | Jajangmyeon candidate from Commons/Flickr. Verify dish match and attribution text. |

## Sources

- Wikimedia Commons licensing policy: https://commons.wikimedia.org/wiki/Commons:Licensing
- Creative Commons licenses: https://creativecommons.org/cc-licenses/
- Unsplash license: https://unsplash.com/license
- Pexels license: https://www.pexels.com/license/
- Bindae-tteok Commons candidate: https://commons.wikimedia.org/wiki/File:Bindae-tteok.jpg
- Kalguksu Commons candidate: https://commons.wikimedia.org/wiki/File:Kalguksu-01.jpg
- Chimaek Commons candidate: https://commons.wikimedia.org/wiki/File:Iksan_City_48_Korean_Style_Fried_chicken.jpg
- Budae-jjigae Commons candidate: https://commons.wikimedia.org/wiki/File:Budae_jjigae_before_boiling.jpg
- Jajangmyeon Commons candidate: https://commons.wikimedia.org/wiki/File:Jajangmyeon_by_KFoodaddict.jpg
