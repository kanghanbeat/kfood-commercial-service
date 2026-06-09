export const metadata = {
  title: "Admin Reports"
};

export default function AdminReportsPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Reports</h1>
        <p className="detail-intro">
          After Supabase verification, this page reads `content_reports` for
          pending, in-review, resolved, and ignored states.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Pending workflow</span>
            <strong>Resolve stale content reports</strong>
            <p>Open report, check source, update content, then mark resolved.</p>
          </div>
        </li>
      </ul>
    </main>
  );
}
