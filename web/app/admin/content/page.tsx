import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { contentData } from "@/lib/dashboard";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Production"
};

const contentTabs = [
  { key: "calendar", label: "기획 캘린더" },
  { key: "topics", label: "기획 목록" }
];

const flowSteps = [
  { num: "01", title: "트렌드 발견", desc: "SNS·검색어·방문 문의" },
  { num: "02", title: "콘셉트 기획", desc: "음식 문화 포인트 정의" },
  { num: "03", title: "촬영 준비", desc: "장소·메뉴·컷리스트" },
  { num: "04", title: "제작/검수", desc: "편집·번역·톤 확인" },
  { num: "05", title: "발행/전환", desc: "예약·구매 CTA 연결" }
];

const priorityClass: Record<string, string> = {
  high: "danger",
  medium: "warning",
  low: "brand"
};

export default async function AdminContentPage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "calendar";
  const { meta, stats, topics, calendar } = contentData;

  return (
    <AdminShell active="content" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 제작 · {meta.week}</span>
          <h1>콘텐츠 제작</h1>
          <p>기획 캘린더, 촬영 기록, 번역 검수, 발행 상태를 한 화면에서 관리합니다.</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-btn primary" type="button">기획 추가</button>
        </div>
      </div>

      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">이번 주 기획</span>
          <span className="admin-metric-value">{stats.total}</span>
          <span className="admin-metric-sub">{meta.week}</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">발행 완료</span>
          <span className="admin-metric-value">{stats.done}</span>
          <span className="admin-metric-sub">게시 완료</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">진행 중</span>
          <span className="admin-metric-value">{stats.in_progress}</span>
          <span className="admin-metric-sub">제작·검수 중</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">대기</span>
          <span className="admin-metric-value">{stats.todo}</span>
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
            <p>{meta.week} 주간 제작 일정</p>
          </div>
          <table className="admin-table">
            <thead><tr><th>날짜</th><th>요일</th><th>일정</th></tr></thead>
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
                          <span className="admin-badge brand" style={{ marginRight: 8 }}>{item.channel}</span>
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
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>기획 목록</h2>
            <p>인사이트에서 발견한 주제와 제작 우선순위</p>
          </div>
          <table className="admin-table">
            <thead><tr><th>주제</th><th>카테고리</th><th>우선순위</th><th>근거 인사이트</th></tr></thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id}>
                  <td>
                    {topic.title_ko}
                    <div style={{ color: "var(--text-body)", fontSize: 13 }}>{topic.title}</div>
                  </td>
                  <td>{topic.category}</td>
                  <td>
                    <span className={`admin-badge ${priorityClass[topic.priority] ?? "brand"}`}>
                      {topic.priority}
                    </span>
                  </td>
                  <td>{topic.source_insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
