import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminReports, updateAdminReportStatus } from "@kfood/data";
import type { AdminReportStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const reportStatuses: AdminReportStatus[] = [
  "pending",
  "in_review",
  "resolved",
  "ignored"
];

function redirectWithError(message: string): never {
  redirect(`/admin/operations?tab=reports&error=${encodeURIComponent(message)}`);
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

  revalidatePath("/admin/operations");
  redirect("/admin/operations?tab=reports&updated=1");
}

export async function ReportsPanel({
  accessToken,
  message
}: {
  accessToken: string;
  message?: { error?: string; updated?: string };
}) {
  const reports = await getAdminReports(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>신고 처리 큐</h2>
        <p>
          방문객이 공개 페이지의 &ldquo;신고하기&rdquo;로 접수한 오류·문제 제보입니다.
          콘텐츠 신뢰에 영향을 주는 항목부터 우선 처리합니다.
        </p>
      </div>
      {message?.updated ? (
        <p className="status-message success">신고 상태가 업데이트되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      {reports.length === 0 ? (
        <div className="admin-empty">처리할 신고가 없습니다. 새 공개 신고가 접수되면 여기에 표시됩니다.</div>
      ) : null}
      <div className="admin-form-list">
        {reports.map((report) => (
          <form action={updateReport} className="form-panel" key={report.id}>
            <input name="report_id" type="hidden" value={report.id} />
            <div className="admin-panel-head">
              <strong>{report.reportType}</strong>
              <p>
                <span className="admin-badge warning">{report.status}</span>{" "}
                {new Date(report.createdAt).toLocaleString("en")}
              </p>
            </div>
            <p>{report.message}</p>
            <p>
              <a className="inline-link" href={report.pageUrl}>
                {report.pageUrl}
              </a>
            </p>
            {report.userEmail ? <p>후속 연락: {report.userEmail}</p> : null}
            <label>
              상태
              <select defaultValue={report.status} name="status">
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              관리자 노트
              <textarea
                defaultValue={report.adminNote ?? ""}
                maxLength={2000}
                name="admin_note"
                placeholder="무엇을 확인하거나 변경했나요?"
              />
            </label>
            <button className="admin-btn primary" type="submit">
              신고 업데이트
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
