export const metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin login</p>
        <h1>Sign in to manage content</h1>
        <p className="detail-intro">
          Supabase Auth integration is pending. Public users must never access
          admin mutation routes.
        </p>
      </header>
      <section className="form-panel">
        <label>
          Email
          <input placeholder="admin@example.com" type="email" />
        </label>
        <label>
          Password
          <input placeholder="Password" type="password" />
        </label>
        <button className="button primary" type="button">
          Enable after Supabase Auth
        </button>
      </section>
    </main>
  );
}
