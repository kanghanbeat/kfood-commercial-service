import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { insightsData } from "@/lib/dashboard";
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

function Delta({ change }: { change: string }) {
  const isUp = change.startsWith("+");
  const isDown = change.startsWith("-");
  if (!isUp && !isDown) return <span>{change === "0" ? "—" : change}</span>;
  return (
    <span className={isUp ? "admin-delta-up" : "admin-delta-down"}>{change}</span>
  );
}

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
  const { meta, trending_foods, platforms, realtime_report, regional_sentiment, weekly_review } =
    insightsData;
  const platformList = Object.values(platforms);
  const top = trending_foods[0];

  return (
    <AdminShell active="insight" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">인사이트 · {meta.week}</span>
          <h1>인사이트 요약</h1>
          <p>외국인 관심 신호를 콘텐츠 기획으로 연결하는 관리자 첫 화면입니다. (수집 {meta.collection_date} · {meta.collection_method})</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-btn" type="button">데이터 새로고침</button>
        </div>
      </div>

      <AdminTabs basePath="/admin" current={tab} tabs={insightTabs} />

      {tab === "summary" ? (
        <>
          <div className="admin-metric-grid">
            <div className="admin-metric-card">
              <span className="admin-metric-label">분석 게시물</span>
              <span className="admin-metric-value">{meta.total_posts_analyzed}</span>
              <span className="admin-metric-sub">{meta.week} 기준</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-label">이번 주 1위</span>
              <span className="admin-metric-value">{top.name_ko}</span>
              <span className="admin-metric-sub">주간 점수 {top.score}</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-label">잔여 크레딧</span>
              <span className="admin-metric-value">{meta.credits_remaining.toLocaleString()}</span>
              <span className="admin-metric-sub">이번 주 {meta.credits_used} 사용</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-label">수집 채널</span>
              <span className="admin-metric-value">{platformList.length}</span>
              <span className="admin-metric-sub">{platformList.map((p) => p.name).join(" · ")}</span>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-head">
              <h2>주간 리뷰 — {weekly_review.compared_label} 대비</h2>
              <p>{weekly_review.headline}</p>
            </div>
            <p style={{ color: "var(--text-body)", lineHeight: 1.6 }}>{weekly_review.summary}</p>
          </div>
        </>
      ) : null}

      {tab === "trends" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>트렌드 랭킹</h2>
            <p>음식별 점수와 증감, 수집 플랫폼 기준</p>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>순위</th><th>음식</th><th>점수</th><th>증감</th><th>플랫폼</th></tr>
            </thead>
            <tbody>
              {trending_foods.map((food) => (
                <tr key={food.rank}>
                  <td>{food.rank}</td>
                  <td>{food.name_ko} <span style={{ color: "var(--text-body)" }}>{food.name}</span></td>
                  <td>{food.score}</td>
                  <td><Delta change={food.change} /></td>
                  <td>{food.platforms.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "hotfood" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>핫푸드</h2>
            <p>{realtime_report.subtitle}</p>
          </div>
          <div className="admin-form-list">
            {realtime_report.hot_foods.map((hf) => (
              <div className="admin-flow-step" key={hf.food_en}>
                <span className="admin-flow-title">{hf.food} <span style={{ color: "var(--text-body)", fontWeight: 400 }}>{hf.food_en}</span></span>
                <span className="admin-flow-desc">{hf.highlight}</span>
                <span className="admin-flow-desc" style={{ color: "var(--text-heading)" }}>{hf.insight}</span>
                <span>{hf.platforms.map((p) => <span className="admin-badge brand" key={p} style={{ marginRight: 6 }}>{p}</span>)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "country" ? (
        <>
          <div className="admin-panel">
            <div className="admin-panel-head">
              <h2>국가별 콘텐츠 트렌드</h2>
              <p>현지에서 한국 음식이 소비되는 방식</p>
            </div>
            <table className="admin-table">
              <thead><tr><th>국가</th><th>도시</th><th>콘텐츠 트렌드</th></tr></thead>
              <tbody>
                {realtime_report.geography.map((g) => (
                  <tr key={g.country}>
                    <td>{g.icon} {g.country}</td>
                    <td>{g.cities.join(", ")}</td>
                    <td>{g.content_trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-panel">
            <div className="admin-panel-head">
              <h2>지역별 감성</h2>
              <p>긍정·중립·부정 비율과 대표 음식</p>
            </div>
            <table className="admin-table">
              <thead><tr><th>지역</th><th>긍정</th><th>중립</th><th>부정</th><th>대표 음식</th></tr></thead>
              <tbody>
                {regional_sentiment.map((r) => (
                  <tr key={r.region}>
                    <td>{r.region}</td>
                    <td><span className="admin-delta-up">{r.positive}%</span></td>
                    <td>{r.neutral}%</td>
                    <td><span className="admin-delta-down">{r.negative}%</span></td>
                    <td>{r.top_food}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {tab === "questions" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>외국인 궁금증</h2>
            <p>SNS·커뮤니티에서 외국인이 실제로 묻는 질문 → 콘텐츠 기회</p>
          </div>
          <div className="admin-form-list">
            {realtime_report.foreigner_questions.map((q) => (
              <div className="admin-flow-step" key={q.q}>
                <span className="admin-flow-title">{q.q}</span>
                <span className="admin-flow-desc">{q.source} · 댓글 {q.replies}</span>
                <span className="admin-flow-desc" style={{ color: "var(--brand)" }}>기회: {q.opportunity}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "collection" ? (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h2>수집 현황</h2>
            <p>{meta.collection_method} · {meta.collection_date}</p>
          </div>
          <table className="admin-table">
            <thead><tr><th>플랫폼</th><th>분석 게시물</th><th>상위 해시태그</th><th>수집 도구</th></tr></thead>
            <tbody>
              {platformList.map((p) => (
                <tr key={p.name}>
                  <td>{p.icon} {p.name}</td>
                  <td>{p.posts_analyzed}</td>
                  <td>{p.top_hashtags.slice(0, 3).map((h) => h.tag).join(" ")}</td>
                  <td>{p.source_tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminShell>
  );
}
