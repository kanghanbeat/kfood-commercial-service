import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedUserPosts, isCommunityEnabled } from "@kfood/data";

import { getPublicSession } from "@/lib/public-auth";

export const metadata = {
  title: "Feed"
};

export default async function FeedPage() {
  if (!(await isCommunityEnabled())) {
    notFound();
  }

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
      {/* 동작하지 않는 언어 선택·검색창·필터 탭은 신뢰를 깎아 제거 —
          검색·필터가 실제 구현될 때 기능과 함께 되살린다 */}
      <section className="action-row" aria-label="Feed actions">
        <Link className="button primary" href={writeHref}>
          Write record
        </Link>
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
