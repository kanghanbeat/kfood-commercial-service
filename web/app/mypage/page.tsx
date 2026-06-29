import Link from "next/link";

import { requirePublicSession } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Mypage"
};

export default async function MypagePage() {
  const session = await requirePublicSession();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Mypage</p>
        <h1>Your K-food activity hub.</h1>
        <p className="detail-intro">
          Mypage will manage your profile, records, likes, follows, and language
          settings. The first version keeps account identity visible while the
          community data model is prepared.
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
        <div className="action-row">
          <Link className="button secondary" href="/feed">
            Open feed
          </Link>
          <Link className="button secondary" href="/auth/logout">
            Sign out
          </Link>
        </div>
      </section>
      <section className="section-block" aria-labelledby="mypage-next">
        <div className="section-heading">
          <p className="eyebrow">Next account features</p>
          <h2 id="mypage-next">Records, likes, follows, and language settings</h2>
          <p>
            These sections will become active after user posts, likes, follows,
            and preferred language fields are added to Supabase.
          </p>
        </div>
      </section>
    </main>
  );
}
