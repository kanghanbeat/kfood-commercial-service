import Link from "next/link";

import {
  getMyFoodLog,
  getMyProfile,
  getPlatformSettings,
  getPublishedFoods,
  type SupportedLanguage
} from "@kfood/data";

import { ensurePublicProfile, requirePublicSession } from "@/lib/public-auth";

const COLLECTION_GOAL = 50;

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Mypage"
};

const languageOptions: Array<{ label: string; value: SupportedLanguage }> = [
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
  { label: "日本語", value: "ja" },
  { label: "中文", value: "zh" }
];

export default async function MypagePage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requirePublicSession(),
    searchParams
  ]);

  await ensurePublicProfile(session);
  const [profile, foods, triedSlugs, boardSettings] = await Promise.all([
    getMyProfile(session.accessToken, session.userId),
    getPublishedFoods(),
    getMyFoodLog(session.accessToken, session.userId),
    getPlatformSettings()
  ]);
  const communityEnabled = boardSettings.community ?? true;
  const foodLogEnabled = boardSettings.food_log ?? true;
  const journeyShareEnabled = boardSettings.journey_share ?? true;
  const displayName = profile?.displayName ?? session.name ?? "";
  const bio = profile?.bio ?? "";
  const preferredLanguage = profile?.preferredLanguage ?? "en";

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Mypage</p>
        <h1>Your K-food activity hub.</h1>
        {/* 내부 개발 단계 설명 대신 사용자 기준 안내로 */}
        <p className="detail-intro">
          Manage your profile, preferred language, and your K-food tasting
          journey in one place.
        </p>
      </header>
      {params?.updated ? (
        <p className="status-message success">Profile updated.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <section className="form-panel">
        <h2>Account details</h2>
        <dl className="definition-list">
          <div>
            <dt>Email</dt>
            <dd>{session.email ?? "No public email from provider"}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{session.provider ?? "OAuth"}</dd>
          </div>
          {/* User ID(내부 식별자 원문)는 사용자에게 의미가 없어 노출하지 않는다 —
              운영 조회는 Supabase 대시보드에서 */}
        </dl>
        <div className="action-row">
          {communityEnabled ? (
            <Link className="button secondary" href="/feed">
              Open feed
            </Link>
          ) : null}
          <form action="/auth/logout" method="post">
            <button className="button secondary" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </section>
      <section className="form-panel">
        <h2>Public profile basics</h2>
        <form action="/mypage/update" className="profile-form" method="post">
          <label>
            Display name
            <input
              defaultValue={displayName}
              maxLength={80}
              name="display_name"
              placeholder="K-food member"
            />
          </label>
          <label>
            Bio
            <textarea
              defaultValue={bio}
              maxLength={240}
              name="bio"
              placeholder="Short note for future records and comments."
            />
          </label>
          <label>
            Preferred language
            <select defaultValue={preferredLanguage} name="preferred_language">
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button primary" type="submit">
            Save profile
          </button>
        </form>
      </section>
      {foodLogEnabled ? (
      <section className="section-block" aria-labelledby="mypage-journey">
        <div className="section-heading">
          <p className="eyebrow">My K-Food Journey</p>
          <h2 id="mypage-journey">Your K-food collection</h2>
          <p>Track what you have tried across your Korean food trip.</p>
        </div>
        {journeyShareEnabled ? (
          <div className="action-row">
            <Link className="button secondary" href="/mypage/journey">
              View your journey recap
            </Link>
          </div>
        ) : null}
        <div className="admin-metric-grid">
          <div className="admin-metric-card">
            <span className="admin-metric-label">Dishes tried</span>
            <span className="admin-metric-value">
              {triedSlugs.size}/{COLLECTION_GOAL}
            </span>
            <span className="admin-metric-sub">First tasting goal</span>
          </div>
          {/* Verified·Challenges는 기능 미구현이라 항상 0으로 떠 소음 —
              기능이 실제로 붙을 때 카드와 함께 복원 */}
          <div className="admin-metric-card">
            <span className="admin-metric-label">Collection</span>
            <span className="admin-metric-value">
              {triedSlugs.size}/{foods.length}
            </span>
            <span className="admin-metric-sub">Published dishes</span>
          </div>
        </div>
        <div className="collection-grid">
          {foods.map((food, index) => {
            const tried = triedSlugs.has(food.slug);
            return (
              <div
                className={tried ? "collection-item tried" : "collection-item"}
                key={food.slug}
              >
                <span className="collection-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link className="collection-name" href={`/foods/${food.slug}`}>
                  {food.nameEn}
                </Link>
                <form action="/mypage/food-log" method="post">
                  <input name="food_slug" type="hidden" value={food.slug} />
                  <input name="tried" type="hidden" value={tried ? "0" : "1"} />
                  <button
                    className={
                      tried ? "collection-state-toggle tried" : "collection-state-toggle"
                    }
                    type="submit"
                  >
                    {tried ? "TRIED" : "Not yet"}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </section>
      ) : null}

      {/* 내부 로드맵 안내(UGC foundation) 섹션은 사용자에게 무의미해 제거 —
          기록·댓글 기능이 실제로 열릴 때 사용자 기준 안내로 다시 넣는다 */}
    </main>
  );
}
