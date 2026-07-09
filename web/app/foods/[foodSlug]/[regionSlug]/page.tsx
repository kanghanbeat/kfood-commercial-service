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

  return {
    title: `Best ${food.nameEn} in ${region.nameEn}`,
    description: `Where to try ${food.nameEn} in ${region.nameEn} — curated places, taste notes, and tips for travelers.`
  };
}

const spicyLabels = ["Not spicy", "Mild", "Medium", "Spicy", "Very spicy"];

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

  const [publishedPlaces, allRegions] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions()
  ]);
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

  return (
    <div className="food-v2">
      <nav className="food-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/foods">Foods</Link>
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
            {food.nameEn} in {region.nameEn}
          </span>
          {food.nameKo && food.nameKo !== food.nameEn ? (
            <span className="food-v2-name-ko">{food.nameKo}</span>
          ) : null}
        </div>
        <div className="food-v2-tags">
          <span className="food-chip spicy">
            Spicy {food.spicyLevel}/4 · {spicyLabels[food.spicyLevel]}
          </span>
          <span className="food-chip">{region.nameEn}</span>
        </div>
        <p className="food-v2-summary">{food.summary}</p>
      </header>

      <section aria-labelledby="combo-guide">
        <p className="food-section-title" id="combo-guide">
          Why {region.nameEn} for {food.nameEn}
        </p>
        <div className="food-info-grid">
          <div className="food-info-card">
            <h3>About the area</h3>
            <p>{region.intro}</p>
          </div>
          <div className="food-info-card">
            <h3>Taste</h3>
            <p>{food.tasteProfile}</p>
          </div>
          <div className="food-info-card">
            <h3>Good to know</h3>
            <p>{food.beginnerNote}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="combo-places">
        <p className="food-section-title" id="combo-places">
          Where to try it in {region.nameEn}
        </p>
        {places.length === 0 ? (
          <div className="food-info-card">
            <p>
              Verified {food.nameEn} places in {region.nameEn} will appear
              here. Meanwhile, see the{" "}
              <Link href={`/foods/${food.slug}`}>full {food.nameEn} guide</Link>.
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
                  <span className="card-v2-link">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {otherRegionSlugs.length > 0 ? (
        <section aria-labelledby="combo-other-regions">
          <p className="food-section-title" id="combo-other-regions">
            {food.nameEn} in other areas
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
          Keep exploring
        </p>
        <div className="card-grid-v2">
          <Link className="card-v2" href={`/foods/${food.slug}`}>
            <CardPhoto label={food.nameEn} variant="food" />
            <div className="card-v2-body">
              <span className="card-v2-title">{food.nameEn} guide</span>
              <span className="card-v2-meta">{food.summary}</span>
              <span className="card-v2-link">Read the guide →</span>
            </div>
          </Link>
          <Link className="card-v2" href={`/regions/${region.slug}`}>
            <CardPhoto label={region.nameEn} variant="region" />
            <div className="card-v2-body">
              <span className="card-v2-title">{region.nameEn} area guide</span>
              <span className="card-v2-meta">{region.intro}</span>
              <span className="card-v2-link">Explore the area →</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
