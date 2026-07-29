import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublishedRoute,
  getPublishedPlaces,
  getPublishedRoutes,
  getPublishedRegion
} from "@kfood/data";

import { resolveCardPhoto } from "@/components/card-photo";
import { JsonLd } from "@/components/json-ld";
import { absUrl, breadcrumbLd, clip, detailMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const routes = await getPublishedRoutes();
  return routes.map((route) => ({ routeSlug: route.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ routeSlug: string }>;
}) {
  const { routeSlug } = await params;
  const route = await getPublishedRoute(routeSlug);
  if (!route) return { title: "K-food Route" };
  return detailMetadata({
    title: `${route.title} — K-food Route`,
    description: route.summary,
    path: `/routes/${route.slug}`,
    imageUrl: route.imageUrl
  });
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
    getPublishedRegion(route.regionSlug)
  ]);
  const routePlaces =
    route.placeSlugs.length > 0
      ? route.placeSlugs
          .map((placeSlug) => places.find((place) => place.slug === placeSlug))
          .filter((place) => place !== undefined)
      : places;

  const heroPhoto = resolveCardPhoto(route.title);

  const jsonLd = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Routes", path: "/routes" },
      { name: route.title, path: `/routes/${route.slug}` }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: `${route.title} — K-food Route`,
      description: clip(route.summary),
      url: absUrl(`/routes/${route.slug}`),
      ...(route.estimatedDuration ? { estimatedDuration: route.estimatedDuration } : {}),
      ...(route.imageUrl ? { image: route.imageUrl } : {})
    }
  ];

  return (
    <main className="page-shell">
      <JsonLd data={jsonLd} />
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
