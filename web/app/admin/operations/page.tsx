import { getAdminAuditLogs } from "@kfood/data";

import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { CommentsPanel } from "@/components/admin/comments-panel";
import { PostsPanel } from "@/components/admin/posts-panel";
import { ReportsPanel } from "@/components/admin/reports-panel";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Operations"
};

const operationTabs = [
  { key: "reports", label: "신고 관리" },
  { key: "audit", label: "감사 로그" },
  { key: "members", label: "회원 관리" },
  { key: "posts", label: "게시물 관리" },
  { key: "comments", label: "댓글 관리" }
];

// 상단 요약 카드: 운영 현황. 신고/감사 외 일부는 placeholder.
const operationMetrics = [
  { label: "처리 대기 신고", value: "18", sub: "긴급 3건 포함" },
  { label: "24시간 처리율", value: "91%", sub: "목표 90% 이상" },
  { label: "활성 관리자", value: "7", sub: "admin 2 · editor 5" },
  { label: "최근 감사 로그", value: "126", sub: "오늘 기록 기준" }
];

export default async function AdminOperationsPage({
  searchParams
}: {
  searchParams?: Promise<{
    tab?: string;
    error?: string;
    updated?: string;
    created?: string;
  }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "reports";

  return (
    <AdminShell active="operations" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">운영</span>
          <h1>운영</h1>
          <p>
            신고 처리 큐를 우선으로 두고, 감사 로그와 활성 계정을 함께 확인합니다.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-btn" type="button">
            로그 내보내기
          </button>
          <button className="admin-btn primary" type="button">
            관리자 추가
          </button>
        </div>
      </div>

      <div className="admin-metric-grid">
        {operationMetrics.map((metric) => (
          <div className="admin-metric-card" key={metric.label}>
            <span className="admin-metric-label">{metric.label}</span>
            <span className="admin-metric-value">{metric.value}</span>
            <span className="admin-metric-sub">{metric.sub}</span>
          </div>
        ))}
      </div>

      <AdminTabs basePath="/admin/operations" current={tab} tabs={operationTabs} />

      {tab === "reports" ? (
        <ReportsPanel
          accessToken={session.accessToken}
          message={{ error: params?.error, updated: params?.updated }}
        />
      ) : null}
      {tab === "audit" ? <AuditPanel accessToken={session.accessToken} /> : null}
      {tab === "members" ? (
        <div className="admin-panel">
          <div className="admin-empty">
            회원 관리는 데이터 연결 단계에서 채워집니다. (profiles 테이블 기반 활성
            계정·권한 관리 예정)
          </div>
        </div>
      ) : null}
      {tab === "posts" ? (
        <PostsPanel
          accessToken={session.accessToken}
          message={{
            created: params?.created,
            error: params?.error,
            updated: params?.updated
          }}
        />
      ) : null}
      {tab === "comments" ? (
        <CommentsPanel
          accessToken={session.accessToken}
          message={{ error: params?.error, updated: params?.updated }}
        />
      ) : null}
    </AdminShell>
  );
}

async function AuditPanel({ accessToken }: { accessToken: string }) {
  const logs = await getAdminAuditLogs(accessToken);
  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>최근 감사 로그</h2>
        <p>관리자 신고·장소 변경 이력을 신뢰·디버깅·롤백 기준으로 추적합니다.</p>
      </div>
      {logs.length === 0 ? (
        <div className="admin-empty">
          아직 감사 로그가 없습니다. 신고나 장소를 저장하면 첫 기록이 생성됩니다.
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>시각</th>
              <th>액션</th>
              <th>대상</th>
              <th>처리자</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString("en")}</td>
                <td>{log.action}</td>
                <td>
                  {log.entityType} {log.entityId ?? "unknown"}
                </td>
                <td>{log.actorId ?? "unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
