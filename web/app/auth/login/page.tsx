import { redirect } from "next/navigation";

import {
  createPublicSupabaseAuthClient,
  getRequestOrigin,
  getSafeNextPath
} from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Sign in"
};

type AuthProvider = "google" | "kakao";

const providerLabels: Record<AuthProvider, string> = {
  google: "Continue with Google",
  kakao: "Continue with Kakao"
};

function redirectWithError(message: string, nextPath: string): never {
  redirect(
    `/auth/login?next=${encodeURIComponent(nextPath)}&error=${encodeURIComponent(message)}`
  );
}

async function signInWithProvider(formData: FormData) {
  "use server";

  const provider = String(formData.get("provider") ?? "") as AuthProvider;
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/mypage"));

  if (!["google", "kakao"].includes(provider)) {
    redirectWithError("Choose Google or Kakao to continue.", nextPath);
  }

  const supabase = await createPublicSupabaseAuthClient();

  if (!supabase) {
    redirectWithError("Supabase Auth is not configured.", nextPath);
  }

  const origin = await getRequestOrigin();
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: callbackUrl.toString()
    },
    provider
  });

  if (error || !data.url) {
    redirectWithError(
      "This sign-in provider is not ready yet. Check Supabase provider setup.",
      nextPath
    );
  }

  redirect(data.url);
}

export default async function PublicLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
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
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <section className="form-panel" aria-labelledby="social-login">
        <h2 id="social-login">Choose a sign-in method</h2>
        <p className="muted-copy">
          Google and Kakao use Supabase OAuth. If a provider is not enabled yet,
          the service will show a setup message instead of creating a broken
          account.
        </p>
        {(Object.keys(providerLabels) as AuthProvider[]).map((provider) => (
          <form action={signInWithProvider} key={provider}>
            <input name="next" type="hidden" value={nextPath} />
            <input name="provider" type="hidden" value={provider} />
            <button className="button secondary full-width" type="submit">
              {providerLabels[provider]}
            </button>
          </form>
        ))}
      </section>
    </main>
  );
}
