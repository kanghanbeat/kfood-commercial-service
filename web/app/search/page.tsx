import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";

export const metadata = {
  title: "Search"
};

export default async function SearchPage() {
  const [foods, places, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Unified search</p>
        <h1>Search foods, areas, places, posts, and users.</h1>
        <p className="detail-intro">
          This first shell keeps the verified directory visible while community
          records and user search are prepared behind the next data model.
        </p>
      </header>
      <section className="search-panel" aria-label="Search input">
        <label>
          Search
          <input
            disabled
            placeholder="Try kalguksu, Myeongdong, Seoul, or a user name"
            type="search"
          />
        </label>
        <p className="muted-copy">
          Live cross-entity search will be enabled after the community search
          schema and ranking rules are implemented.
        </p>
      </section>
      <section className="section-block" aria-labelledby="search-tabs">
        <div className="section-heading">
          <p className="eyebrow">Explore trusted data</p>
          <h2 id="search-tabs">Start with verified records</h2>
        </div>
        <ul className="directory-grid">
          <li className="directory-card">
            <Link href="/foods">
              <span>{foods.length} entries</span>
              <strong>Foods</strong>
              <p>Search by food, then connect to areas and places.</p>
            </Link>
          </li>
          <li className="directory-card">
            <Link href="/regions">
              <span>{regions.length} entries</span>
              <strong>Areas</strong>
              <p>Search by area, then discover representative foods.</p>
            </Link>
          </li>
          <li className="directory-card">
            <Link href="/places">
              <span>{places.length} entries</span>
              <strong>Places</strong>
              <p>Review map-linked place directions and trust notes.</p>
            </Link>
          </li>
          <li className="directory-card">
            <Link href="/routes">
              <span>{routes.length} entries</span>
              <strong>Routes</strong>
              <p>Use route ideas as the bridge into recommendations.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
