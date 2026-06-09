import Link from "next/link";
import { notFound } from "next/navigation";

import {
  alphaFoods,
  alphaPlaces,
  getPublishedPlace,
  getRegion
} from "@kfood/data";

export function generateStaticParams() {
  return alphaPlaces.map((place) => ({ placeSlug: place.slug }));
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

  const region = getRegion(place.regionSlug);
  const foods = alphaFoods.filter((food) => place.foodSlugs.includes(food.slug));

  return (
    <main className="page-shell">
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
