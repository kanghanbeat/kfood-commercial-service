import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fallbackPlaces,
  getPublishedFood,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegion,
  getPublishedRegions
} from "@kfood/data";

import { CardPhoto, resolveCardPhoto } from "@/components/card-photo";
import { JsonLd } from "@/components/json-ld";
import { getDict } from "@/lib/i18n";
import { breadcrumbLd, detailMetadata } from "@/lib/seo";

// 음식×지역 조합 페이지 — "best tteokbokki in Seoul" 같은 롱테일 검색 유입구
// (기획정렬-한빛대조.md §1-3). 기존 /foods/[foodSlug], /regions/[slug]는 그대로 두고
// 조합 URL만 추가한다.

export async function generateStaticParams() {
  const foods = await getPublishedFoods();
  return foods.flatMap((food) =>
    food.regionSlugs.map((regionSlug) => ({
      foodSlug: food.slug,
      regionSlug
    }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ foodSlug: string; regionSlug: string }>;
}) {
  const { foodSlug, regionSlug } = await params;
  const [food, region] = await Promise.all([
    getPublishedFood(foodSlug),
    getPublishedRegion(regionSlug)
  ]);

  if (!food || !region) {
    return { title: "Food" };
  }

  return detailMetadata({
    title: `Best ${food.nameEn} in ${region.nameEn}`,
    description: `Where to try ${food.nameEn} in ${region.nameEn} — curated places, taste notes, and tips for travelers.`,
    path: `/foods/${food.slug}/${region.slug}`,
    imageUrl: food.imageUrl
  });
}

export default async function FoodRegionPage({
  params
}: {
  params: Promise<{ foodSlug: string; regionSlug: string }>;
}) {
  const { foodSlug, regionSlug } = await params;
  const [food, region] = await Promise.all([
    getPublishedFood(foodSlug),
    getPublishedRegion(regionSlug)
  ]);

  // 음식-지역 연결이 없는 조합은 내용이 비어 중복 페이지가 되므로 404 처리.
  if (!food || !region || !food.regionSlugs.includes(region.slug)) {
    notFound();
  }

  const [publishedPlaces, allRegions, dict] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions(),
    getDict()
  ]);
  const t = dict.combo;
  const sourcePlaces =
    publishedPlaces.length > 0 ? publishedPlaces : fallbackPlaces;
  const places = sourcePlaces.filter(
    (place) =>
      place.regionSlug === region.slug && place.foodSlugs.includes(food.slug)
  );
  const otherRegionSlugs = food.regionSlugs.filter(
    (slug) => slug !== region.slug
  );
  const heroPhoto = resolveCardPhoto(`${food.nameEn} ${region.nameEn}`);

  const jsonLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Foods", path: "/foods" },
    { name: food.nameEn, path: `/foods/${food.slug}` },
    { name: region.nameEn, path: `/foods/${food.slug}/${region.slug}` }
  ]);

  return (
    <div className="food-v2">
      <JsonLd data={jsonLd} />
      <nav className="food-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{dict.common.home}</Link>
        <span>/</span>
        <Link href="/foods">{dict.common.foods}</Link>
        <span>/</span>
        <Link href={`/foods/${food.slug}`}>{food.nameEn}</Link>
        <span>/</span>
        <span>{region.nameEn}</span>
      </nav>

      <div
        className="food-hero-photo"
        style={{ background: heroPhoto.gradient }}
        aria-hidden="true"
      >
        <span className="food-hero-photo-mono" style={{ color: heroPhoto.glyph }}>
          {heroPhoto.letter}
        </span>
      </div>

      <header className="food-v2-header">
        <span className="food-v2-eyebrow">
          {food.nameEn} · {region.nameEn}
        </span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">
            {t.title(food.nameEn, region.nameEn)}
          </span>
          {food.nameKo && food.nameKo !== food.nameEn ? (
            <span className="food-v2-name-ko">{food.nameKo}</span>
          ) : null}
        </div>
        <div className="food-v2-tags">
          {/* "Spicy 3/4 · Spicy"처럼 라벨이 중복되지 않게 라벨 + 수치만 */}
          <span className={food.spicyLevel > 0 ? "food-chip spicy" : "food-chip"}>
            {dict.foodDetail.spicyLabels[food.spicyLevel]}
            {food.spicyLevel > 0 ? ` · ${food.spicyLevel}/4` : ""}
          </span>
          <span className="food-chip">{region.nameEn}</span>
        </div>
        <p className="food-v2-summary">{food.summary}</p>
      </header>

      <section aria-labelledby="combo-guide">
        <p className="food-section-title" id="combo-guide">
          {t.whyTitle(food.nameEn, region.nameEn)}
        </p>
        <div className="food-info-grid">
          <div className="food-info-card">
            <h3>{t.aboutArea}</h3>
            <p>{region.intro}</p>
          </div>
          <div className="food-info-card">
            <h3>{dict.foodDetail.tasteH}</h3>
            <p>{food.tasteProfile}</p>
          </div>
          <div className="food-info-card">
            <h3>{dict.foodDetail.goodToKnowH}</h3>
            <p>{food.beginnerNote}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="combo-places">
        <p className="food-section-title" id="combo-places">
          {t.whereToTryIn(region.nameEn)}
        </p>
        {places.length === 0 ? (
          <div className="food-info-card">
            <p>
              {t.placesEmpty(food.nameEn, region.nameEn)}{" "}
              <Link href={`/foods/${food.slug}`}>
                {t.fullGuideLink(food.nameEn)}
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="card-grid-v2">
            {places.map((place) => (
              <Link
                className="card-v2"
                href={`/places/${place.slug}`}
                key={place.slug}
              >
                <div className="card-v2-body">
                  <span className="card-v2-meta">{place.lastVerifiedLabel}</span>
                  <span className="card-v2-title">{place.nameEn}</span>
                  <span className="card-v2-meta">{place.editorialNote}</span>
                  <span className="card-v2-link">{dict.common.view} →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {otherRegionSlugs.length > 0 ? (
        <section aria-labelledby="combo-other-regions">
          <p className="food-section-title" id="combo-other-regions">
            {t.otherAreas(food.nameEn)}
          </p>
          <div className="food-subnav">
            {otherRegionSlugs.map((slug) => {
              const otherRegion = allRegions.find(
                (item) => item.slug === slug
              );
              return (
                <Link
                  className="food-subnav-tab"
                  href={`/foods/${food.slug}/${slug}`}
                  key={slug}
                >
                  {otherRegion?.nameEn ??
                    slug
                      .split("-")
                      .map(
                        (part) => part.charAt(0).toUpperCase() + part.slice(1)
                      )
                      .join(" ")}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="combo-more">
        <p className="food-section-title" id="combo-more">
          {t.keepExploring}
        </p>
        <div className="card-grid-v2">
          <Link className="card-v2" href={`/foods/${food.slug}`}>
            <CardPhoto imageUrl={food.imageUrl} label={food.nameEn} variant="food" />
            <div className="card-v2-body">
              <span className="card-v2-title">{t.foodGuide(food.nameEn)}</span>
              <span className="card-v2-meta">{food.summary}</span>
              <span className="card-v2-link">{t.readGuide}</span>
            </div>
          </Link>
          <Link className="card-v2" href={`/regions/${region.slug}`}>
            <CardPhoto imageUrl={region.imageUrl} label={region.nameEn} variant="region" />
            <div className="card-v2-body">
              <span className="card-v2-title">{t.areaGuide(region.nameEn)}</span>
              <span className="card-v2-meta">{region.intro}</span>
              <span className="card-v2-link">{t.exploreArea}</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
