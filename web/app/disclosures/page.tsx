export const metadata = {
  title: "Disclosures"
};

export default function DisclosuresPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Disclosures</p>
        <h1>Commercial influence must be visible</h1>
        <p className="detail-intro">
          Alpha content is currently editorial. If sponsored placements,
          affiliate links, or paid partnerships are introduced, they must be
          labeled where users make decisions.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Sponsored</span>
            <strong>Paid placement requires clear labeling</strong>
            <p>
              A sponsored place, route, or feature must include a visible
              sponsorship note on the public page and an auditable record in the
              admin workflow.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Affiliate</span>
            <strong>Referral links must not be hidden</strong>
            <p>
              If a booking, map, delivery, or commerce link may generate
              compensation, the page should identify that relationship near the
              link or recommendation.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Editorial independence</span>
            <strong>Commercial content cannot override safety notes</strong>
            <p>
              Sponsorship must not remove caution tags, stale information
              warnings, correction links, or map accuracy notices.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
