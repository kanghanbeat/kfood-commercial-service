export const metadata = {
  title: "Report Content"
};

export default function ReportPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Report</p>
        <h1>Report stale or incorrect information</h1>
        <p className="detail-intro">
          Reports will connect to Supabase `content_reports` after Sprint 1
          database verification. For now, this page defines the public workflow.
        </p>
      </header>
      <section className="form-panel" aria-label="Content report form">
        <label>
          Page URL
          <input placeholder="https://kfood.example.com/places/..." />
        </label>
        <label>
          Issue type
          <select defaultValue="incorrect_info">
            <option value="incorrect_info">Incorrect information</option>
            <option value="closed_place">Closed place</option>
            <option value="map_issue">Map issue</option>
            <option value="sponsorship_disclosure">Disclosure issue</option>
          </select>
        </label>
        <label>
          Details
          <textarea placeholder="What should be corrected?" />
        </label>
        <button className="button primary" type="button">
          Submit after Supabase verification
        </button>
      </section>
    </main>
  );
}
