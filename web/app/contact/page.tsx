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
          Use this page to understand the right channel for corrections,
          partnership questions, and alpha feedback while the service is being
          prepared for launch.
        </p>
      </header>
      <section className="section-block">
        <ul className="content-list">
          <li>
            <div className="list-item-body">
              <span className="meta-label">Editorial</span>
              <strong>Use reports for stale or incorrect page details</strong>
              <p>
                Place closures, wrong map links, outdated menu notes, and
                disclosure concerns should go through the report form so they
                enter the review queue.
              </p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Business</span>
              <strong>Partnerships require disclosure before publication</strong>
              <p>
                Sponsored placements, affiliate links, media partnerships, and
                restaurant collaborations must be reviewed for labeling before
                appearing on public pages.
              </p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Alpha feedback</span>
              <strong>Product feedback is welcome, but not emergency support</strong>
              <p>
                K-food Service is not a restaurant booking desk, travel agency,
                allergy hotline, or real-time support channel during alpha.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
