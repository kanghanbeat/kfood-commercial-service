import Link from "next/link";

export const metadata = {
  title: "Admin"
};

const adminModules = [
  {
    href: "/admin/regions",
    title: "Regions",
    detail: "Create, edit, publish, hide, and order region pages."
  },
  {
    href: "/admin/foods",
    title: "Foods",
    detail: "Maintain dish descriptions, spice levels, and beginner notes."
  },
  {
    href: "/admin/places",
    title: "Places",
    detail: "Update map links, verification dates, trust labels, and disclosures."
  },
  {
    href: "/admin/routes",
    title: "Routes",
    detail: "Manage route summaries, duration, steps, and linked places."
  },
  {
    href: "/admin/reports",
    title: "Reports",
    detail: "Review stale-content reports and mark resolution status."
  },
  {
    href: "/admin/audit-logs",
    title: "Audit Logs",
    detail: "Track admin content mutations for operational safety."
  }
];

export default function AdminPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin MVP</p>
        <h1>Content operations dashboard</h1>
        <p className="detail-intro">
          This alpha admin surface is protected by a server-side session cookie.
          Supabase Auth, RLS-backed writes, and audit log insertion come next.
        </p>
        <div className="action-row">
          <Link className="button secondary" href="/admin/logout">
            Sign out
          </Link>
        </div>
      </header>
      <ul className="directory-grid">
        {adminModules.map((module) => (
          <li className="directory-card" key={module.href}>
            <Link href={module.href}>
              <span>Admin module</span>
              <strong>{module.title}</strong>
              <p>{module.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
