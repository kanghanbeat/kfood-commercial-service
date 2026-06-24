import { getAdminAuditLogs } from "@kfood/data";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Audit Logs"
};

export default async function AdminAuditLogsPage() {
  const session = await requireAdminSession();
  const logs = await getAdminAuditLogs(session.accessToken);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Audit logs</h1>
        <p className="detail-intro">
          Track admin report and place mutations for trust, debugging, and
          rollback planning.
        </p>
      </header>
      <AdminNav />
      <ul className="content-list">
        {logs.length === 0 ? (
          <li>
            <div className="list-item-body">
              <span className="meta-label">No audit logs</span>
              <strong>Admin changes will appear here</strong>
              <p>Save a report or place update to create the first entry.</p>
            </div>
          </li>
        ) : null}
        {logs.map((log) => (
          <li key={log.id}>
            <div className="list-item-body">
              <span className="meta-label">
                {new Date(log.createdAt).toLocaleString("en")}
              </span>
              <strong>{log.action}</strong>
              <p>
                {log.entityType} {log.entityId ?? "unknown entity"}
              </p>
              <p>Actor: {log.actorId ?? "unknown actor"}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
