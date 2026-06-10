export const metadata = {
  title: "Maps Notice"
};

export default function MapsNoticePage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Maps notice</p>
        <h1>Map links are guidance, not guarantees</h1>
        <p className="detail-intro">
          K-food Service may link to third-party map services to help travelers
          find places, but hours, addresses, menus, and closures can change
          faster than our directory.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Before visiting</span>
            <strong>Confirm the latest details in the linked map app</strong>
            <p>
              Check opening hours, temporary closures, reservation requirements,
              and current address information before making a trip.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Corrections</span>
            <strong>Reports help us update stale map guidance</strong>
            <p>
              If a link points to the wrong location or a place appears closed,
              use the report form so the item can be reviewed and corrected.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Limitations</span>
            <strong>Third-party maps have their own data and terms</strong>
            <p>
              We do not control third-party map rankings, reviews, route
              suggestions, account requirements, or availability in every
              country.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
