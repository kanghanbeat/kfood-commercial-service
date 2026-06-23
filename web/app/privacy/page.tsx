export const metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Privacy</p>
        <h1>Alpha privacy notice</h1>
        <p className="detail-intro">
          This notice describes the limited information K-food Service expects
          to handle during alpha. It should be reviewed again before broad
          public launch, analytics expansion, accounts, payments, or mobile app
          release.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Reports</span>
            <strong>Correction reports may include your optional email</strong>
            <p>
              The report form asks for a page URL, issue type, details, and an
              optional email address for follow-up. Do not include sensitive
              personal information in report details.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Accounts</span>
            <strong>Social sign-in creates a lightweight service profile</strong>
            <p>
              Google or Kakao sign-in may provide account identifiers, email,
              display name, and provider metadata. During alpha, this is used
              only to support basic profile access and future member features.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Operations</span>
            <strong>Admin access is limited to service maintenance</strong>
            <p>
              Reports and editorial records are intended for review, correction,
              abuse prevention, and audit history. They are not public user
              profiles.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Third parties</span>
            <strong>Linked services follow their own privacy practices</strong>
            <p>
              Map services, hosting providers, database providers, and future
              analytics tools may process data under their own policies.
            </p>
          </div>
        </li>
        <li>
          <div className="list-item-body">
            <span className="meta-label">Launch note</span>
            <strong>A fuller notice is required before production growth</strong>
            <p>
              Before a wider launch, this page should name production analytics,
              retention rules, contact channels, and user rights in the target
              markets.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
