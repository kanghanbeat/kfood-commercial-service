export const metadata = {
  title: "Admin Login"
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; next?: string; notice?: string }>;
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
      {params?.notice ? (
        <p className="status-message success">{params.notice}</p>
      ) : null}
      {params?.error ? <p className="status-message error">{params.error}</p> : null}
      <form action="/admin/login/email" className="form-panel" method="post">
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
