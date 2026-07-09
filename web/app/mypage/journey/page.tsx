import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMyFoodLog,
  getMyJourneyShareToken,
  getPublishedFoods,
  getPublishedRegions,
  isBoardEnabled
} from "@kfood/data";

import {
  ensurePublicProfile,
  getRequestOrigin,
  requirePublicSession
} from "@/lib/public-auth";

const COLLECTION_GOAL = 50;
const spicyLabels = ["Not spicy", "Mild", "Medium", "Spicy", "Very spicy"];

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Your K-Food Journey Recap"
};

export default async function JourneyRecapPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  if (!(await isBoardEnabled("journey_share"))) {
    notFound();
  }

  const [session, params] = await Promise.all([
    requirePublicSession("/mypage/journey"),
    searchParams
  ]);
  await ensurePublicProfile(session);

  const [foods, regions, triedAt, shareToken, origin] = await Promise.all([
    getPublishedFoods(),
    getPublishedRegions(),
    getMyFoodLog(session.accessToken, session.userId),
    getMyJourneyShareToken(session.accessToken, session.userId),
    getRequestOrigin()
  ]);
  const shareUrl = shareToken ? `${origin}/journey/${shareToken}` : null;

  const triedFoods = foods.filter((food) => triedAt.has(food.slug));
  const triedCount = triedFoods.length;
  const collectionPercent =
    foods.length > 0 ? Math.round((triedCount / foods.length) * 100) : 0;

  const regionSlugsCovered = new Set(
    triedFoods.flatMap((food) => food.regionSlugs)
  );
  const regionsCovered = regions.filter((region) =>
    regionSlugsCovered.has(region.slug)
  );

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

  const firstTriedAt = triedFoods.reduce<string | null>((earliest, food) => {
    const value = triedAt.get(food.slug) ?? null;
    if (!value) {
      return earliest;
    }
    return !earliest || value < earliest ? value : earliest;
  }, null);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">K-Food Journey Recap</p>
        <h1>Your trip in numbers.</h1>
        <p className="detail-intro">
          A snapshot of the K-food collection you have tried so far. Photos
          are coming in a later update.
        </p>
      </header>

      {triedCount === 0 ? (
        <section className="form-panel">
          <h2>No dishes tried yet</h2>
          <p>
            Mark dishes as tried from your collection to build your recap.
          </p>
          <div className="action-row">
            <Link className="button primary" href="/mypage">
              Go to your collection
            </Link>
          </div>
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
                <h2 id="journey-regions">Regions you explored</h2>
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
                <h2 id="journey-flavors">Flavors you tried</h2>
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

          <section className="section-block" aria-labelledby="journey-timeline">
            <div className="section-heading">
              <h2 id="journey-timeline">Your first record</h2>
              <p>
                {firstTriedAt
                  ? `You started your K-food journey on ${new Date(firstTriedAt).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}.`
                  : "Timeline data is not available yet."}
              </p>
            </div>
          </section>

          <section className="form-panel" aria-labelledby="journey-share">
            <h2 id="journey-share">Share your journey</h2>
            <p>
              Anyone with this link can view a read-only recap. Your email and
              account details are never shown.
            </p>
            {params?.error ? (
              <p className="status-message error">{params.error}</p>
            ) : null}
            {shareUrl ? (
              <div className="action-row">
                <input readOnly value={shareUrl} />
                <Link className="button secondary" href={`/journey/${shareToken}`}>
                  Open link
                </Link>
              </div>
            ) : (
              <form action="/mypage/journey/share" method="post">
                <button className="button primary" type="submit">
                  Create shareable link
                </button>
              </form>
            )}
          </section>
        </>
      )}

      <div className="action-row">
        <Link className="button secondary" href="/mypage">
          Back to mypage
        </Link>
      </div>
    </main>
  );
}
