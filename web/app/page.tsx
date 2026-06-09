import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";

export default async function HomePage() {
  const [foods, places, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  return (
    <main className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Seoul alpha directory</p>
          <h1>Find what to eat, where to try it, and how to route it.</h1>
          <p>
            A web-first K-food guide for travelers who need practical food
            choices, trusted editorial notes, and routes that work on the
            ground.
          </p>
          <div className="action-row">
            <Link className="button primary" href="/regions">
              Browse regions
            </Link>
            <Link className="button secondary" href="/foods">
              Explore foods
            </Link>
          </div>
        </div>
        <div className="route-visual" aria-label="Seoul alpha route preview">
          {regions.map((region, index) => (
            <Link
              className="route-node"
              href={`/regions/${region.slug}`}
              key={region.slug}
              style={{ "--node-index": index } as React.CSSProperties}
            >
              <span>{region.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="metric-strip" aria-label="Alpha coverage">
        <div>
          <strong>{regions.length}</strong>
          <span>regions</span>
        </div>
        <div>
          <strong>{foods.length}</strong>
          <span>foods</span>
        </div>
        <div>
          <strong>{places.length}</strong>
          <span>place directions</span>
        </div>
        <div>
          <strong>{routes.length}</strong>
          <span>routes</span>
        </div>
      </section>

      <section className="section-block" aria-labelledby="alpha-regions">
        <div className="section-heading">
          <p className="eyebrow">Start by area</p>
          <h2 id="alpha-regions">Seoul alpha areas</h2>
        </div>
        <ul className="directory-grid">
          {regions.map((region) => (
            <li className="directory-card" key={region.slug}>
              <Link href={`/regions/${region.slug}`}>
                <span>{region.primaryAudience}</span>
                <strong>{region.nameEn}</strong>
                <p>{region.routeTheme}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
