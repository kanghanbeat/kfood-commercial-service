import Link from "next/link";

import { getAdminContentPlans, getAdminProductions } from "@kfood/data";

import { AdminShell, publicationStatusLabels, AdminTabs } from "@/components/admin-shell";
import { PlansPanel, planStatusLabels } from "@/components/admin/plans-panel";
import { ProductionsPanel } from "@/components/admin/productions-panel";
import { ShootLogsPanel } from "@/components/admin/shoot-logs-panel";
import {
  buildCalendarDays,
  formatIsoWeek,
  formatPlanDate
} from "@/lib/content-calendar";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Production"
};

const contentTabs = [
  { key: "plans", label: "기획 목록" },
  { key: "shoot", label: "촬영 일지" },
  { key: "productions", label: "제작 목록" },
  { key: "calendar", label: "기획 캘린더" }
];

const flowSteps = [
  { num: "01", title: "트렌드 발견", desc: "SNS·검색어·방문 문의" },
  { num: "02", title: "콘셉트 기획", desc: "음식 문화 포인트 정의" },
  { num: "03", title: "촬영 준비", desc: "장소·메뉴·컷리스트" },
  { num: "04", title: "제작/검수", desc: "편집·번역·톤 확인" },
  { num: "05", title: "발행/전환", desc: "예약·구매 CTA 연결" }
];

export default async function AdminContentPage({
  searchParams
}: {
  searchParams?: Promise<{
    tab?: string;
    add?: string;
    error?: string;
    updated?: string;
    created?: string;
    deleted?: string;
    started?: string;
    archived?: string;
    imported?: string;
    stopAdded?: string;
    stopUpdated?: string;
    stopDeleted?: string;
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "plans";
  const add = params?.add === "1";
  const listParams = { q: params?.q, status: params?.status, page: params?.page };

  const [plans, productions] = await Promise.all([
    getAdminContentPlans(session.accessToken),
    getAdminProductions(session.accessToken)
  ]);
  const stats = {
    total: plans.length,
    published: plans.filter((plan) => plan.status === "published").length,
    inProgress: plans.filter((plan) => plan.status === "in_progress").length,
    planned: plans.filter((plan) => plan.status === "planned").length
  };

  // 기획·제작에 입력한 날짜를 하나로 모아 날짜순으로 정리한다.
  const calendarDays = buildCalendarDays(
    plans,
    productions,
    planStatusLabels,
    publicationStatusLabels
  );
  const undatedCount =
    plans.filter((plan) => !plan.targetDate).length +
    productions.filter((production) => !production.scheduledDate).length;

  return (
    <AdminShell active="content" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 제작</span>
          <h1>콘텐츠 제작</h1>
          <p>
            무엇을 만들지 기획하고(기획 목록), 다녀온 촬영을 기록하고(촬영 일지),
            만든 것을 올립니다(제작 목록). 기획에서 &ldquo;제작 시작&rdquo;을 누르면
            제목·메모가 옮겨진 제작 콘텐츠가 옆 탭에 만들어집니다.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <Link
            className="admin-btn primary"
            href="/admin/content?tab=plans&add=1"
            prefetch={false}
          >
            기획 추가
          </Link>
        </div>
      </div>

      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">전체 기획</span>
          <span className="admin-metric-value">{stats.total}</span>
          <span className="admin-metric-sub">지금까지 적어둔 기획</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">발행 완료</span>
          <span className="admin-metric-value">{stats.published}</span>
          <span className="admin-metric-sub">게시 완료</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">진행 중</span>
          <span className="admin-metric-value">{stats.inProgress}</span>
          <span className="admin-metric-sub">제작·검수 중</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">대기</span>
          <span className="admin-metric-value">{stats.planned}</span>
          <span className="admin-metric-sub">착수 전</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>제작 흐름</h2>
          <p>발견 → 기획 → 촬영 → 검수 → 발행</p>
        </div>
        <div className="admin-flow">
          {flowSteps.map((step) => (
            <div className="admin-flow-step" key={step.num}>
              <span className="admin-flow-num">{step.num}</span>
              <span className="admin-flow-title">{step.title}</span>
              <span className="admin-flow-desc">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <AdminTabs basePath="/admin/content" current={tab} tabs={contentTabs} />

      {tab === "shoot" ? (
        <ShootLogsPanel
          accessToken={session.accessToken}
          message={{
            created: params?.created,
            deleted: params?.deleted,
            error: params?.error,
            imported: params?.imported,
            stopAdded: params?.stopAdded,
            stopDeleted: params?.stopDeleted,
            stopUpdated: params?.stopUpdated,
            updated: params?.updated
          }}
          params={listParams}
        />
      ) : tab === "productions" ? (
        <ProductionsPanel
          accessToken={session.accessToken}
          add={add}
          message={{
            archived: params?.archived,
            created: params?.created,
            deleted: params?.deleted,
            error: params?.error,
            updated: params?.updated
          }}
          params={listParams}
        />
      ) : tab === "calendar" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>기획 캘린더</h2>
            <p>
              기획 목록·제작 목록에서 입력한 일정을 날짜순으로 모아 보여줍니다.
              날짜를 바꾸려면 각 목록에서 해당 항목을 열어 &ldquo;일정&rdquo;을
              수정하세요.
            </p>
          </div>

          {calendarDays.length === 0 ? (
            <div className="admin-empty">
              일정이 잡힌 항목이 없습니다. 기획 목록이나 제작 목록에서 항목을 열고
              &ldquo;일정&rdquo; 날짜를 넣으면 여기에 모입니다.
              {undatedCount > 0 ? ` (날짜 미정 ${undatedCount}건)` : ""}
            </div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>주차</th>
                    <th>일정</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarDays.map((day) => (
                    <tr key={day.date}>
                      <td>{formatPlanDate(day.date)}</td>
                      <td style={{ color: "var(--text-body)" }}>
                        {formatIsoWeek(day.date)}
                      </td>
                      <td>
                        {day.entries.map((entry) => (
                          <div key={entry.id} style={{ marginBottom: 4 }}>
                            <span
                              className={
                                entry.kind === "plan"
                                  ? "admin-badge warning"
                                  : "admin-badge brand"
                              }
                              style={{ marginRight: 8 }}
                            >
                              {entry.kind === "plan" ? "기획" : "제작"}
                            </span>
                            {entry.title}
                            <span style={{ color: "var(--text-body)" }}>
                              {" "}
                              · {entry.statusLabel}
                              {entry.detail ? ` · ${entry.detail}` : ""}
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {undatedCount > 0 ? (
                <p className="admin-metric-sub" style={{ marginTop: 12 }}>
                  날짜가 없어 이 표에 안 나온 항목이 {undatedCount}건 있습니다.
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <PlansPanel
          accessToken={session.accessToken}
          add={add}
          message={{
            created: params?.created,
            deleted: params?.deleted,
            error: params?.error,
            started: params?.started,
            updated: params?.updated
          }}
          params={listParams}
        />
      )}
    </AdminShell>
  );
}
