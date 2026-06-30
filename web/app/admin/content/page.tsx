import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Production"
};

const contentTabs = [
  { key: "calendar", label: "기획 캘린더" },
  { key: "shoot", label: "촬영 기록" }
];

// NOTE: 콘텐츠 제작 데이터(기획/촬영)는 아직 데이터 소스 없음. 시안 기준 placeholder.
const productionMetrics = [
  { label: "이번 주 기획", value: "18", delta: "+5" },
  { label: "촬영 확정", value: "07", delta: "+2" },
  { label: "검수 대기", value: "11", delta: "-3" },
  { label: "발행 예약", value: "24", delta: "+9" }
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
  searchParams?: Promise<{ tab?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "calendar";

  return (
    <AdminShell active="content" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 제작</span>
          <h1>콘텐츠 제작</h1>
          <p>
            기획 캘린더, 촬영 기록, 번역 검수, 발행 상태를 한 화면에서 관리합니다.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-btn primary" type="button">
            기획 추가
          </button>
        </div>
      </div>

      <div className="admin-metric-grid">
        {productionMetrics.map((metric) => (
          <div className="admin-metric-card" key={metric.label}>
            <span className="admin-metric-label">{metric.label}</span>
            <span className="admin-metric-value">{metric.value}</span>
            <span className="admin-metric-sub">
              <span
                className={
                  metric.delta.startsWith("+")
                    ? "admin-delta-up"
                    : "admin-delta-down"
                }
              >
                {metric.delta}
              </span>{" "}
              지난주 대비
            </span>
          </div>
        ))}
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

      <div className="admin-panel">
        <div className="admin-empty">
          {tab === "calendar" ? "기획 캘린더" : "촬영 기록"}는 데이터 연결 단계에서
          채워집니다. (기획/촬영 데이터 모델 정의 후 연동)
        </div>
      </div>
    </AdminShell>
  );
}
