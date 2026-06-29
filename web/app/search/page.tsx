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
      <section className="search-panel" aria-label="Search preview">
        <div className="search-preview-input">
          Try kalguksu, Myeongdong, Seoul, or a user name
        </div>
        <p className="muted-copy">
          Search preview. Live cross-entity search will be enabled after the
          community search schema and ranking rules are connected.
        </p>
        <div className="tab-row" aria-label="Future search filters">
          {["All", "Foods", "Areas", "Places", "Posts", "Users"].map((tab) => (
            <span className={tab === "All" ? "active-tab" : ""} key={tab}>
              {tab}
            </span>
          ))}
        </div>
      </section>
      <section className="section-block" aria-labelledby="search-intents">
        <div className="section-heading">
          <p className="eyebrow">Search paths</p>
          <h2 id="search-intents">Choose the kind of discovery you need</h2>
        </div>
        <ul className="intent-grid">
          <li>
            <span>Food to Area</span>
            <strong>Find where a dish is known</strong>
            <p>Start with a food, then compare representative Seoul and metro areas.</p>
          </li>
          <li>
            <span>Area to Food</span>
            <strong>Find what to eat nearby</strong>
            <p>Start with an area, then browse verified foods and route ideas.</p>
          </li>
          <li>
            <span>Place lookup</span>
            <strong>Check map-linked directions</strong>
            <p>Use trust notes, map URLs, and last verified context before visiting.</p>
          </li>
          <li>
            <span>Community</span>
            <strong>Posts and users later</strong>
            <p>User records will be searchable after moderation and profile rules land.</p>
          </li>
        </ul>
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
