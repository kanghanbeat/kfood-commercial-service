import { redirect } from "next/navigation";

import {
  createSupabaseAuthClient,
  createSupabaseUserClient,
  setAdminAuthCookies
} from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login"
};

function redirectWithError(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

async function signIn(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");
  const supabase = createSupabaseAuthClient();

  if (!supabase) {
    redirectWithError("Supabase Auth is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session || !data.user) {
    redirectWithError("Invalid admin credentials.");
  }

  const userClient = createSupabaseUserClient(data.session.access_token);

  if (!userClient) {
    redirectWithError("Supabase Auth is not configured.");
  }

  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle<{ role: "user" | "editor" | "admin"; is_active: boolean }>();

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !["admin", "editor"].includes(profile.role)
  ) {
    redirectWithError("This account is not allowed to access admin.");
  }

  await setAdminAuthCookies(
    data.session.access_token,
    data.session.refresh_token
  );

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin login</p>
        <h1>Sign in to manage content</h1>
        <p className="detail-intro">
          Sign in with a Supabase account whose profile role is admin or editor.
        </p>
      </header>
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <form action={signIn} className="form-panel">
        <input name="next" type="hidden" value={params?.next ?? "/admin"} />
        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            placeholder="admin@example.com"
            required
            type="email"
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            placeholder="Admin password"
            required
            type="password"
          />
        </label>
        <button className="button primary" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
