import Link from "next/link";

import { getSafeNextPath } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Join"
};

export default async function JoinPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params?.next ?? "/mypage");

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Join</p>
        <h1>Create your K-food account.</h1>
        {/* 아직 열리지 않은 기능(기록·댓글) 언급 대신 지금 가능한 것 기준으로 */}
        <p className="detail-intro">
          Create a free account to set up your profile and track your K-food
          tasting journey. Social login can be connected later.
        </p>
      </header>
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <section className="form-panel" aria-labelledby="email-join">
        <h2 id="email-join">Join with email</h2>
        <form action="/auth/join/email" className="profile-form" method="post">
          <input name="next" type="hidden" value={nextPath} />
          <label>
            Display name
            <input
              autoComplete="nickname"
              maxLength={80}
              name="display_name"
              placeholder="K-food member"
            />
          </label>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>
          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              placeholder="At least 8 characters"
              required
              type="password"
            />
          </label>
          <button className="button primary" type="submit">
            Create account
          </button>
        </form>
        <div className="action-row">
          <Link className="button secondary" href={`/auth/login?next=${encodeURIComponent(nextPath)}`}>
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}
