import Link from "next/link";

import { getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";
import {
  PROVINCES,
  PROVINCE_GROUPS,
  groupRegionSlugs,
  isProvinceGroupKey,
  isProvinceKey
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
        {filter ? (
          <div className="food-v2-actions">
            <Link className="button secondary" href="/regions">
              {dict.home.allRegions}
            </Link>
          </div>
        ) : null}
      </header>
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
