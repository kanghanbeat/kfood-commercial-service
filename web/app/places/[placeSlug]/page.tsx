import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fallbackFoods,
  getPublishedFoods,
  getPublishedPlace,
  getPublishedPlaces,
  getPublishedRegion
} from "@kfood/data";

import { resolveCardPhoto } from "@/components/card-photo";

export async function generateStaticParams() {
  const places = await getPublishedPlaces();
  return places.map((place) => ({ placeSlug: place.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ placeSlug: string }>;
}) {
  const { placeSlug } = await params;
  const place = await getPublishedPlace(placeSlug);
  return {
    title: place ? place.nameEn : "Place"
  };
}

export default async function PlaceDetailPage({
  params
}: {
  params: Promise<{ placeSlug: string }>;
}) {
  const { placeSlug } = await params;
  const place = await getPublishedPlace(placeSlug);

  if (!place) {
    notFound();
  }

  const [publishedFoods, region] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegion(place.regionSlug)
  ]);
  const sourceFoods = publishedFoods.length > 0 ? publishedFoods : fallbackFoods;
  const foods = sourceFoods.filter((food) => place.foodSlugs.includes(food.slug));

  const heroPhoto = resolveCardPhoto(place.nameEn);

  return (
    <main className="page-shell">
      <div
        className="food-hero-photo"
        style={{ background: heroPhoto.gradient }}
        aria-hidden="true"
      >
        <span className="food-hero-photo-mono" style={{ color: heroPhoto.glyph }}>
          {heroPhoto.letter}
        </span>
      </div>

      <header className="detail-header">
        <p className="eyebrow">{place.lastVerifiedLabel}</p>
        <h1>{place.nameEn}</h1>
        <p className="detail-intro">{place.editorialNote}</p>
        <div className="tag-row">
          {place.trustTags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="section-block" aria-labelledby="place-context">
        <div className="section-heading">
          <p className="eyebrow">Context</p>
          <h2 id="place-context">Trip fit</h2>
        </div>
        <ul className="content-list">
          {region ? (
            <li>
              <Link href={`/regions/${region.slug}`}>
                <span className="meta-label">Region</span>
                <strong>{region.nameEn}</strong>
                <p>{region.routeTheme}</p>
              </Link>
            </li>
          ) : null}
          <li>
            <div className="list-item-body">
              <span className="meta-label">Cautions</span>
              <strong>Before you go</strong>
              <p>{place.cautionTags.join(", ")}</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="section-block" aria-labelledby="place-map-business">
        <div className="section-heading">
          <p className="eyebrow">Map and business info</p>
          <h2 id="place-map-business">Check before visiting</h2>
        </div>
        <div className="action-row" aria-label="Map links">
          {place.googleMapsUrl ? (
            <a
              className="button primary"
              href={place.googleMapsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Google Maps
            </a>
          ) : null}
          {place.naverMapsUrl ? (
            <a
              className="button secondary"
              href={place.naverMapsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Naver Map
            </a>
          ) : null}
        </div>
        <ul className="content-list">
          <li>
            <div className="list-item-body">
              <span className="meta-label">Hours</span>
              <strong>Live map confirmation required</strong>
              <p>
                {place.businessHoursNote ??
                  "Business hours are not independently verified yet. Check the linked live map before visiting."}
              </p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Scope</span>
              <strong>What this place record means</strong>
              <p>
                {place.businessInfoNote ??
                  "Confirm address, current operation, and route fit in the linked map before relying on this place."}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section className="section-block" aria-labelledby="place-foods">
        <div className="section-heading">
          <p className="eyebrow">Food match</p>
          <h2 id="place-foods">Known for</h2>
        </div>
        <ul className="content-list">
          {foods.map((food) => (
            <li key={food.slug}>
              <Link href={`/foods/${food.slug}`}>
                <span className="meta-label">{food.tasteProfile}</span>
                <strong>{food.nameEn}</strong>
                <p>{food.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
