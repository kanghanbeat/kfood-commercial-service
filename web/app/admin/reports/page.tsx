import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getAdminReports,
  updateAdminReportStatus
} from "@kfood/data";
import type { AdminReportStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Reports"
};

const reportStatuses: AdminReportStatus[] = [
  "pending",
  "in_review",
  "resolved",
  "ignored"
];

function redirectWithError(message: string): never {
  redirect(`/admin/reports?error=${encodeURIComponent(message)}`);
}

async function updateReport(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const reportId = String(formData.get("report_id") ?? "");
  const status = String(formData.get("status") ?? "") as AdminReportStatus;
  const adminNote = String(formData.get("admin_note") ?? "");

  if (!reportStatuses.includes(status)) {
    redirectWithError("Unsupported report status.");
  }

  const result = await updateAdminReportStatus(session.accessToken, {
    actorId: session.userId,
    adminNote,
    reportId,
    status
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/admin/reports");
  redirect("/admin/reports?updated=1");
}

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const reports = await getAdminReports(session.accessToken);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Reports</h1>
        <p className="detail-intro">
          Review public content reports, update status, and record audit logs.
        </p>
      </header>
      {params?.updated ? (
        <p className="status-message success">Report status updated.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <ul className="content-list">
        {reports.length === 0 ? (
          <li>
            <div className="list-item-body">
              <span className="meta-label">Queue empty</span>
              <strong>No reports to review</strong>
              <p>New public reports will appear here after submission.</p>
            </div>
          </li>
        ) : null}
        {reports.map((report) => (
          <li key={report.id}>
            <div className="list-item-body">
              <span className="meta-label">
                {report.status} · {new Date(report.createdAt).toLocaleString("en")}
              </span>
              <strong>{report.reportType}</strong>
              <p>{report.message}</p>
              <p>
                <a className="inline-link" href={report.pageUrl}>
                  {report.pageUrl}
                </a>
              </p>
              {report.userEmail ? <p>Follow-up: {report.userEmail}</p> : null}
              <form action={updateReport} className="form-panel">
                <input name="report_id" type="hidden" value={report.id} />
                <label>
                  Status
                  <select defaultValue={report.status} name="status">
                    {reportStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Admin note
                  <textarea
                    defaultValue={report.adminNote ?? ""}
                    maxLength={2000}
                    name="admin_note"
                    placeholder="What did you verify or change?"
                  />
                </label>
                <button className="button primary" type="submit">
                  Update report
                </button>
              </form>
            </div>
          </li>
        ))}
        <li>
          <div className="list-item-body">
            <span className="meta-label">Abuse control</span>
            <strong>Rate limit is enforced before insert</strong>
            <p>
              Public report submissions use a hashed reporter fingerprint and a
              10-minute window. The current default allows five accepted reports
              before the sixth is blocked.
            </p>
          </div>
        </li>
      </ul>
    </main>
  );
}
