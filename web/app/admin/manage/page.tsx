import {
  getPublishedFoods,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";

import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { PlacesPanel } from "@/components/admin/places-panel";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Management"
};

const manageTabs = [
  { key: "regions", label: "지역" },
  { key: "foods", label: "음식" },
  { key: "places", label: "장소" },
  { key: "routes", label: "루트" }
];

// 상단 요약 카드: 발행 상태별 집계. 현재 공개 데이터 기준 placeholder 값.
const summaryMetrics = [
  { label: "공개 중", value: "184", sub: "검색 노출 가능" },
  { label: "검수 대기", value: "26", sub: "번역·이미지 확인" },
  { label: "초안", value: "41", sub: "작성 중 콘텐츠" },
  { label: "보류", value: "9", sub: "권리·정보 확인 필요" }
];

export default async function AdminManagePage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string; error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "regions";

  return (
    <AdminShell active="manage" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 관리</span>
          <h1>공개 콘텐츠 데이터 관리</h1>
          <p>
            지역·음식·장소·루트 콘텐츠의 검수 상태와 공개 여부를 한 화면에서
            조정합니다.
          </p>
        </div>
        <div className="admin-topbar-actions">
          <a className="admin-btn" href="/" target="_blank" rel="noreferrer">
            공개 미리보기
          </a>
          <button className="admin-btn primary" type="button">
            콘텐츠 추가
          </button>
        </div>
      </div>

      <div className="admin-metric-grid">
        {summaryMetrics.map((metric) => (
          <div className="admin-metric-card" key={metric.label}>
            <span className="admin-metric-label">{metric.label}</span>
            <span className="admin-metric-value">{metric.value}</span>
            <span className="admin-metric-sub">{metric.sub}</span>
          </div>
        ))}
      </div>

      <AdminTabs basePath="/admin/manage" current={tab} tabs={manageTabs} />

      {tab === "regions" ? <RegionsPanel /> : null}
      {tab === "foods" ? <FoodsPanel /> : null}
      {tab === "places" ? (
        <PlacesPanel
          accessToken={session.accessToken}
          message={{ error: params?.error, updated: params?.updated }}
        />
      ) : null}
      {tab === "routes" ? <RoutesPanel /> : null}
    </AdminShell>
  );
}

async function RegionsPanel() {
  const regions = await getPublishedRegions();
  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>지역 콘텐츠</h2>
        <p>공개 웹에 노출되는 지역 단위 콘텐츠의 발행 상태와 소개를 확인합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>지역</th>
            <th>주요 타깃</th>
            <th>루트 테마</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.slug}>
              <td>{region.nameEn}</td>
              <td>{region.primaryAudience}</td>
              <td>{region.routeTheme}</td>
              <td>
                <span className="admin-badge success">공개</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function FoodsPanel() {
  const foods = await getPublishedFoods();
  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>음식 콘텐츠</h2>
        <p>음식별 설명·매운맛 단계·초보자 노트를 확인합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>음식</th>
            <th>요약</th>
            <th>매운맛</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.slug}>
              <td>{food.nameEn}</td>
              <td>{food.summary}</td>
              <td>{food.spicyLevel}/4</td>
              <td>
                <span className="admin-badge success">공개</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function RoutesPanel() {
  const routes = await getPublishedRoutes();
  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>루트 콘텐츠</h2>
        <p>루트 요약·연결 장소·소요 시간·발행 상태를 관리합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>루트</th>
            <th>요약</th>
            <th>소요 시간</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.slug}>
              <td>{route.title}</td>
              <td>{route.summary}</td>
              <td>{route.estimatedDuration}</td>
              <td>
                <span className="admin-badge success">공개</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
