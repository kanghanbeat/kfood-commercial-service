import Link from "next/link";

import { getPublishedFoods } from "@kfood/data";

import { requirePublicSession } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "My K-Food Journey"
};

const COLLECTION_GOAL = 50;

export default async function ProfilePage() {
  const [session, foods] = await Promise.all([
    requirePublicSession(),
    getPublishedFoods()
  ]);

  // 사용자별 도감 진행 데이터(어떤 음식을 먹었는지)는 아직 DB 미연동.
  // 연동 전까지 tried 목록은 비어 있음 → 전부 "Not yet"으로 표시.
  const triedSlugs = new Set<string>();
  const triedCount = triedSlugs.size;

  return (
    <div className="mypage-v2">
      <header className="mypage-header">
        <span className="food-v2-eyebrow">Personal progress</span>
        <h1>My K-Food Journey</h1>
        <p>
          See what you have tried, verified, and completed across your Korean
          food experiences.
        </p>
      </header>

      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">Dishes tried</span>
          <span className="admin-metric-value">
            {triedCount}/{COLLECTION_GOAL}
          </span>
          <span className="admin-metric-sub">First tasting goal</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Verified</span>
          <span className="admin-metric-value">0</span>
          <span className="admin-metric-sub">Visits and reviews confirmed</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Challenges</span>
          <span className="admin-metric-value">0</span>
          <span className="admin-metric-sub">Food missions completed</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Collection</span>
          <span className="admin-metric-value">
            {triedCount}/{foods.length}
          </span>
          <span className="admin-metric-sub">Published dishes logged</span>
        </div>
      </div>

      <section aria-labelledby="collection">
        <p className="food-section-title" id="collection">
          My K-Food collection
        </p>
        <div className="collection-grid">
          {foods.map((food, index) => {
            const tried = triedSlugs.has(food.slug);
            return (
              <Link
                className={tried ? "collection-item tried" : "collection-item"}
                href={`/foods/${food.slug}`}
                key={food.slug}
              >
                <span className="collection-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="collection-name">{food.nameEn}</span>
                <span className={tried ? "collection-state tried" : "collection-state"}>
                  {tried ? "TRIED" : "Not yet"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="food-info-card" aria-labelledby="account">
        <h3 id="account">Account</h3>
        <p>{session.email ?? "No public email from provider"}</p>
        <p>Signed in via {session.provider ?? "OAuth"}</p>
        <Link className="button secondary" href="/auth/logout" style={{ marginTop: 8 }}>
          Sign out
        </Link>
      </section>
    </div>
  );
}
