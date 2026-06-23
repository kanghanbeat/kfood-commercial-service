import Link from "next/link";

import { requirePublicSession } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await requirePublicSession();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Profile</p>
        <h1>Your K-food account</h1>
        <p className="detail-intro">
          This is a lightweight account foundation. Saved places, report
          history, and personalized planning can build on this later.
        </p>
      </header>
      <section className="form-panel">
        <h2>Account details</h2>
        <dl className="definition-list">
          <div>
            <dt>Email</dt>
            <dd>{session.email ?? "No public email from provider"}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{session.provider ?? "OAuth"}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{session.userId}</dd>
          </div>
        </dl>
        <Link className="button secondary" href="/auth/logout">
          Sign out
        </Link>
      </section>
    </main>
  );
}
