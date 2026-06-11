import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Audit Logs"
};

export default async function AdminAuditLogsPage() {
  await requireAdminSession();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Audit logs</h1>
        <p className="detail-intro">
          Admin mutations should write before/after snapshots into
          `admin_audit_logs`.
        </p>
      </header>
      <ul className="content-list">
        <li>
          <div className="list-item-body">
            <span className="meta-label">Required before beta</span>
            <strong>Track publish, hide, and correction actions</strong>
            <p>Audit logs protect trust, debugging, and rollback workflows.</p>
          </div>
        </li>
      </ul>
    </main>
  );
}
