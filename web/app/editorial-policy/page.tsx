export const metadata = {
  title: "Editorial Policy"
};

export default function EditorialPolicyPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Editorial policy</p>
        <h1>How we decide what becomes public</h1>
        <p className="detail-intro">
          K-food Service is an editorial directory for travelers discovering
          Korean food. Alpha pages are curated, reviewed, and corrected by the
          service team rather than generated from public user posts.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Scope</span>
            <strong>We publish food, region, place, and route guidance</strong>
            <p>
              The alpha service focuses on capital-region K-food discovery:
              what to try, where it is commonly associated, and how a first-time
              visitor can approach it with less uncertainty.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Publication</span>
            <strong>Only reviewed published records are visible</strong>
            <p>
              Draft, hidden, and archived records are excluded from public
              routes, search surfaces, sitemap generation, and detail pages.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Verification</span>
            <strong>Places require freshness and correction signals</strong>
            <p>
              Place pages should show last verified dates, caution tags, map
              limitations, and a report path so closed places or stale details
              can be corrected quickly.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Ranking</span>
            <strong>Alpha ordering is editorial, not a popularity score</strong>
            <p>
              Display order reflects launch coverage, traveler usefulness, and
              review readiness. It should not be read as a definitive ranking of
              taste, quality, or restaurant performance.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
