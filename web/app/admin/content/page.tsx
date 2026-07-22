import Link from "next/link";

import { getAdminContentPlans } from "@kfood/data";

import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { PlansPanel } from "@/components/admin/plans-panel";
import { contentData } from "@/lib/dashboard";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Production"
};

const contentTabs = [
  { key: "plans", label: "기획 목록" },
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

  const plans = await getAdminContentPlans(session.accessToken);
  const stats = {
    total: plans.length,
    published: plans.filter((plan) => plan.status === "published").length,
    inProgress: plans.filter((plan) => plan.status === "in_progress").length,
    planned: plans.filter((plan) => plan.status === "planned").length
  };

  // 캘린더는 아직 실데이터가 없다(정적 예시). 기획 목록만 DB에 연결된 상태.
  const { meta, calendar } = contentData;

  return (
    <AdminShell active="content" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 제작</span>
          <h1>콘텐츠 제작</h1>
          <p>
            인사이트에서 발견한 주제를 기획으로 적어두고, 제작으로 넘깁니다.
            제작 시작을 누르면 촬영·제작 콘텐츠가 만들어져 이 기획에 연결됩니다.
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

      {tab === "calendar" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>기획 캘린더</h2>
            <p>
              ⚠️ 아직 예시 데이터입니다({meta.week} 고정). 기획 목록은 실제 저장되지만
              이 캘린더는 아직 연결 전입니다.
            </p>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>요일</th>
                <th>일정</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>{day.day}</td>
                  <td>
                    {day.items.length === 0 ? (
                      <span style={{ color: "var(--text-body)" }}>—</span>
                    ) : (
                      day.items.map((item, i) => (
                        <div key={i}>
                          <span className="admin-badge brand" style={{ marginRight: 8 }}>
                            {item.channel}
                          </span>
                          {item.label}
                        </div>
                      ))
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
