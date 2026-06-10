export const metadata = {
  title: "Content Policy"
};

export default function ContentPolicyPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Content policy</p>
        <h1>Content scope for the alpha service</h1>
        <p className="detail-intro">
          The alpha is an editorial K-food directory. Public user posts,
          reviews, uploads, ranking manipulation, and restaurant self-service
          listings are deferred until moderation and audit workflows exist.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Included</span>
            <strong>Curated discovery content</strong>
            <p>
              Alpha content may include regions, foods, place candidates, route
              guides, trust labels, caution notes, map links, and correction
              paths.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Deferred</span>
            <strong>User-generated content is not part of alpha</strong>
            <p>
              Public reviews, ratings, uploads, comments, restaurant owner
              dashboards, and paid self-service listings are not enabled yet.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Moderation</span>
            <strong>Higher-risk features need moderation first</strong>
            <p>
              Any future UGC, restaurant claims, ads, or booking flows require
              abuse controls, audit logs, and clearer user-facing rules before
              release.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
