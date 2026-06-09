export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Contact</p>
        <h1>Contact K-food Service</h1>
        <p className="detail-intro">
          Use this page for editorial corrections, partnership questions, and
          alpha feedback while the service is being prepared for launch.
        </p>
      </header>
      <section className="section-block">
        <ul className="content-list">
          <li>
            <div className="list-item-body">
              <span className="meta-label">Editorial</span>
              <strong>Corrections and source updates</strong>
              <p>Send place closures, map link issues, or outdated menu notes.</p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Business</span>
              <strong>Partnerships and sponsorships</strong>
              <p>
                Sponsored or affiliate content must be disclosed before launch.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
