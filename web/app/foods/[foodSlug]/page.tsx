import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fallbackPlaces,
  getFoodPhotoReviewNote,
  getFoodPhotoSourceCandidates,
  getPublishedFood,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedProductionsFor,
  getPublishedRegions
} from "@kfood/data";

import { CardPhoto, resolveCardPhoto } from "@/components/card-photo";
import { getDict } from "@/lib/i18n";

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
  return {
    title: food ? `${food.nameEn} Guide` : "Food"
  };
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

  const [publishedPlaces, regions, productions, dict] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedProductionsFor("food", foodSlug),
    getDict()
  ]);
  const t = dict.foodDetail;
  const sourcePlaces =
    publishedPlaces.length > 0 ? publishedPlaces : fallbackPlaces;
  const places = sourcePlaces.filter((place) =>
    place.foodSlugs.includes(food.slug)
  );
  const photoReview = getFoodPhotoReviewNote(food);
  const heroPhoto = resolveCardPhoto(food.nameEn);
  const tasteTags = food.tasteProfile
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="food-v2">
      <nav className="food-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{dict.common.home}</Link>
        <span>/</span>
        <Link href="/foods">{dict.common.foods}</Link>
        <span>/</span>
        <span>{food.nameEn}</span>
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
        <span className="food-v2-eyebrow">{t.eyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{food.nameEn}</span>
          {food.nameKo && food.nameKo !== food.nameEn ? (
            <span className="food-v2-name-ko">{food.nameKo}</span>
          ) : null}
        </div>
        <div className="food-v2-tags">
          <span className="food-chip spicy">
            {dict.common.spicy} {food.spicyLevel}/4 · {t.spicyLabels[food.spicyLevel]}
          </span>
          {tasteTags.map((tag) => (
            <span className="food-chip" key={tag}>
              {tag}
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
            <h3>{t.descriptionH}</h3>
            <p>{food.summary}</p>
          </div>
          <div className="food-info-card">
            <h3>{t.tasteH}</h3>
            <p>{food.tasteProfile}</p>
          </div>
          <div className="food-info-card">
            <h3>{t.goodToKnowH}</h3>
            <p>{food.beginnerNote}</p>
          </div>
          <div className="food-info-card">
            <h3>{t.menuTipH}</h3>
            <p>{t.menuTipBody}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="food-regions">
        <p className="food-section-title" id="food-regions">
          {t.whereItFits}
        </p>
        <div className="card-grid-v2">
          {food.regionSlugs.map((regionSlug) => {
            const region = regions.find((item) => item.slug === regionSlug);
            return region ? (
              <Link
                className="card-v2"
                href={`/foods/${food.slug}/${region.slug}`}
                key={region.slug}
              >
                <CardPhoto label={region.nameEn} variant="region" />
                <div className="card-v2-body">
                  <span className="card-v2-title">{region.nameEn}</span>
                  <span className="card-v2-meta">{region.routeTheme}</span>
                  <span className="card-v2-link">
                    {t.inRegionLink(food.nameEn, region.nameEn)}
                  </span>
                </div>
              </Link>
            ) : null;
          })}
        </div>
      </section>

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

      <section aria-labelledby="food-photo-sources">
        <p className="food-section-title" id="food-photo-sources">
          Photo sourcing
        </p>
        <div className="food-info-card" style={{ marginBottom: 16 }}>
          <h3>{photoReview.label}</h3>
          <p>{photoReview.note}</p>
          <p style={{ color: "var(--text-heading)" }}>{photoReview.nextAction}</p>
        </div>
        <div className="food-info-grid">
          {getFoodPhotoSourceCandidates(food).map((candidate) => (
            <a
              className="food-info-card"
              href={candidate.href}
              key={candidate.sourceName}
              rel="noreferrer"
              target="_blank"
            >
              <h3>{candidate.sourceName}</h3>
              <p style={{ color: "var(--brand)" }}>{candidate.licenseFit}</p>
              <p>{candidate.reviewNote}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
