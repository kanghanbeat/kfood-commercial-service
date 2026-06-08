import Link from "next/link";
import { notFound } from "next/navigation";

import {
  alphaRegions,
  getRegion,
  getRegionFoods,
  getRegionPlaces
} from "@kfood/data";

export function generateStaticParams() {
  return alphaRegions.map((region) => ({ regionSlug: region.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ regionSlug: string }>;
}) {
  const { regionSlug } = await params;
  const region = getRegion(regionSlug);
  return {
    title: region ? `${region.nameEn} K-food Guide` : "Region"
  };
}

export default async function RegionDetailPage({
  params
}: {
  params: Promise<{ regionSlug: string }>;
}) {
  const { regionSlug } = await params;
  const region = getRegion(regionSlug);

  if (!region) {
    notFound();
  }

  const foods = getRegionFoods(region.slug);
  const places = getRegionPlaces(region.slug);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">{region.primaryAudience}</p>
        <h1>{region.nameEn}</h1>
        <p className="detail-intro">{region.intro}</p>
        <div className="tag-row">
          {region.bestForTags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="section-block" aria-labelledby="region-foods">
        <div className="section-heading">
          <p className="eyebrow">What to eat</p>
          <h2 id="region-foods">Recommended foods</h2>
        </div>
        <ul className="content-list">
          {foods.map((food) => (
            <li key={food.slug}>
              <Link href={`/foods/${food.slug}`}>
                <span className="meta-label">Spicy level {food.spicyLevel}/4</span>
                <strong>{food.nameEn}</strong>
                <p>{food.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block" aria-labelledby="region-places">
        <div className="section-heading">
          <p className="eyebrow">Where to try</p>
          <h2 id="region-places">Place directions</h2>
        </div>
        <ul className="content-list">
          {places.map((place) => (
            <li key={place.slug}>
              <Link href={`/places/${place.slug}`}>
                <span className="meta-label">{place.lastVerifiedLabel}</span>
                <strong>{place.nameEn}</strong>
                <p>{place.editorialNote}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
