import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Login"
};

const adminSessionCookie = "kfood_admin_session";
const sessionDurationMs = 8 * 60 * 60 * 1000;

function safeEquals(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

async function signIn(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedPassword || !sessionSecret) {
    redirect("/admin/login?error=Admin access is not configured.");
  }

  if (!safeEquals(password, expectedPassword)) {
    redirect("/admin/login?error=Invalid admin password.");
  }

  const expiresAt = String(Date.now() + sessionDurationMs);
  const token = `${expiresAt}.${sign(expiresAt, sessionSecret)}`;
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookie, token, {
    httpOnly: true,
    maxAge: sessionDurationMs / 1000,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

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
          This alpha admin gate protects operational review screens while
          Supabase role-based editing is prepared.
        </p>
      </header>
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <form action={signIn} className="form-panel">
        <input name="next" type="hidden" value={params?.next ?? "/admin"} />
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
