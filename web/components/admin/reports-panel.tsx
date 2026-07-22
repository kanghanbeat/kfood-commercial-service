import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminReports, updateAdminReportStatus } from "@kfood/data";
import type { AdminReportStatus } from "@kfood/data";

import {
  AdminItem,
  AdminListToolbar,
  AdminPager,
  applyListParams,
  returnQuery,
  withReturnQuery,
  type ListParams
} from "@/components/admin/list-controls";
import { requireAdminSession } from "@/lib/admin-auth";

const reportStatuses: AdminReportStatus[] = [
  "pending",
  "in_review",
  "resolved",
  "ignored"
];

const reportStatusOptions = reportStatuses.map((status) => ({
  value: status,
  label: status
}));

function redirectWithError(formData: FormData, message: string): never {
  redirect(
    withReturnQuery(
      "/admin/operations?tab=reports",
      formData,
      `error=${encodeURIComponent(message)}`
    )
  );
}

async function updateReport(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const reportId = String(formData.get("report_id") ?? "");
  const status = String(formData.get("status") ?? "") as AdminReportStatus;
  const adminNote = String(formData.get("admin_note") ?? "");

  if (!reportStatuses.includes(status)) {
    redirectWithError(formData, "Unsupported report status.");
  }

  const result = await updateAdminReportStatus(session.accessToken, {
    actorId: session.userId,
    adminNote,
    reportId,
    status
  });

  if (!result.ok) {
    redirectWithError(formData, result.message);
  }

  revalidatePath("/admin/operations");
  redirect(withReturnQuery("/admin/operations?tab=reports", formData, "updated=1"));
}

export async function ReportsPanel({
  accessToken,
  message,
  params
}: {
  accessToken: string;
  message?: { error?: string; updated?: string };
  params?: ListParams;
}) {
  const reports = await getAdminReports(accessToken);
  const list = applyListParams(reports, params, {
    search: (report) => `${report.reportType} ${report.message} ${report.pageUrl}`,
    status: (report) => report.status
  });
  const ret = returnQuery(params);

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
      ) : (
        <AdminListToolbar
          basePath="/admin/operations"
          matched={list.matched}
          params={params}
          searchHint="신고 유형·내용·주소 검색"
          statuses={reportStatusOptions}
          tab="reports"
          total={list.total}
        />
      )}
      {reports.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 신고가 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}
      <div className="admin-form-list">
        {list.rows.map((report) => (
          <AdminItem
            key={report.id}
            meta={
              <>
                <span className="admin-badge warning">{report.status}</span>{" "}
                {new Date(report.createdAt).toLocaleString("en")}
              </>
            }
            title={report.reportType}
          >
          <form action={updateReport} className="form-panel">
            <input name="report_id" type="hidden" value={report.id} />
            <input name="return_query" type="hidden" value={ret} />
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
          </AdminItem>
        ))}
      </div>

      <AdminPager
        basePath="/admin/operations"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="reports"
      />
    </div>
  );
}
