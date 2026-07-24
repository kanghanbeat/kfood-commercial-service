import Link from "next/link";

import {
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes,
  type PublicFood,
  type PublicPlace,
  type PublicRegion,
  type PublicRoute
} from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";

export const metadata = {
  title: "Search"
};

// 검색어를 각 항목의 이름·설명·태그를 합친 텍스트에 대해 대소문자 구분 없이 매칭한다.
// (실데이터 연결 후에도 동일하게 동작 — 커뮤니티/유저 검색은 스키마 준비 후 추가)
function matches(haystack: (string | null | undefined)[], query: string) {
  const needle = query.toLowerCase();
  return haystack
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(needle));
}

function searchFoods(foods: PublicFood[], q: string) {
  return foods.filter((food) =>
    matches(
      [food.nameEn, food.nameKo, food.summary, food.tasteProfile, food.beginnerNote],
      q
    )
  );
}

function searchRegions(regions: PublicRegion[], q: string) {
  return regions.filter((region) =>
    matches(
      [
        region.nameEn,
        region.primaryAudience,
        region.kfoodIdentity,
        region.routeTheme,
        region.intro,
        ...region.bestForTags
      ],
      q
    )
  );
}

function searchPlaces(places: PublicPlace[], q: string) {
  return places.filter((place) =>
    matches([place.nameEn, place.editorialNote, ...place.trustTags], q)
  );
}

function searchRoutes(routes: PublicRoute[], q: string) {
  return routes.filter((route) =>
    matches([route.title, route.summary, route.estimatedDuration], q)
  );
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [foods, places, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  const hasQuery = query.length > 0;
  const foodHits = hasQuery ? searchFoods(foods, query) : [];
  const regionHits = hasQuery ? searchRegions(regions, query) : [];
  const placeHits = hasQuery ? searchPlaces(places, query) : [];
  const routeHits = hasQuery ? searchRoutes(routes, query) : [];
  const totalHits =
    foodHits.length + regionHits.length + placeHits.length + routeHits.length;

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Unified search</p>
        <h1>Search foods, areas, places, and routes.</h1>
        <p className="detail-intro">
          Search across the verified directory. Community posts and user search
          are prepared behind the next data model.
        </p>
      </header>

      <section className="search-panel" aria-label="Search">
        <form className="search-form" action="/search" method="get" role="search">
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Try kalguksu, Myeongdong, Seoul, or spicy"
            aria-label="Search foods, areas, places, and routes"
            autoFocus
          />
          <button className="button primary" type="submit">
            Search
          </button>
        </form>
        {hasQuery ? (
          <p className="muted-copy">
            {totalHits > 0
              ? `${totalHits} result${totalHits === 1 ? "" : "s"} for “${query}”`
              : `No results for “${query}”. Try a dish, area, or taste like “spicy”.`}
          </p>
        ) : (
          <p className="muted-copy">
            Type a dish, area, place, or taste. Results update on search.
          </p>
        )}
      </section>

      {hasQuery ? (
        <>
          {foodHits.length > 0 ? (
            <SearchResultSection title="Foods" count={foodHits.length}>
              {foodHits.map((food) => (
                <Link className="card-v2" href={`/foods/${food.slug}`} key={food.slug}>
                  <CardPhoto
                  imageUrl={food.imageUrl}
                  label={food.nameEn}
                  variant="food" />
                  <div className="card-v2-body">
                    <span className="card-v2-title">{food.nameEn}</span>
                    <span className="card-v2-meta">{food.summary}</span>
                    <span className="card-v2-link">Explore →</span>
                  </div>
                </Link>
              ))}
            </SearchResultSection>
          ) : null}

          {regionHits.length > 0 ? (
            <SearchResultSection title="Areas" count={regionHits.length}>
              {regionHits.map((region) => (
                <Link
                  className="card-v2"
                  href={`/regions/${region.slug}`}
                  key={region.slug}
                >
                  <CardPhoto
                  imageUrl={region.imageUrl}
                  label={region.nameEn}
                  variant="region" />
                  <div className="card-v2-body">
                    <span className="card-v2-title">{region.nameEn}</span>
                    <span className="card-v2-meta">{region.intro}</span>
                    <span className="card-v2-link">Explore →</span>
                  </div>
                </Link>
              ))}
            </SearchResultSection>
          ) : null}

          {placeHits.length > 0 ? (
            <SearchResultSection title="Places" count={placeHits.length}>
              {placeHits.map((place) => (
                <Link
                  className="card-v2"
                  href={`/places/${place.slug}`}
                  key={place.slug}
                >
                  <CardPhoto
                  imageUrl={place.imageUrl}
                  label={place.nameEn}
                  variant="place" />
                  <div className="card-v2-body">
                    <span className="card-v2-title">{place.nameEn}</span>
                    <span className="card-v2-meta">{place.editorialNote}</span>
                    <span className="card-v2-link">View →</span>
                  </div>
                </Link>
              ))}
            </SearchResultSection>
          ) : null}

          {routeHits.length > 0 ? (
            <SearchResultSection title="Routes" count={routeHits.length}>
              {routeHits.map((route) => (
                <Link
                  className="card-v2"
                  href={`/routes/${route.slug}`}
                  key={route.slug}
                >
                  <CardPhoto
                  imageUrl={route.imageUrl}
                  label={route.title}
                  variant="route" />
                  <div className="card-v2-body">
                    <span className="card-v2-title">{route.title}</span>
                    <span className="card-v2-meta">{route.summary}</span>
                    <span className="card-v2-link">View →</span>
                  </div>
                </Link>
              ))}
            </SearchResultSection>
          ) : null}
        </>
      ) : (
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
      )}
    </main>
  );
}

function SearchResultSection({
  title,
  count,
  children
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="section-block" aria-label={`${title} results`}>
      <div className="section-heading">
        <p className="eyebrow">
          {count} {title}
        </p>
        <h2>{title}</h2>
      </div>
      <div className="card-grid-v2">{children}</div>
    </section>
  );
}
