import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedProductions,
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

// 메인은 4섹션 고정: ①히어로 ②한국 지도 ③트렌딩·에디터 픽 ④채널 연동
// (기획정렬-한빛대조.md §1-4). 지도는 2주차에 SVG 컴포넌트로 교체 예정 —
// 이번 주는 자리(플레이스홀더)만 잡는다.
export default async function HomePage() {
  const [foods, regions, routes, productions] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions(),
    getPublishedRoutes(),
    getPublishedProductions(6)
  ]);

  const trendingFoods = foods.slice(0, 6);
  const editorPicks = routes.slice(0, 3);
  const mapQuickRegions = regions.slice(0, 6);

  return (
    <div className="home-v2">
      {/* ① 히어로 */}
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

      {/* ② 한국 지도 (2주차에 SVG 지도로 교체 — 지금은 자리만) */}
      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Explore</span>
              <span className="section-v2-title">Where will you eat next?</span>
              <span className="section-v2-subtitle">
                Pick a region and discover the dishes worth traveling for.
              </span>
            </div>
            <Link className="section-v2-link" href="/regions">
              All regions <ArrowRightIcon />
            </Link>
          </div>
          <div className="home-map-placeholder" aria-label="Korea food map">
            <div className="home-map-placeholder-badge">Interactive map coming soon</div>
            <p className="home-map-placeholder-copy">
              A clickable map of Korea is on its way. Until then, jump straight
              into a region:
            </p>
            <div className="home-map-placeholder-links">
              {mapQuickRegions.map((region) => (
                <Link
                  className="food-subnav-tab"
                  href={`/regions/${region.slug}`}
                  key={region.slug}
                >
                  {region.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ③ 트렌딩 음식 + 에디터 픽 */}
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
          <div className="section-v2-header" style={{ marginTop: 40 }}>
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Editor&apos;s picks</span>
              <span className="section-v2-title">Curated food routes</span>
              <span className="section-v2-subtitle">
                Ready-made food journeys that connect the best dishes, markets,
                and neighborhoods.
              </span>
            </div>
            <Link className="section-v2-link" href="/routes">
              View all routes <ArrowRightIcon />
            </Link>
          </div>
          <div className="card-grid-v2">
            {editorPicks.map((route) => (
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

      {/* ④ 채널 연동 — From our channels */}
      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">Watch</span>
              <span className="section-v2-title">From our channels</span>
              <span className="section-v2-subtitle">
                Videos and stories we film at the places on this site.
              </span>
            </div>
          </div>
          {productions.length === 0 ? (
            <div className="food-info-card">
              <p>Fresh videos and posts from our channels are on the way.</p>
            </div>
          ) : (
            <div className="food-info-grid">
              {productions.map((production) =>
                production.externalUrl ? (
                  <a
                    className="food-info-card"
                    href={production.externalUrl}
                    key={production.slug}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <h3>{production.title}</h3>
                    <p style={{ color: "var(--brand)" }}>
                      {production.type.toUpperCase()}
                      {production.channel ? ` · ${production.channel}` : ""}
                    </p>
                    {production.summary ? <p>{production.summary}</p> : null}
                  </a>
                ) : (
                  <div className="food-info-card" key={production.slug}>
                    <h3>{production.title}</h3>
                    <p style={{ color: "var(--brand)" }}>
                      {production.type.toUpperCase()}
                      {production.channel ? ` · ${production.channel}` : ""}
                    </p>
                    {production.summary ? <p>{production.summary}</p> : null}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
