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

// 히어로 검색창 바로 아래에 노출하는 인기 검색어. 실제 검색 결과가
// 나오는 키워드만 넣는다(이름·설명·태그 매칭 기준).
const QUICK_SEARCHES = ["Tteokbokki", "Korean BBQ", "Market", "Spicy", "Mild"];

// 취향별 시작점. query는 /search가 실제로 매칭하는 단어여야 한다.
const START_INTENTS = [
  {
    title: "First time in Korea?",
    description:
      "Start with mild, beginner-friendly dishes that are easy to order and easy to love.",
    query: "mild",
    label: "See gentle picks"
  },
  {
    title: "Here for the heat",
    description:
      "Tteokbokki, budae-jjigae, and every spicy classic worth sweating for.",
    query: "spicy",
    label: "Bring the heat"
  },
  {
    title: "Market food explorer",
    description:
      "Eat where locals eat — market alleys, sizzling pancakes, and quick bites.",
    query: "market",
    label: "Explore markets"
  }
];

export default async function HomePage() {
  const [foods, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  const featuredRegions = regions.slice(0, 3);
  const trendingFoods = foods.slice(0, 6);
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
        <div className="hero-v2-quick" aria-label="Popular searches">
          <span className="hero-v2-quick-label">Popular:</span>
          {QUICK_SEARCHES.map((term) => (
            <Link
              className="hero-v2-quick-chip"
              href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
              key={term}
            >
              {term}
            </Link>
          ))}
        </div>
        <Link className="hero-v2-cta" href="/foods">
          Start your food journey
        </Link>
      </section>

      <section className="home-stats" aria-label="What this guide covers">
        <div className="home-stats-item">
          <span className="home-stats-number">{foods.length}</span>
          <span className="home-stats-label">Dishes explained</span>
        </div>
        <div className="home-stats-item">
          <span className="home-stats-number">{regions.length}</span>
          <span className="home-stats-label">Regions covered</span>
        </div>
        <div className="home-stats-item">
          <span className="home-stats-number">{routes.length}</span>
          <span className="home-stats-label">Curated routes</span>
        </div>
        <div className="home-stats-item">
          <span className="home-stats-number">0–4</span>
          <span className="home-stats-label">Spice levels rated</span>
        </div>
      </section>

      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Start here</span>
              <span className="section-v2-title">What kind of eater are you?</span>
              <span className="section-v2-subtitle">
                Pick a starting point and we&apos;ll match you with the right
                dishes.
              </span>
            </div>
          </div>
          <div className="home-intent-grid">
            {START_INTENTS.map((intent) => (
              <Link
                className="home-intent-card"
                href={`/search?q=${encodeURIComponent(intent.query)}`}
                key={intent.query}
              >
                <span className="home-intent-title">{intent.title}</span>
                <span className="home-intent-desc">{intent.description}</span>
                <span className="card-v2-link">
                  {intent.label} <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-v2 alt">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Eat</span>
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
                  <span className="food-chip spicy">Spicy {food.spicyLevel}/4</span>
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

      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Go</span>
              <span className="section-v2-title">Explore by region</span>
              <span className="section-v2-subtitle">
                Every Korean city has its own flavor. Pick a region and discover
                the dishes worth traveling for.
              </span>
            </div>
            <Link className="section-v2-link" href="/regions">
              View all <ArrowRightIcon />
            </Link>
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
                    <span className="food-chip">{region.primaryAudience}</span>
                    <span className="card-v2-title">{region.nameEn}</span>
                    <span className="card-v2-meta">
                      {region.intro}
                    </span>
                    <span className="card-v2-meta strong">
                      {dishCount > 0
                        ? `${dishCount} must-try ${dishCount === 1 ? "dish" : "dishes"}`
                        : "Guide in progress"}
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

      <section className="section-v2 alt">
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
                  <span className="food-chip">{route.estimatedDuration}</span>
                  <span className="card-v2-title">{route.title}</span>
                  <span className="card-v2-meta">{route.summary}</span>
                  <span className="card-v2-link">
                    View <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <span className="home-cta-title">Ready to eat your way through Korea?</span>
        <p className="home-cta-subtitle">
          Every dish page explains taste, spice level, and where it fits in
          your trip — no guesswork at the menu.
        </p>
        <div className="home-cta-actions">
          <Link className="home-cta-primary" href="/foods">
            Browse all dishes
          </Link>
          <Link className="home-cta-secondary" href="/routes">
            See food routes
          </Link>
        </div>
      </section>
    </div>
  );
}
