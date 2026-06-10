# Sprint 3 Place Candidate Seed Draft

Status: User verified, promoted to alpha seed  
Date: 2026-06-10

## Purpose

Create a reviewable place-candidate list connected to the 30 verified capital
region foods.

The user completed candidate review on 2026-06-10. The first alpha seed has
been promoted into `supabase/seed.sql` with published places, place-food
relationships, and route guides.

The ongoing workflow is:

```text
candidate research -> user verification -> seed.sql rows -> local reset
-> staging apply -> published public pages -> later edits through seed/admin
```

## Recommendation

Use a mixed place strategy for alpha:

1. Use markets, alleys, streets, and food districts for volatile street-food
   categories.
2. Use individual restaurants only when they have stronger public recognition,
   stable identity, and a clear verification path.
3. Keep every new place as a candidate until the user confirms map link,
   current operation, food match, and disclosure status.

Why this is better:

- It lowers closure risk for early public pages.
- It gives travelers usable food discovery areas before restaurant-level
  verification is complete.
- It keeps the database ready for real `places`, `place_foods`, and
  `route_guides` without pretending every item is production-verified.

## Seed Readiness Rules

Promote a candidate only if all are true:

- current map link confirmed
- food relationship confirmed
- region/city relationship confirmed
- public page wording does not overclaim
- `last_verified_at` can be set to the actual verification date
- no sponsorship or affiliate relationship unless disclosed

## Candidate Table

All rows below were promoted as alpha seed candidates after user review. They
can still be edited later by changing `supabase/seed.sql` and pushing the seed
again. After the Admin MVP exists, the same corrections should move into admin
CRUD and audit logs.

| # | Food slug | Candidate place | Type | Region slug | Recommended status | Why this candidate | User verification task |
|---|---|---|---|---|---|---|---|
| 1 | `tteokbokki` | Sindang-dong Tteokbokki Town | food street | `sindang` | draft | Strong food-district association for spicy tteokbokki. | Confirm current visitor-friendly map point and best public map URL. |
| 2 | `gireum-tteokbokki` | Tongin Market | market | `jongno` | draft | Known association with gireum-tteokbokki and lunchbox-style market experience. | Confirm current market hours, map URL, and whether English-friendly notes are needed. |
| 3 | `seolleongtang` | Imun Seolnongtang | restaurant | `jongno` | draft | Historic seolleongtang candidate with strong editorial story. | Confirm current operation, exact map URL, and whether queues/hours need caution text. |
| 4 | `gwangjang-bindaetteok` | Gwangjang Market | market | `gwangjang-market` | draft | Lower-risk market candidate for bindaetteok discovery. | Confirm preferred map point and caution tags for crowding/cash/stall variation. |
| 5 | `mayak-gimbap` | Gwangjang Market | market | `gwangjang-market` | draft | Same market can support multiple street-food relationships. | Confirm whether to use market-level page or separate stall-level page later. |
| 6 | `dakhanmari` | Dongdaemun Dak Hanmari Alley | food alley | `dongdaemun` | draft | Area-level candidate fits dish origin and reduces single-restaurant risk. | Confirm map URL and visitor notes for shared-table/portion expectations. |
| 7 | `jangchung-jokbal` | Jangchung-dong Jokbal Street | food street | `jangchung` | draft | Recognizable food street for jokbal. | Confirm current street map point and late-night/crowding cautions. |
| 8 | `samgyetang` | Tosokchon Samgyetang | restaurant | `jongno` | candidate | High-recognition individual restaurant candidate. | Confirm current map URL, hours, queue risk, and whether it should be published or replaced by area-level guidance. |
| 9 | `myeongdong-kalguksu` | Myeongdong Kyoja | restaurant | `myeongdong` | candidate | Strong tourist-recognizable kalguksu candidate. | Confirm current operation, branch choice, map URL, and queue/cashless notes. |
| 10 | `seoul-naengmyeon` | Woo Lae Oak | restaurant | `seoul` | candidate | Recognized Seoul naengmyeon candidate, but needs direct verification before publication. | Confirm current operation, map URL, and whether price/booking cautions are needed. |
| 11 | `korean-bbq` | Mapo Jeong Daepo | restaurant | `mapo` | candidate | Useful first BBQ candidate for Mapo-style meat route. | Confirm current operation, exact name spelling, map URL, and whether foreign-language support exists. |
| 12 | `gopchang-gui` | Mapo Gopchang area | area | `mapo` | draft | Area-level candidate avoids overcommitting to a single gopchang shop. | Identify one or two currently operating shops after local verification. |
| 13 | `chimaek` | Hongdae nightlife area | area | `hongdae` | draft | Area-level candidate fits casual evening chimaek discovery. | Confirm whether to publish area guidance first or wait for a verified shop. |
| 14 | `hotteok` | Namdaemun Market or Gwangjang Market | market | `seoul` | draft | Seasonal/stall-based food should start as market-level guidance. | Choose one primary market and confirm stall availability notes. |
| 15 | `bungeoppang` | Seoul winter street-stall guidance | seasonal area | `seoul` | draft | Highly seasonal and stall-volatile, not ready for fixed place page. | Decide whether this should remain food-only until winter verification. |
| 16 | `suwon-galbi` | Suwon Galbi Street | food street | `suwon` | draft | Strong city-food association and better alpha durability than one restaurant. | Confirm current map point and candidate restaurant shortlist. |
| 17 | `uijeongbu-budae-jjigae` | Uijeongbu Budaejjigae Street | food street | `uijeongbu` | draft | Strong local association and route-friendly destination. | Confirm map URL and whether to add one restaurant candidate such as Odeng Sikdang after verification. |
| 18 | `incheon-jajangmyeon` | Incheon Chinatown / Jajangmyeon Museum area | district | `incheon` | draft | Strong food-history area; museum and restaurants make it route-ready. | Confirm whether to link district, museum, or a current restaurant first. |
| 19 | `sinpo-dakgangjeong` | Sinpo International Market | market | `incheon` | draft | Lower-risk market-level candidate for dakgangjeong. | Confirm market map URL and one signature shop only after direct check. |
| 20 | `incheon-seafood` | Sorae Port or Yeonan Pier Fish Market | market | `incheon` | draft | Seafood changes by season; market-level page is safer. | Choose one market, confirm transit difficulty and price/season caution. |
| 21 | `anyang-sundae-gopchang` | Anyang Central Market | market | `anyang` | draft | Market-level candidate fits sundae/gopchang discovery. | Confirm current food lane, map URL, and stall volatility note. |
| 22 | `icheon-rice-table` | Icheon rice-table restaurant cluster | area | `icheon` | draft | City-food association is strong, but individual restaurant needs verification. | Shortlist 2 restaurants and confirm exact map URLs before seed. |
| 23 | `pocheon-idong-galbi` | Pocheon Idong Galbi Village | food village | `pocheon` | draft | Strong local specialty area, route-friendly for day trips. | Confirm current map point, driving/transit caution, and restaurant shortlist. |
| 24 | `yangpyeong-haejangguk` | Yangpyeong haejangguk restaurant candidate | restaurant/area | `yangpyeong` | candidate | Dish is city-associated, but the best public candidate needs direct local verification. | Choose one currently operating shop and confirm map URL before seed. |
| 25 | `gapyeong-pine-nut-makguksu` | Gapyeong pine-nut noodle candidate | restaurant/area | `gapyeong` | candidate | Ingredient-region association is useful, but exact place needs verification. | Confirm whether to seed pine-nut noodles, jat-guksu, or makguksu wording. |
| 26 | `namhansanseong-dakbaeksuk` | Namhansanseong fortress restaurant area | area | `namhansanseong` | draft | Area-level candidate pairs food with a clear visitor route. | Confirm map point, hiking/transport caution, and current restaurant cluster. |
| 27 | `paju-jangdan-soybean` | Paju Jangdan soybean candidate near Imjingak/DMZ routes | area | `paju` | candidate | Ingredient association is strong; restaurant-level seed needs confirmation. | Choose tofu/soybean restaurant candidate and verify current map URL. |
| 28 | `ansan-multicultural-food-street` | Wongok-dong Multicultural Food Street | food street | `ansan` | draft | Strong multicultural-district association and good editorial differentiation. | Confirm current name, map URL, and cuisine scope wording. |
| 29 | `yongin-market-sundae` | Yongin Jungang Market | market | `yongin` | draft | Market-level candidate fits sundae discovery and transit access. | Confirm current food stalls and market map URL. |
| 30 | `gwangmyeong-market-food` | Gwangmyeong Traditional Market | market | `gwangmyeong` | draft | Market-level candidate has lower closure risk than one shop. | Confirm food items to feature and current visitor notes. |

## Suggested Initial Route Concepts

### Route 1: Seoul First-Time Street Food

- Myeongdong Street Food Loop
- Gwangjang Market
- Dongdaemun Dak Hanmari Alley

Why: compact, transit-friendly, high traveler familiarity.

### Route 2: Historic Seoul Soups and Noodles

- Imun Seolnongtang
- Myeongdong Kyoja
- Woo Lae Oak

Why: strong editorial story, but needs direct restaurant verification.

### Route 3: Incheon Food Origins

- Incheon Chinatown / Jajangmyeon Museum area
- Sinpo International Market
- Sorae Port or Yeonan Pier Fish Market

Why: strong city identity and good day-trip framing.

### Route 4: Gyeonggi Signature Day Trips

- Suwon Galbi Street
- Uijeongbu Budaejjigae Street
- Pocheon Idong Galbi Village

Why: each city has an easy food hook; transport notes are required.

## Source Pointers Used For Drafting

These sources support area/food associations, but they do not replace direct
map and operation verification:

- Gwangjang Market: https://en.wikipedia.org/wiki/Gwangjang_Market
- Dongdaemun Dak Hanmari Alley: https://en.wikipedia.org/wiki/Dak-hanmari
- Jangchung-dong Jokbal Street: https://en.wikipedia.org/wiki/Jokbal
- Tongin Market and gireum-tteokbokki: https://en.wikipedia.org/wiki/Tongin_Market
- Tteokbokki and Sindang association: https://en.wikipedia.org/wiki/Tteokbokki
- Imun Seolnongtang: https://en.wikipedia.org/wiki/Imun_Seolnongtang
- Hadongkwan/Michelin-style soup reference: https://en.wikipedia.org/wiki/Hadongkwan
- Incheon Chinatown and Jajangmyeon Museum: https://en.wikipedia.org/wiki/Incheon_Chinatown
- Uijeongbu Budae-jjigae Street: https://en.wikipedia.org/wiki/Budae-jjigae
- Pocheon Idong galbi: https://en.wikipedia.org/wiki/Pocheon
- Gapyeong pine-nut noodles: https://en.wikipedia.org/wiki/Jat-guksu
- Paju Jangdan soybean: https://en.wikipedia.org/wiki/Paju
- Namhansanseong visitor area: https://en.wikipedia.org/wiki/Namhansanseong
- Gwangmyeong Traditional Market: https://en.wikipedia.org/wiki/Gwangmyeong

## Next Step

After seed promotion, the next review pass should focus on:

1. Which area-level places need exact `google_maps_url` or `naver_maps_url`.
2. Which individual restaurant candidates should stay published.
3. Which seasonal or volatile candidates need stronger caution copy.
4. Which routes should be split into shorter traveler-ready routes.
