import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublicJourney,
  getPublishedFoods,
  getPublishedRegions,
  isBoardEnabled
} from "@kfood/data";

const COLLECTION_GOAL = 50;
const spicyLabels = ["Not spicy", "Mild", "Medium", "Spicy", "Very spicy"];

export async function generateMetadata({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const journey = await getPublicJourney(shareToken);

  return {
    robots: {
      follow: false,
      index: false
    },
    title: journey?.displayName
      ? `${journey.displayName}'s K-Food Journey`
      : "K-Food Journey Recap"
  };
}

export default async function PublicJourneyPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  if (!(await isBoardEnabled("journey_share"))) {
    notFound();
  }

  const { shareToken } = await params;
  const journey = await getPublicJourney(shareToken);

  if (!journey) {
    notFound();
  }

  const [foods, regions] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions()
  ]);

  const triedAt = new Map(journey.entries.map((entry) => [entry.foodSlug, entry.triedAt]));
  const triedFoods = foods.filter((food) => triedAt.has(food.slug));
  const triedCount = triedFoods.length;
  const collectionPercent =
    foods.length > 0 ? Math.round((triedCount / foods.length) * 100) : 0;

  const regionSlugsCovered = new Set(triedFoods.flatMap((food) => food.regionSlugs));
  const regionsCovered = regions.filter((region) => regionSlugsCovered.has(region.slug));

  const flavorsCovered = Array.from(
    new Set(
      triedFoods.flatMap((food) =>
        food.tasteProfile
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  );

  const spiciestFood = triedFoods.reduce<(typeof triedFoods)[number] | null>(
    (spiciest, food) =>
      !spiciest || food.spicyLevel > spiciest.spicyLevel ? food : spiciest,
    null
  );

  const displayName = journey.displayName ?? "A K-food traveler";

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">K-Food Journey Recap</p>
        <h1>{displayName}&apos;s trip in numbers.</h1>
        <p className="detail-intro">
          A shared, read-only snapshot of the K-food dishes this traveler has
          tried.
        </p>
      </header>

      {triedCount === 0 ? (
        <section className="form-panel">
          <h2>No dishes tried yet</h2>
          <p>This traveler has not logged any dishes yet.</p>
        </section>
      ) : (
        <>
          <section className="section-block" aria-labelledby="journey-stats">
            <div className="section-heading">
              <h2 id="journey-stats">Trip summary</h2>
            </div>
            <div className="admin-metric-grid">
              <div className="admin-metric-card">
                <span className="admin-metric-label">Dishes tried</span>
                <span className="admin-metric-value">
                  {triedCount}/{COLLECTION_GOAL}
                </span>
                <span className="admin-metric-sub">First tasting goal</span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-label">Collection coverage</span>
                <span className="admin-metric-value">{collectionPercent}%</span>
                <span className="admin-metric-sub">
                  {triedCount}/{foods.length} published dishes
                </span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-label">Regions explored</span>
                <span className="admin-metric-value">{regionsCovered.length}</span>
                <span className="admin-metric-sub">Out of {regions.length} regions</span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-label">Spiciest dish tried</span>
                <span className="admin-metric-value">
                  {spiciestFood ? spicyLabels[spiciestFood.spicyLevel] : "—"}
                </span>
                <span className="admin-metric-sub">
                  {spiciestFood ? spiciestFood.nameEn : "Not tried yet"}
                </span>
              </div>
            </div>
          </section>

          {regionsCovered.length > 0 ? (
            <section className="section-block" aria-labelledby="journey-regions">
              <div className="section-heading">
                <h2 id="journey-regions">Regions explored</h2>
              </div>
              <div className="tag-row">
                {regionsCovered.map((region) => (
                  <Link className="tag" href={`/regions/${region.slug}`} key={region.slug}>
                    {region.nameEn}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {flavorsCovered.length > 0 ? (
            <section className="section-block" aria-labelledby="journey-flavors">
              <div className="section-heading">
                <h2 id="journey-flavors">Flavors tried</h2>
              </div>
              <div className="tag-row">
                {flavorsCovered.map((flavor) => (
                  <span className="tag" key={flavor}>
                    {flavor}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <div className="action-row">
        <Link className="button primary" href="/">
          Explore K-food dishes
        </Link>
      </div>
    </main>
  );
}
