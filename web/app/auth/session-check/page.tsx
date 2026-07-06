import Link from "next/link";

import { getPublicSessionDiagnostic } from "@/lib/public-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Session Check"
};

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

export default async function SessionCheckPage() {
  const diagnostic = await getPublicSessionDiagnostic();
  const rows = [
    {
      label: "Supabase public config present",
      value: yesNo(diagnostic.configurationPresent)
    },
    {
      label: "Signed-in hint cookie present",
      value: yesNo(diagnostic.signedInHintCookiePresent)
    },
    {
      label: "Access token cookie present",
      value: yesNo(diagnostic.accessTokenCookiePresent)
    },
    {
      label: "Refresh token cookie present",
      value: yesNo(diagnostic.refreshTokenCookiePresent)
    },
    {
      label: "Server session valid",
      value: yesNo(diagnostic.serverSessionValid)
    },
    {
      label: "Masked email",
      value: diagnostic.maskedEmail ?? "Not available"
    },
    {
      label: "Provider",
      value: diagnostic.provider ?? "Not available"
    },
    {
      label: "User ID suffix",
      value: diagnostic.userIdSuffix ?? "Not available"
    },
    {
      label: "Request host",
      value: diagnostic.host ?? "Not available"
    }
  ];

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Auth diagnostic</p>
        <h1>Session check.</h1>
        <p className="detail-intro">
          This temporary page checks whether the browser is sending public auth
          cookies and whether the server can validate the session. It never
          prints token values.
        </p>
      </header>
      <section className="form-panel" aria-labelledby="session-status">
        <h2 id="session-status">Current request status</h2>
        <dl className="definition-list">
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="action-row">
          <Link className="button primary" href="/mypage">
            Open mypage
          </Link>
          <Link className="button secondary" href="/feed">
            Open feed
          </Link>
          <Link className="button secondary" href="/auth/login?next=/mypage">
            Log in
          </Link>
        </div>
      </section>
      <section className="section-block" aria-labelledby="how-to-use">
        <div className="section-heading">
          <p className="eyebrow">How to read it</p>
          <h2 id="how-to-use">Use this page between each auth step</h2>
          <p>
            If cookies are present but the server session is invalid, the issue
            is token validation. If cookies disappear after saving or moving
            pages, the issue is cookie clearing or propagation.
          </p>
        </div>
      </section>
    </main>
  );
}
