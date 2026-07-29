import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fallbackPlaces,
  getContentImages,
  getPublishedFood,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedProductionsFor,
  getPublishedRegions,
  humanizeTag
} from "@kfood/data";

import { CardPhoto, resolveCardPhoto } from "@/components/card-photo";
import { GalleryViewer } from "@/components/gallery-viewer";
import { JsonLd } from "@/components/json-ld";
import { getDict } from "@/lib/i18n";
import { absUrl, breadcrumbLd, clip, detailMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const foods = await getPublishedFoods();
  return foods.map((food) => ({ foodSlug: food.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ foodSlug: string }>;
}) {
  const { foodSlug } = await params;
  const food = await getPublishedFood(foodSlug);
  if (!food) return { title: "Food" };
  const koPart = food.nameKo && food.nameKo !== food.nameEn ? ` (${food.nameKo})` : "";
  return detailMetadata({
    title: `${food.nameEn}${koPart} — Korean Food Guide`,
    description: food.summary,
    path: `/foods/${food.slug}`,
    imageUrl: food.imageUrl
  });
}

export default async function FoodDetailPage({
  params
}: {
  params: Promise<{ foodSlug: string }>;
}) {
  const { foodSlug } = await params;
  const food = await getPublishedFood(foodSlug);

  if (!food) {
    notFound();
  }

  const [publishedPlaces, regions, productions, dict, galleryImages] =
    await Promise.all([
      getPublishedPlaces(),
      getPublishedRegions(),
      getPublishedProductionsFor("food", foodSlug),
      getDict(),
      food.id ? getContentImages("food", food.id) : Promise.resolve([])
    ]);
  const t = dict.foodDetail;
  const sourcePlaces =
    publishedPlaces.length > 0 ? publishedPlaces : fallbackPlaces;
  const places = sourcePlaces.filter((place) =>
    place.foodSlugs.includes(food.slug)
  );
  const heroPhoto = resolveCardPhoto(food.nameEn);
  const tasteTags = food.tasteProfile
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  // 실제로 연결된 지역만(없으면 섹션 자체를 숨긴다)
  const foodRegions = food.regionSlugs
    .map((slug) => regions.find((item) => item.slug === slug))
    .filter((region): region is (typeof regions)[number] => Boolean(region));

  const jsonLd = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Foods", path: "/foods" },
      { name: food.nameEn, path: `/foods/${food.slug}` }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${food.nameEn} — Korean Food Guide`,
      description: clip(food.summary),
      inLanguage: "en",
      mainEntityOfPage: absUrl(`/foods/${food.slug}`),
      about: { "@type": "Thing", name: food.nameEn, alternateName: food.nameKo },
      ...(food.imageUrl ? { image: food.imageUrl } : {})
    }
  ];

  return (
    <div className="food-v2">
      <JsonLd data={jsonLd} />
      <nav className="food-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{dict.common.home}</Link>
        <span>/</span>
        <Link href="/foods">{dict.common.foods}</Link>
        <span>/</span>
        <span>{food.nameEn}</span>
      </nav>

      {galleryImages.length > 0 ? (
        <GalleryViewer images={galleryImages} title={food.nameEn} />
      ) : food.imageUrl ? (
        <div className="food-hero-photo has-image">
          {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={food.nameEn} className="food-hero-photo-img" src={food.imageUrl} />
        </div>
      ) : (
        <div
          className="food-hero-photo"
          style={{ background: heroPhoto.gradient }}
          aria-hidden="true"
        >
          <span className="food-hero-photo-mono" style={{ color: heroPhoto.glyph }}>
            {heroPhoto.letter}
          </span>
        </div>
      )}

      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{t.eyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{food.nameEn}</span>
          {food.nameKo && food.nameKo !== food.nameEn ? (
            <span className="food-v2-name-ko">{food.nameKo}</span>
          ) : null}
        </div>
        <div className="food-v2-tags">
          {/* "Spicy 3/4 · Spicy"처럼 라벨이 중복되지 않게 라벨 + 수치만 */}
          <span className={food.spicyLevel > 0 ? "food-chip spicy" : "food-chip"}>
            {t.spicyLabels[food.spicyLevel]}
            {food.spicyLevel > 0 ? ` · ${food.spicyLevel}/4` : ""}
          </span>
          {tasteTags.map((tag) => (
            <span className="food-chip" key={tag}>
              {humanizeTag(tag)}
            </span>
          ))}
        </div>
        <p className="food-v2-summary">{food.summary}</p>
      </header>

      <section aria-labelledby="food-guide">
        <p className="food-section-title" id="food-guide">
          {t.knowTitle}
        </p>
        <div className="food-info-grid">
          <div className="food-info-card">
            <h3>{t.goodToKnowH}</h3>
            <p>{food.beginnerNote}</p>
          </div>
          <div className="food-info-card">
            <h3>{t.tasteH}</h3>
            <p>{food.tasteProfile}</p>
          </div>
          <div className="food-info-card">
            <h3>{t.menuTipH}</h3>
            <p>{t.menuTipBody}</p>
          </div>
        </div>
      </section>

      {foodRegions.length > 0 ? (
        <section aria-labelledby="food-regions">
          <p className="food-section-title" id="food-regions">
            {t.whereItFits}
          </p>
          <div className="card-grid-v2">
            {foodRegions.map((region) => (
              <Link
                className="card-v2"
                href={`/foods/${food.slug}/${region.slug}`}
                key={region.slug}
              >
                <CardPhoto
                  imageUrl={region.imageUrl}
                  label={region.nameEn}
                  variant="region" />
                <div className="card-v2-body">
                  <span className="card-v2-title">{region.nameEn}</span>
                  <span className="card-v2-meta">{region.routeTheme}</span>
                  <span className="card-v2-link">
                    {t.inRegionLink(food.nameEn, region.nameEn)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="food-places">
        <p className="food-section-title" id="food-places">
          {t.whereToTry}
        </p>
        {places.length === 0 ? (
          <div className="food-info-card">
            <p>{t.placesEmpty}</p>
          </div>
        ) : (
          <div className="card-grid-v2">
            {places.map((place) => (
              <Link className="card-v2" href={`/places/${place.slug}`} key={place.slug}>
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

      {productions.length > 0 ? (
        <section aria-labelledby="food-productions">
          <p className="food-section-title" id="food-productions">
            {t.channelsTitle}
          </p>
          <div className="food-info-grid">
            {productions.map((production) =>
              production.externalUrl ? (
                <a
                  className="food-info-card"
                  href={production.externalUrl}
                  key={production.slug}
                  rel="noreferrer"
                  target="_blank"
                >
                  <h3>{production.title}</h3>
                  <p style={{ color: "var(--brand)" }}>
                    {production.type.toUpperCase()}
                    {production.channel ? ` · ${production.channel}` : ""}
                  </p>
                  {production.summary ? <p>{production.summary}</p> : null}
                </a>
              ) : (
                <div className="food-info-card" key={production.slug}>
                  <h3>{production.title}</h3>
                  <p style={{ color: "var(--brand)" }}>
                    {production.type.toUpperCase()}
                    {production.channel ? ` · ${production.channel}` : ""}
                  </p>
                  {production.summary ? <p>{production.summary}</p> : null}
                </div>
              )
            )}
          </div>
        </section>
      ) : null}

    </div>
  );
}
