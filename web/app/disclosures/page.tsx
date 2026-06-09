export const metadata = {
  title: "Disclosures"
};

export default function DisclosuresPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Disclosures</p>
        <h1>Sponsored and affiliate disclosure standard</h1>
        <p className="detail-intro">
          Sponsored placements and affiliate links must be visibly labeled on
          public pages. The service should never hide commercial influence.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Sponsored</span>
            <strong>Paid placement requires a note</strong>
            <p>Sponsored content must include a sponsorship note.</p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Affiliate</span>
            <strong>Referral links are labeled</strong>
            <p>Affiliate URLs should be visible and auditable in admin records.</p>
          </div>
        </li>
      </ul>
    </main>
  );
}
