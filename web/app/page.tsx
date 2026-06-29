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
            choices, trusted editorial notes, real user records, and routes
            that work on the ground.
          </p>
          <div className="entry-actions" aria-label="Start options">
            <div className="entry-choice-card">
              <span>Be guest</span>
              <strong>Browse without an account</strong>
              <p>Start with trusted search or preview the community feed.</p>
              <div className="entry-choice-links">
                <Link className="button primary" href="/search">
                  Search guide
                </Link>
                <Link className="button secondary" href="/feed">
                  Preview feed
                </Link>
              </div>
            </div>
            <Link className="entry-action-card" href="/auth/login?next=/mypage">
              <span>Sign up</span>
              <strong>Create your activity hub</strong>
              <p>Prepare your profile for future records, likes, and follows.</p>
            </Link>
            <Link className="entry-action-card" href="/auth/login?next=/feed">
              <span>Log in</span>
              <strong>Continue with your account</strong>
              <p>Use admin/editor access or return to your K-food workspace.</p>
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

      <section className="section-block" aria-labelledby="community-start">
        <div className="section-heading">
          <p className="eyebrow">Directory core + community layer</p>
          <h2 id="community-start">Start from records, search, or recommendations</h2>
          <p>
            User records add lived context, while verified foods, regions,
            places, and routes remain the service&apos;s trusted base.
          </p>
        </div>
        <ul className="directory-grid">
          <li className="directory-card">
            <Link href="/feed">
              <span>Community records</span>
              <strong>Feed</strong>
              <p>See public K-food moments connected to trusted food and area data.</p>
            </Link>
          </li>
          <li className="directory-card">
            <Link href="/search">
              <span>Unified discovery</span>
              <strong>Search</strong>
              <p>Find foods, areas, places, routes, posts, and users from one surface.</p>
            </Link>
          </li>
          <li className="directory-card">
            <Link href="/recommend">
              <span>Curated guidance</span>
              <strong>Recommend</strong>
              <p>Browse editorial picks and route ideas before personalization arrives.</p>
            </Link>
          </li>
        </ul>
      </section>

      <section className="section-block" aria-labelledby="alpha-regions">
        <div className="section-heading">
          <p className="eyebrow">Trusted data layer</p>
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
