import Link from "next/link";

export const metadata = {
  title: "Feed"
};

const feedControls = [
  "Language: English",
  "Search records",
  "Write record"
];

export default function FeedPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Community feed</p>
        <h1>K-food records from real visits.</h1>
        <p className="detail-intro">
          Feed will show user-uploaded food moments connected to verified foods,
          areas, and places. Posting, likes, and follows stay behind login and
          moderation controls.
        </p>
      </header>
      <section className="utility-bar" aria-label="Feed controls">
        {feedControls.map((control) => (
          <span key={control}>{control}</span>
        ))}
        <Link className="button primary" href="/auth/login?next=/feed">
          Write record
        </Link>
      </section>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Coming next</span>
            <strong>Verified-data-linked user posts</strong>
            <p>
              Records will ask users to connect photos to a food, area, or
              place so the feed strengthens the K-food discovery service instead
              of becoming a generic social feed.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Guest mode</span>
            <strong>Browse first, log in when you want to interact</strong>
            <p>
              Guests can browse public records. Creating records, liking, and
              following will require a public account.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
