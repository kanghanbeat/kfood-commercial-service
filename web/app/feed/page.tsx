import Link from "next/link";

export const metadata = {
  title: "Feed"
};

const feedTabs = ["All", "Following", "Popular"];

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
      <section className="utility-bar feed-utility" aria-label="Feed controls">
        <label>
          Language
          <select defaultValue="en" aria-label="Feed language">
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </label>
        <div className="search-preview-input" aria-label="Feed search preview">
          Search records by food, area, or user
        </div>
        <Link className="button primary" href="/auth/login?next=/feed">
          Write record
        </Link>
      </section>
      <section className="tab-row" aria-label="Feed filters">
        {feedTabs.map((tab) => (
          <span className={tab === "All" ? "active-tab" : ""} key={tab}>
            {tab}
          </span>
        ))}
      </section>
      <section className="feed-preview-card" aria-labelledby="feed-preview-title">
        <div className="feed-preview-media">
          <span>Future photo upload</span>
        </div>
        <div className="feed-preview-body">
          <div className="label-row">
            <span className="label-pill verified">Verified food</span>
            <span className="label-pill">Area guide</span>
            <span className="label-pill preview">Preview</span>
          </div>
          <p className="meta-label">Example record structure</p>
          <h2 id="feed-preview-title">A user record linked to trusted K-food data</h2>
          <p>
            “Tried kalguksu near Myeongdong after checking the route guide.
            Easy lunch stop, but confirm the exact shop hours before going.”
          </p>
          <dl className="compact-definition-list">
            <div>
              <dt>Food</dt>
              <dd>Myeongdong Kalguksu</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>Myeongdong</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>Public after moderation</dd>
            </div>
          </dl>
          <div className="feed-action-row" aria-label="Future feed actions">
            <span>Like requires login</span>
            <span>Follow requires login</span>
            <Link href="/report">Report issue</Link>
          </div>
        </div>
      </section>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Guest mode</span>
            <strong>Browse first, log in when you want to interact</strong>
            <p>
              Guests can preview public records. Creating records, liking, and
              following will require a public account.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
