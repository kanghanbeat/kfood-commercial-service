import Link from "next/link";

import { getSafeNextPath } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Sign in"
};

export default async function PublicLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params?.next ?? "/mypage");

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Member sign in</p>
        <h1>Sign in to keep your K-food plans connected.</h1>
        <p className="detail-intro">
          Public browsing stays open without an account. Sign in adds a safe
          foundation for future saved places, report history, and personalized
          planning.
        </p>
      </header>
      {params?.notice ? (
        <p className="status-message success">{params.notice}</p>
      ) : null}
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <section className="form-panel" aria-labelledby="email-login">
        <h2 id="email-login">Sign in with email</h2>
        <p className="muted-copy">
          Email login keeps alpha testing free while Google and Kakao provider
          setup remains closed.
        </p>
        <form action="/auth/login/email" className="profile-form" method="post">
          <input name="next" type="hidden" value={nextPath} />
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
              autoComplete="current-password"
              name="password"
              placeholder="Your password"
              required
              type="password"
            />
          </label>
          <button className="button primary" type="submit">
            Log in
          </button>
        </form>
        <div className="action-row">
          <Link
            className="button secondary"
            href={`/auth/join?next=${encodeURIComponent(nextPath)}`}
          >
            Create account
          </Link>
        </div>
      </section>
      <section className="form-panel" aria-labelledby="social-login">
        <h2 id="social-login">Social login</h2>
        <p className="muted-copy">
          Continue with your Google or Kakao account. Your email stays with the
          provider; we only receive your basic profile.
        </p>
        <div className="action-row">
          <a
            className="button secondary"
            href={`/auth/oauth?provider=google&next=${encodeURIComponent(nextPath)}`}
          >
            Continue with Google
          </a>
          <a
            className="button secondary"
            href={`/auth/oauth?provider=kakao&next=${encodeURIComponent(nextPath)}`}
          >
            Continue with Kakao
          </a>
        </div>
      </section>
    </main>
  );
}
