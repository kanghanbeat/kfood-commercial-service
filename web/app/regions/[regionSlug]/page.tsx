import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublishedRegion,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedProductionsFor,
  getPublishedRegions,
  getRegionFoods,
  getRegionPlaces
} from "@kfood/data";

import { resolveCardPhoto } from "@/components/card-photo";
import { JsonLd } from "@/components/json-ld";
import { absUrl, breadcrumbLd, clip, detailMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const regions = await getPublishedRegions();
  return regions.map((region) => ({ regionSlug: region.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ regionSlug: string }>;
}) {
  const { regionSlug } = await params;
  const region = await getPublishedRegion(regionSlug);
  if (!region) return { title: "Region" };
  return detailMetadata({
    title: `${region.nameEn} — K-food Guide`,
    description: region.intro,
    path: `/regions/${region.slug}`,
    imageUrl: region.imageUrl
  });
}

export default async function RegionDetailPage({
  params
}: {
  params: Promise<{ regionSlug: string }>;
}) {
  const { regionSlug } = await params;
  const region = await getPublishedRegion(regionSlug);

  if (!region) {
    notFound();
  }

  const [allFoods, allPlaces, productions] = await Promise.all([
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedProductionsFor("region", regionSlug)
  ]);
  const foods = allFoods.some((food) => food.regionSlugs.length > 0)
    ? allFoods.filter((food) => food.regionSlugs.includes(region.slug))
    : getRegionFoods(region.slug);
  const places = allPlaces.some((place) => place.regionSlug === region.slug)
    ? allPlaces.filter((place) => place.regionSlug === region.slug)
    : getRegionPlaces(region.slug);

  const heroPhoto = resolveCardPhoto(region.nameEn);

  const jsonLd = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Regions", path: "/regions" },
      { name: region.nameEn, path: `/regions/${region.slug}` }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: `${region.nameEn} — K-food Guide`,
      description: clip(region.intro),
      url: absUrl(`/regions/${region.slug}`),
      ...(region.imageUrl ? { image: region.imageUrl } : {})
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

      {productions.length > 0 ? (
        <section className="section-block" aria-labelledby="region-productions">
          <div className="section-heading">
            <p className="eyebrow">From our channels</p>
            <h2 id="region-productions">Watch and read</h2>
          </div>
          <ul className="content-list">
            {productions.map((production) => (
              <li key={production.slug}>
                {production.externalUrl ? (
                  <a href={production.externalUrl} rel="noreferrer" target="_blank">
                    <span className="meta-label">
                      {production.type.toUpperCase()}
                      {production.channel ? ` · ${production.channel}` : ""}
                    </span>
                    <strong>{production.title}</strong>
                    {production.summary ? <p>{production.summary}</p> : null}
                  </a>
                ) : (
                  <div className="list-item-body">
                    <span className="meta-label">
                      {production.type.toUpperCase()}
                      {production.channel ? ` · ${production.channel}` : ""}
                    </span>
                    <strong>{production.title}</strong>
                    {production.summary ? <p>{production.summary}</p> : null}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
