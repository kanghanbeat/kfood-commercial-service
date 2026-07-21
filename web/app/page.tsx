import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedProductions,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";

import { CardPhoto, resolveCardPhoto } from "@/components/card-photo";
import {
  KoreaMap,
  type MapMarker,
  type ProvinceStats
} from "@/components/korea-map";
import { getDict } from "@/lib/i18n";
import { PROVINCES, REGION_MAP_POINTS } from "@/lib/provinces";

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
  const [foods, regions, routes, productions, dict] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions(),
    getPublishedRoutes(),
    getPublishedProductions(6),
    getDict()
  ]);
  const t = dict.home;

  const trendingFoods = foods.slice(0, 6);
  const editorPicks = routes.slice(0, 3);
  const mapQuickRegions = regions.slice(0, 6);

  // 시·도별 콘텐츠 밀도(지역·음식 수) — 지도 색칠과 툴팁에 쓴다.
  const publishedRegionSlugs = new Set(regions.map((region) => region.slug));
  const provinceStats: ProvinceStats = {};
  for (const [key, info] of Object.entries(PROVINCES)) {
    const activeRegionSlugs = info.regionSlugs.filter((slug) =>
      publishedRegionSlugs.has(slug)
    );
    const foodCount = foods.filter((food) =>
      food.regionSlugs.some((slug) => activeRegionSlugs.includes(slug))
    ).length;
    provinceStats[key] = { regionCount: activeRegionSlugs.length, foodCount };
  }

  // 지도 마커 — 발행된 지역 중 좌표(REGION_MAP_POINTS)가 등록된 것만.
  // 새 지역을 추가하면 좌표만 등록하면 지도에 자동으로 점이 생긴다.
  const mapMarkers: MapMarker[] = regions
    .filter((region) => REGION_MAP_POINTS[region.slug])
    .map((region) => ({
      slug: region.slug,
      nameEn: region.nameEn,
      ...REGION_MAP_POINTS[region.slug]
    }));

  return (
    <div className="home-v2">
      {/* ① 히어로 */}
      <section className="hero-v2">
        <span className="hero-v2-badge">{t.heroBadge}</span>
        {/* 매거진 히어로: 두 줄 디스플레이 타이포 — 강조 줄만 브랜드 보라 */}
        <h1 className="hero-v2-headline">
          {t.heroTitleTop}
          <span className="hero-v2-headline-accent">{t.heroTitleAccent}</span>
        </h1>
        <p className="hero-v2-subtitle">{t.heroSubtitle}</p>
        <form className="hero-v2-search-form" action="/search" method="get" role="search">
          <input
            className="hero-v2-search-input"
            type="search"
            name="q"
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
          <button className="hero-v2-search-button" type="submit">
            {t.searchButton}
          </button>
        </form>
        <div className="hero-v2-quick" aria-label="Popular searches">
          <span className="hero-v2-quick-label">{t.popularLabel}</span>
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
          {t.heroCta} →
        </Link>
      </section>

      {/* ② 한국 지도 — 시·도 SVG, 클릭 시 지역 목록 이동 */}
      <section className="section-v2">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">
                <span className="section-v2-num">01</span>
                {t.exploreEyebrow}
              </span>
              <span className="section-v2-title">{t.exploreTitle}</span>
              <span className="section-v2-subtitle">{t.exploreSubtitle}</span>
            </div>
            <Link className="section-v2-link" href="/regions">
              {t.allRegions} <ArrowRightIcon />
            </Link>
          </div>
          <KoreaMap
            stats={provinceStats}
            markers={mapMarkers}
            labels={{
              areas: t.mapAreas,
              dishes: t.mapDishes,
              comingSoon: t.mapComingSoon,
              hint: t.mapHint
            }}
          />
          {/* 지도는 클라이언트 렌더라, 검색엔진·키보드용 지역 바로가기는 링크로도 유지 */}
          <div className="home-map-placeholder-links">
            <span className="home-map-links-label">{t.popularAreas}</span>
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
      </section>

      {/* ③ 트렌딩 음식 + 에디터 픽 */}
      <section className="section-v2 alt">
        <div className="section-v2-inner">
          <div className="section-v2-header">
            <div className="section-v2-heading">
              <span className="section-v2-eyebrow">
                <span className="section-v2-num">02</span>
                {t.eatEyebrow}
              </span>
              <span className="section-v2-title">{t.trendingTitle}</span>
              <span className="section-v2-subtitle">{t.trendingSubtitle}</span>
            </div>
            <Link className="section-v2-link" href="/foods">
              {dict.common.viewAll} <ArrowRightIcon />
            </Link>
          </div>
          {/* mobile-carousel: 모바일 가로 스와이프 / magazine: 테두리 없는 이미지+캡션 카드 */}
          <div className="card-grid-v2 mobile-carousel magazine">
            {trendingFoods.map((food) => (
              <Link className="card-v2" href={`/foods/${food.slug}`} key={food.slug}>
                <CardPhoto label={food.nameEn} variant="food" />
                <div className="card-v2-body">
                  {/* 0/4는 정보가 아니라 소음 — 안 매운 음식은 중립 칩으로 "Not spicy" */}
                  <span className={food.spicyLevel > 0 ? "food-chip spicy" : "food-chip"}>
                    {food.spicyLevel > 0
                      ? `${dict.common.spicy} ${food.spicyLevel}/4`
                      : dict.foodDetail.spicyLabels[0]}
                  </span>
                  <span className="card-v2-title">{food.nameEn}</span>
                  <span className="card-v2-meta">{food.summary}</span>
                  <span className="card-v2-link">
                    {dict.common.explore} <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-v2-header" style={{ marginTop: 40 }}>
            <div className="section-v2-heading">
              {/* 루트는 02 EAT 섹션 안의 하위 블록이라 번호 없이 소제목만 */}
              <span className="section-v2-eyebrow">{t.editorEyebrow}</span>
              <span className="section-v2-title">{t.routesTitle}</span>
              <span className="section-v2-subtitle">{t.routesSubtitle}</span>
            </div>
            <Link className="section-v2-link" href="/routes">
              {t.viewAllRoutes} <ArrowRightIcon />
            </Link>
          </div>
          <div className="card-grid-v2 mobile-carousel magazine">
            {editorPicks.map((route) => (
              <Link className="card-v2" href={`/routes/${route.slug}`} key={route.slug}>
                <CardPhoto label={route.title} variant="route" />
                <div className="card-v2-body">
                  <span className="food-chip">{route.estimatedDuration}</span>
                  <span className="card-v2-title">{route.title}</span>
                  <span className="card-v2-meta">{route.summary}</span>
                  <span className="card-v2-link">
                    {dict.common.view} <ArrowRightIcon />
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
              <span className="section-v2-eyebrow">
                <span className="section-v2-num">03</span>
                {t.watchEyebrow}
              </span>
              <span className="section-v2-title">{t.channelsTitle}</span>
              <span className="section-v2-subtitle">{t.channelsSubtitle}</span>
            </div>
          </div>
          {productions.length === 0 ? (
            <div className="food-info-card">
              <p>{t.channelsEmpty}</p>
            </div>
          ) : (
            <div className="food-info-grid">
              {productions.map((production) => {
                const thumb = resolveCardPhoto(production.title);
                const body = (
                  <>
                    <span
                      className="channel-card-thumb"
                      style={{ background: thumb.gradient, color: thumb.glyph }}
                      aria-hidden="true"
                    >
                      {thumb.letter}
                    </span>
                    <span className="channel-card-body">
                      <span className="channel-card-title">{production.title}</span>
                      <span className="channel-card-kind">
                        {production.type.toUpperCase()}
                        {production.channel ? ` · ${production.channel}` : ""}
                      </span>
                      {production.summary ? (
                        <span className="channel-card-summary">{production.summary}</span>
                      ) : null}
                    </span>
                  </>
                );
                return production.externalUrl ? (
                  <a
                    className="channel-card"
                    href={production.externalUrl}
                    key={production.slug}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="channel-card" key={production.slug}>
                    {body}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
