export const metadata = {
  title: "Terms"
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Terms</p>
        <h1>Alpha terms of use</h1>
        <p className="detail-intro">
          K-food Service is an informational alpha directory. Use it as a
          planning aid, then confirm time-sensitive details with official
          sources, restaurants, and linked map services before visiting.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Information</span>
            <strong>Content is guidance, not a guarantee</strong>
            <p>
              Food descriptions, place notes, route ideas, prices, hours,
              menus, and transit assumptions can change and may be incomplete
              during alpha.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Safety</span>
            <strong>Use your own judgment when traveling or eating</strong>
            <p>
              Check allergies, dietary restrictions, restaurant policies,
              neighborhood conditions, and local travel guidance before making a
              decision.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Accounts</span>
            <strong>Member accounts are a lightweight alpha feature</strong>
            <p>
              Social sign-in may be used to identify a member for future saved
              places, report history, or personalization. Community posting,
              ratings, and reviews are not part of the current alpha.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Corrections</span>
            <strong>We may update, hide, or remove content</strong>
            <p>
              Reports, verification checks, sponsorship changes, or stale
              information may cause public pages to be revised without prior
              notice.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Future launch</span>
            <strong>Production terms will expand before monetized features</strong>
            <p>
              Accounts, bookings, payments, advertising, affiliate programs, and
              mobile app features require fuller terms before release.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
