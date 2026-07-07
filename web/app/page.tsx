import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3l5 5-5 5M3 8h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function HomePage() {
  const [foods, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  const featuredRegions = regions.slice(0, 3);
  const trendingFoods = foods.slice(0, 3);
  const curatedRoutes = routes.slice(0, 3);

  return (
    <div className="home-v2">
      <section className="hero-v2">
        <span className="hero-v2-badge">For travelers in Korea</span>
        <h1 className="hero-v2-headline">Discover Korea through its food</h1>
        <p className="hero-v2-subtitle">
          Find iconic dishes, the regions they come from, and the best places
          to taste them.
        </p>
        <form className="hero-v2-search-form" action="/search" method="get" role="search">
          <input
            className="hero-v2-search-input"
            type="search"
            name="q"
            placeholder="Search foods, regions, or places..."
            aria-label="Search foods, regions, or places"
          />
          <button className="hero-v2-search-button" type="submit">
            Search
          </button>
        </form>
        <Link className="hero-v2-cta" href="/foods">
          Start your food journey
        </Link>
      </section>

      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-title">Trending K-Food</span>
              <span className="section-v2-subtitle">
                The most talked-about dishes travelers are loving right now
              </span>
            </div>
            <Link className="section-v2-link" href="/foods">
              View all <ArrowRightIcon />
            </Link>
          </div>
          <div className="card-grid-v2">
            {trendingFoods.map((food) => (
              <Link className="card-v2" href={`/foods/${food.slug}`} key={food.slug}>
                <CardPhoto label={food.nameEn} variant="food" />
                <div className="card-v2-body">
                  <span className="card-v2-title">{food.nameEn}</span>
                  <span className="card-v2-meta">{food.summary}</span>
                  <span className="card-v2-link">
                    Explore <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-v2 alt">
        <div className="section-v2-inner">
          <div className="section-v2-heading" style={{ alignItems: "center", textAlign: "center" }}>
            <span className="section-v2-title">Explore by region</span>
            <span className="section-v2-subtitle">
              Every Korean city has its own flavor. Pick a region and discover
              the dishes worth traveling for.
            </span>
          </div>
          <div className="card-grid-v2">
            {featuredRegions.map((region) => {
              const dishCount = foods.filter((food) =>
                food.regionSlugs.includes(region.slug)
              ).length;
              return (
                <Link
                  className="card-v2"
                  href={`/regions/${region.slug}`}
                  key={region.slug}
                >
                  <CardPhoto label={region.nameEn} variant="region" tall />
                  <div className="card-v2-body">
                    <span className="card-v2-title">{region.nameEn}</span>
                    <span className="card-v2-meta">
                      {dishCount} must-try dishes
                    </span>
                    <span className="card-v2-link">
                      Explore <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Plan your trip</span>
              <span className="section-v2-title">Curated routes</span>
              <span className="section-v2-subtitle">
                Ready-made food journeys that connect the best dishes,
                markets, and neighborhoods.
              </span>
            </div>
            <Link className="section-v2-link" href="/routes">
              View all routes <ArrowRightIcon />
            </Link>
          </div>
          <div className="card-grid-v2">
            {curatedRoutes.map((route) => (
              <Link className="card-v2" href={`/routes/${route.slug}`} key={route.slug}>
                <CardPhoto label={route.title} variant="route" />
                <div className="card-v2-body">
                  <span className="card-v2-title">{route.title}</span>
                  <span className="card-v2-meta">{route.estimatedDuration}</span>
                  <span className="card-v2-link">
                    View <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
