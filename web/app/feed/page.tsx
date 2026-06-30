import Link from "next/link";

import { getPublishedUserPosts } from "@kfood/data";

import { getPublicSession } from "@/lib/public-auth";

export const metadata = {
  title: "Feed"
};

const feedTabs = ["All", "Following", "Popular"];

export default async function FeedPage() {
  const [posts, session] = await Promise.all([
    getPublishedUserPosts(),
    getPublicSession()
  ]);
  const writeHref = session ? "/feed/new" : "/auth/login?next=/feed/new";

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Community feed</p>
        <h1>K-food records from real visits.</h1>
        <p className="detail-intro">
          Feed will show user-uploaded food moments connected to verified foods,
          areas, and places. Posting, likes, and follows stay behind login and
          moderation controls.
        </p>
      </header>
      <section className="utility-bar feed-utility" aria-label="Feed controls">
        <label>
          Language
          <select defaultValue="en" aria-label="Feed language">
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </label>
        <div className="search-preview-input" aria-label="Feed search preview">
          Search records by food, area, or user
        </div>
        <Link className="button primary" href={writeHref}>
          Write record
        </Link>
      </section>
      <section className="tab-row" aria-label="Feed filters">
        {feedTabs.map((tab) => (
          <span className={tab === "All" ? "active-tab" : ""} key={tab}>
            {tab}
          </span>
        ))}
      </section>
      <ul className="content-list">
        {posts.length === 0 ? (
          <li>
            <div className="list-item-body">
              <span className="meta-label">No public records yet</span>
              <strong>Be the first K-food record after moderation opens</strong>
              <p>
                Published user records will appear here after admin review. The
                trusted guide remains available through Search and Recommend.
              </p>
              <div className="action-row">
                <Link className="button primary" href={writeHref}>
                  Write record
                </Link>
                <Link className="button secondary" href="/search">
                  Search guide
                </Link>
              </div>
            </div>
          </li>
        ) : null}
        {posts.map((post) => (
          <li key={post.id}>
            <Link className="list-item-body" href={`/feed/${post.id}`}>
              <span className="meta-label">
                User record · {post.authorDisplayName ?? "K-food member"} ·{" "}
                {new Date(post.createdAt).toLocaleDateString("en")}
              </span>
              <strong>{post.body.slice(0, 90)}{post.body.length > 90 ? "..." : ""}</strong>
              <p>
                {post.commentCount} comments · {post.language.toUpperCase()} ·{" "}
                linked to trusted data where available
              </p>
              <div className="label-row">
                <span className="label-pill preview">User record</span>
                {post.foodId ? <span className="label-pill verified">Food linked</span> : null}
                {post.regionId ? <span className="label-pill">Area linked</span> : null}
                {post.placeId ? <span className="label-pill">Place linked</span> : null}
              </div>
            </Link>
          </li>
        ))}
        <li>
          <div className="list-item-body">
            <span className="meta-label">Guest mode</span>
            <strong>Browse first, log in when you want to interact</strong>
            <p>
              Guests can preview public records. Creating records, liking, and
              following will require a public account.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
