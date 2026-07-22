import Link from "next/link";

import { AdminShell, AdminTabs } from "@/components/admin-shell";
import { FoodsPanel } from "@/components/admin/foods-panel";
import { PlacesPanel } from "@/components/admin/places-panel";
import { ProductionsPanel } from "@/components/admin/productions-panel";
import { RegionsPanel } from "@/components/admin/regions-panel";
import { RoutesPanel } from "@/components/admin/routes-panel";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Content Management"
};

const manageTabs = [
  { key: "regions", label: "지역" },
  { key: "foods", label: "음식" },
  { key: "places", label: "장소" },
  { key: "routes", label: "루트" },
  { key: "productions", label: "촬영" }
];

// 통합 "콘텐츠 추가" 입구: 유형을 고르면 해당 탭의 추가 폼이 열린 채로 이동.
// 참조 콘텐츠(A)는 유형별 구조를 유지하되 입구만 하나로 통합한다.
const addTypes = [
  { key: "regions", label: "지역", desc: "타깃·소개" },
  { key: "foods", label: "음식", desc: "매운맛·맛" },
  { key: "places", label: "장소", desc: "지도·신뢰" },
  { key: "routes", label: "루트", desc: "경유지·시간" },
  { key: "productions", label: "촬영 콘텐츠", desc: "영상·블로그 + 태그" }
];

const summaryMetrics = [
  { label: "공개 중", value: "184", sub: "검색 노출 가능" },
  { label: "검수 대기", value: "26", sub: "번역·이미지 확인" },
  { label: "초안", value: "41", sub: "작성 중 콘텐츠" },
  { label: "보류", value: "9", sub: "권리·정보 확인 필요" }
];

export default async function AdminManagePage({
  searchParams
}: {
  searchParams?: Promise<{
    tab?: string;
    add?: string;
    error?: string;
    updated?: string;
    created?: string;
    archived?: string;
    deleted?: string;
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const tab = params?.tab ?? "regions";
  const add = params?.add === "1";
  const message = {
    error: params?.error,
    updated: params?.updated,
    created: params?.created,
    archived: params?.archived,
    deleted: params?.deleted
  };
  // 검색·상태 필터·페이지는 탭 하나만 렌더되므로 공통 파라미터로 넘긴다.
  const listParams = { q: params?.q, status: params?.status, page: params?.page };

  return (
    <AdminShell active="manage" session={session}>
      <div className="admin-topbar">
        <div className="admin-topbar-heading">
          <span className="admin-eyebrow">콘텐츠 관리</span>
          <h1>공개 콘텐츠 데이터 관리</h1>
          <p>
            관리자·에디터가 직접 작성하는 공식 여행 가이드 콘텐츠입니다. 지역·음식·
            장소·루트·촬영 콘텐츠의 검수 상태와 공개 여부를 한 화면에서 조정합니다.
            (고객이 쓰는 글은 운영 &gt; 게시물 관리에서 별도로 검수합니다.)
          </p>
        </div>
        <div className="admin-topbar-actions">
          <a className="admin-btn" href="/" target="_blank" rel="noreferrer">
            공개 미리보기
          </a>
          <details className="admin-add-menu">
            <summary className="admin-btn primary">콘텐츠 추가</summary>
            <div className="admin-add-menu-list">
              <span className="admin-add-menu-title">어떤 콘텐츠를 추가할까요?</span>
              {addTypes.map((type) => (
                <Link
                  className="admin-add-menu-item"
                  href={`/admin/manage?tab=${type.key}&add=1`}
                  key={type.key}
                  prefetch={false}
                >
                  <span className="admin-add-menu-label">{type.label}</span>
                  <span className="admin-add-menu-desc">{type.desc}</span>
                </Link>
              ))}
            </div>
          </details>
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

      {tab === "regions" ? (
        <RegionsPanel
          accessToken={session.accessToken}
          add={add}
          message={message}
          params={listParams}
        />
      ) : null}
      {tab === "foods" ? (
        <FoodsPanel
          accessToken={session.accessToken}
          add={add}
          message={message}
          params={listParams}
        />
      ) : null}
      {tab === "places" ? (
        <PlacesPanel
          accessToken={session.accessToken}
          add={add}
          message={message}
          params={listParams}
        />
      ) : null}
      {tab === "routes" ? (
        <RoutesPanel
          accessToken={session.accessToken}
          add={add}
          message={message}
          params={listParams}
        />
      ) : null}
      {tab === "productions" ? (
        <ProductionsPanel
          accessToken={session.accessToken}
          add={add}
          message={message}
          params={listParams}
        />
      ) : null}
    </AdminShell>
  );
}
