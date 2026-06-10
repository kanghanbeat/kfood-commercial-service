import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fallbackPlaces,
  getPublishedFood,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions
} from "@kfood/data";

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

  const [publishedPlaces, regions] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions()
  ]);
  const sourcePlaces =
    publishedPlaces.length > 0 ? publishedPlaces : fallbackPlaces;
  const places = sourcePlaces.filter((place) =>
    place.foodSlugs.includes(food.slug)
  );

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Spicy level {food.spicyLevel}/4</p>
        <h1>{food.nameEn}</h1>
        <p className="detail-intro">{food.summary}</p>
        <div className="tag-row">
          <span className="tag">{food.tasteProfile}</span>
          <span className="tag">{food.beginnerNote}</span>
        </div>
      </header>

      <section className="section-block" aria-labelledby="food-regions">
        <div className="section-heading">
          <p className="eyebrow">Where it fits</p>
          <h2 id="food-regions">Regions</h2>
        </div>
        <ul className="content-list">
          {food.regionSlugs.map((regionSlug) => {
            const region = regions.find((item) => item.slug === regionSlug);
            return region ? (
              <li key={region.slug}>
                <Link href={`/regions/${region.slug}`}>
                  <span className="meta-label">{region.primaryAudience}</span>
                  <strong>{region.nameEn}</strong>
                  <p>{region.routeTheme}</p>
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <section className="section-block" aria-labelledby="food-places">
        <div className="section-heading">
          <p className="eyebrow">Try it here</p>
          <h2 id="food-places">Place directions</h2>
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
