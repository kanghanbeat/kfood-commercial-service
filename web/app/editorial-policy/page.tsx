export const metadata = {
  title: "Editorial Policy"
};

export default function EditorialPolicyPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Editorial policy</p>
        <h1>How K-food Service curates recommendations</h1>
        <p className="detail-intro">
          Public pages are editorial directory content, not open social posts.
          Each published item should have a source note, review status, and
          correction path before launch.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Publication</span>
            <strong>Only published content is public</strong>
            <p>Draft, hidden, and archived records stay out of routes and search.</p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Verification</span>
            <strong>Places need freshness signals</strong>
            <p>Last verified dates and caution notes are part of the product.</p>
          </div>
        </li>
      </ul>
    </main>
  );
}
