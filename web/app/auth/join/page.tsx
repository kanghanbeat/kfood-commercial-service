import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createPublicSupabaseAuthClient,
  ensurePublicProfile,
  getSafeNextPath,
  setPublicAuthCookies
} from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Join"
};

function redirectWithError(message: string, nextPath: string): never {
  redirect(
    `/auth/join?next=${encodeURIComponent(nextPath)}&error=${encodeURIComponent(message)}`
  );
}

async function signUpWithEmail(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/mypage"));

  if (!email || !password) {
    redirectWithError("Enter your email and password.", nextPath);
  }

  if (password.length < 8) {
    redirectWithError("Password must be at least 8 characters.", nextPath);
  }

  if (displayName.length > 80) {
    redirectWithError("Display name must be 80 characters or fewer.", nextPath);
  }

  const supabase = await createPublicSupabaseAuthClient();

  if (!supabase) {
    redirectWithError("Supabase Auth is not configured.", nextPath);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    options: {
      data: {
        display_name: displayName || null,
        name: displayName || null
      }
    },
    password
  });

  if (error || !data.user) {
    redirectWithError(
      "Could not create the account. The email may already be registered.",
      nextPath
    );
  }

  if (!data.session) {
    redirect(
      `/auth/login?next=${encodeURIComponent(nextPath)}&notice=${encodeURIComponent(
        "Account created. Check your email before signing in."
      )}`
    );
  }

  await setPublicAuthCookies(
    data.session.access_token,
    data.session.refresh_token
  );

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name: displayName || (data.user.email ?? null),
    provider:
      typeof data.user.app_metadata.provider === "string"
        ? data.user.app_metadata.provider
        : "email",
    user: data.user,
    userId: data.user.id
  });

  redirect(nextPath);
}

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
        <p className="detail-intro">
          Start with a free email account for profile settings, records, and
          comments. Social login can be connected later.
        </p>
      </header>
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <section className="form-panel" aria-labelledby="email-join">
        <h2 id="email-join">Join with email</h2>
        <form action={signUpWithEmail} className="profile-form">
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
