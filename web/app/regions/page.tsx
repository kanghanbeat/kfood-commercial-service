import Link from "next/link";

import { getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { ProvinceMap } from "@/components/province-map";
import type { MapMarker } from "@/components/korea-map";
import { getDict } from "@/lib/i18n";
import {
  PROVINCES,
  PROVINCE_GROUPS,
  REGION_MAP_POINTS,
  groupOfProvince,
  groupRegionSlugs,
  isProvinceGroupKey,
  isProvinceKey,
  type ProvinceGroupKey
} from "@/lib/provinces";

export const metadata = {
  title: "Seoul K-food Regions"
};

// 홈 지도에서 시·도를 클릭하면 ?province=<key>로 들어온다 (A안: 코드 매핑표).
export default async function RegionsPage({
  searchParams
}: {
  searchParams: Promise<{ province?: string }>;
}) {
  const [{ province }, regions, dict] = await Promise.all([
    searchParams,
    getPublishedRegions(),
    getDict()
  ]);

  // 지도(9개 권역)에서 오는 그룹 키와, 예전 시·도 키 둘 다 받는다.
  const groupKey: ProvinceGroupKey | null = province
    ? isProvinceGroupKey(province)
      ? province
      : isProvinceKey(province)
        ? groupOfProvince(province)
        : null
    : null;
  const filter = province
    ? isProvinceGroupKey(province)
      ? {
          title: `${PROVINCE_GROUPS[province].nameEn} · ${PROVINCE_GROUPS[province].nameKo}`,
          slugs: groupRegionSlugs(province)
        }
      : isProvinceKey(province)
        ? {
            title: `${PROVINCES[province].nameEn} · ${PROVINCES[province].nameKo}`,
            slugs: PROVINCES[province].regionSlugs
          }
        : null
    : null;
  const visibleRegions = filter
    ? regions.filter((region) => filter.slugs.includes(region.slug))
    : regions;

  // 상단 확대 지도 마커 — 이 필터에 보이는 지역 중 좌표 등록분만.
  const mapMarkers: MapMarker[] = visibleRegions
    .filter((region) => REGION_MAP_POINTS[region.slug])
    .map((region) => ({
      slug: region.slug,
      nameEn: region.nameEn,
      x: REGION_MAP_POINTS[region.slug].x,
      y: REGION_MAP_POINTS[region.slug].y
    }));

  return (
    <div className="food-v2">
      <FoodTabs active="regions" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.regionsEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">
            {filter ? filter.title : dict.lists.regionsTitle}
          </span>
        </div>
        <p className="food-v2-summary">{dict.lists.regionsSummary}</p>
        {filter && groupKey ? (
          // 권역 안 시·도 선택 탭 — 서울처럼 콘텐츠가 많은 곳을 나눠 본다.
          // 멤버가 2개 이상인 권역(현재는 수도권)에만 표시.
          <nav
            className="food-subnav province-member-tabs"
            aria-label="Provinces in this area"
          >
            <Link
              className={`food-subnav-tab${
                isProvinceGroupKey(province ?? "") ? " active" : ""
              }`}
              href={`/regions?province=${groupKey}`}
              aria-current={isProvinceGroupKey(province ?? "") ? "page" : undefined}
            >
              {PROVINCE_GROUPS[groupKey].nameKo}
            </Link>
            {PROVINCE_GROUPS[groupKey].memberIds.length > 1
              ? PROVINCE_GROUPS[groupKey].memberIds.map((member) => (
                  <Link
                    className={`food-subnav-tab${province === member ? " active" : ""}`}
                    href={`/regions?province=${encodeURIComponent(member)}`}
                    key={member}
                    aria-current={province === member ? "page" : undefined}
                  >
                    {PROVINCES[member].nameEn}
                  </Link>
                ))
              : null}
            <Link className="food-subnav-tab" href="/regions">
              {dict.home.allRegions}
            </Link>
          </nav>
        ) : null}
      </header>
      {filter && groupKey ? (
        <ProvinceMap groupKey={groupKey} markers={mapMarkers} />
      ) : null}
      <div className="card-grid-v2">
        {visibleRegions.map((region) => (
          <Link className="card-v2" href={`/regions/${region.slug}`} key={region.slug}>
            <CardPhoto label={region.nameEn} variant="region" />
            <div className="card-v2-body">
              <span className="food-chip">{region.primaryAudience}</span>
              <span className="card-v2-title">{region.nameEn}</span>
              <span className="card-v2-meta">{region.intro}</span>
              <span className="card-v2-link">{dict.common.explore} →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
