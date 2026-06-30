import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Insights"
};

const insightTabs = [
  { key: "summary", label: "요약" },
  { key: "trends", label: "트렌드 랭킹" },
  { key: "hotfood", label: "핫푸드" },
  { key: "country", label: "국가별" },
  { key: "questions", label: "외국인 궁금증" },
  { key: "collection", label: "수집 현황" }
];

// NOTE: 인사이트 데이터는 현재 별도 K푸드 내부 대시보드(SNS 트렌드/수집)에서 옴.
// Supabase 연동 전까지 시안 기준 placeholder. 데이터 배선은 #7(데이터 연결) 단계.
const summaryMetrics = [
  { label: "분석 게시물", value: "407", sub: "최근 7일 기준" },
  { label: "이번 주 1위", value: "불닭볶음면", sub: "주간 점수 99" },
  { label: "잔여 크레딧", value: "4,869", sub: "이번 달 사용 가능" },
  { label: "수집 채널", value: "4", sub: "SNS·검색·API·커뮤니티" }
];

const trendRows = [
  { rank: 1, food: "불닭볶음면", score: 99, delta: "+12", platform: "TikTok" },
  { rank: 2, food: "한국BBQ", score: 90, delta: "-6", platform: "YouTube" },
  { rank: 3, food: "라면", score: 80, delta: "-5", platform: "Instagram" }
];

export default async function AdminInsightPage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "summary";

  return (
    <AdminShell active="insight" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">인사이트</span>
          <h1>인사이트 요약</h1>
          <p>외국인 관심 신호를 콘텐츠 기획으로 연결하는 관리자 첫 화면입니다.</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-btn" type="button">
            데이터 새로고침
          </button>
        </div>
      </div>

      <AdminTabs basePath="/admin" current={tab} tabs={insightTabs} />

      {tab === "summary" ? (
        <>
          <div className="admin-metric-grid">
            {summaryMetrics.map((metric) => (
              <div className="admin-metric-card" key={metric.label}>
                <span className="admin-metric-label">{metric.label}</span>
                <span className="admin-metric-value">{metric.value}</span>
                <span className="admin-metric-sub">{metric.sub}</span>
              </div>
            ))}
          </div>

          <div className="admin-panel">
            <div className="admin-panel-head">
              <h2>트렌드 랭킹</h2>
              <p>음식별 점수와 증감, 수집 플랫폼 기준</p>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>음식</th>
                  <th>점수</th>
                  <th>증감</th>
                  <th>플랫폼</th>
                </tr>
              </thead>
              <tbody>
                {trendRows.map((row) => (
                  <tr key={row.rank}>
                    <td>{row.rank}</td>
                    <td>{row.food}</td>
                    <td>{row.score}</td>
                    <td>
                      <span
                        className={
                          row.delta.startsWith("+")
                            ? "admin-delta-up"
                            : "admin-delta-down"
                        }
                      >
                        {row.delta}
                      </span>
                    </td>
                    <td>{row.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="admin-panel">
          <div className="admin-empty">
            이 탭({insightTabs.find((t) => t.key === tab)?.label ?? tab})은 데이터
            연결 단계에서 채워집니다. (현 K푸드 내부 대시보드 → Supabase 연동 예정)
          </div>
        </div>
      )}
    </AdminShell>
  );
}
