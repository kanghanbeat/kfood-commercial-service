import Link from "next/link";
import { notFound } from "next/navigation";

import {
  alphaRoutes,
  getPublishedRoute,
  getPublishedPlaces,
  getRegion
} from "@kfood/data";

export function generateStaticParams() {
  return alphaRoutes.map((route) => ({ routeSlug: route.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ routeSlug: string }>;
}) {
  const { routeSlug } = await params;
  const route = await getPublishedRoute(routeSlug);

  return {
    title: route ? `${route.title} K-food Route` : "K-food Route"
  };
}

export default async function RouteDetailPage({
  params
}: {
  params: Promise<{ routeSlug: string }>;
}) {
  const { routeSlug } = await params;
  const route = await getPublishedRoute(routeSlug);

  if (!route) {
    notFound();
  }

  const [places, region] = await Promise.all([
    getPublishedPlaces(),
    Promise.resolve(getRegion(route.regionSlug))
  ]);
  const routePlaces = places.filter((place) =>
    route.placeSlugs.length > 0 ? route.placeSlugs.includes(place.slug) : true
  );

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">{route.estimatedDuration}</p>
        <h1>{route.title}</h1>
        <p className="detail-intro">{route.summary}</p>
        {region ? (
          <div className="tag-row">
            <Link className="tag" href={`/regions/${region.slug}`}>
              {region.nameEn}
            </Link>
          </div>
        ) : null}
      </header>

      <section className="section-block" aria-labelledby="route-places">
        <div className="section-heading">
          <p className="eyebrow">Route stops</p>
          <h2 id="route-places">Where this route points</h2>
        </div>
        <ul className="content-list">
          {routePlaces.map((place) => (
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
