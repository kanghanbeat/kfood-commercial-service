import Link from "next/link";

import {
  getMyProfile,
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
  const [profile, foods] = await Promise.all([
    getMyProfile(session.accessToken, session.userId),
    getPublishedFoods()
  ]);
  const displayName = profile?.displayName ?? session.name ?? "";
  const bio = profile?.bio ?? "";
  const preferredLanguage = profile?.preferredLanguage ?? "en";

  // 사용자별 도감 진행 데이터(먹은 음식)는 아직 DB 미연동 → 전부 "Not yet".
  const triedSlugs = new Set<string>();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Mypage</p>
        <h1>Your K-food activity hub.</h1>
        <p className="detail-intro">
          Mypage will manage your profile, records, likes, follows, and language
          settings. The first version keeps account identity visible while the
          community data model is prepared.
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
          <div>
            <dt>User ID</dt>
            <dd>{session.userId}</dd>
          </div>
        </dl>
        <div className="action-row">
          <Link className="button secondary" href="/feed">
            Open feed
          </Link>
          <Link className="button secondary" href="/auth/logout">
            Sign out
          </Link>
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
      <section className="section-block" aria-labelledby="mypage-journey">
        <div className="section-heading">
          <p className="eyebrow">My K-Food Journey</p>
          <h2 id="mypage-journey">Your K-food collection</h2>
          <p>
            Track what you have tried across your Korean food trip. Personal
            records connect once the collection data model is live.
          </p>
        </div>
        <div className="admin-metric-grid">
          <div className="admin-metric-card">
            <span className="admin-metric-label">Dishes tried</span>
            <span className="admin-metric-value">
              {triedSlugs.size}/{COLLECTION_GOAL}
            </span>
            <span className="admin-metric-sub">First tasting goal</span>
          </div>
          <div className="admin-metric-card">
            <span className="admin-metric-label">Verified</span>
            <span className="admin-metric-value">0</span>
            <span className="admin-metric-sub">Visits confirmed</span>
          </div>
          <div className="admin-metric-card">
            <span className="admin-metric-label">Challenges</span>
            <span className="admin-metric-value">0</span>
            <span className="admin-metric-sub">Missions completed</span>
          </div>
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

      <section className="section-block" aria-labelledby="mypage-next">
        <div className="section-heading">
          <p className="eyebrow">UGC foundation</p>
          <h2 id="mypage-next">Records and comments are being prepared</h2>
          <p>
            Profile fields now support future records and comments. The next
            implementation slice will connect Feed to published user posts, then
            add post detail and comment forms.
          </p>
        </div>
      </section>
    </main>
  );
}
