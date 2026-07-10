import Link from "next/link";

import { getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";
import { PROVINCES, isProvinceKey } from "@/lib/provinces";

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

  const provinceInfo =
    province && isProvinceKey(province) ? PROVINCES[province] : null;
  const visibleRegions = provinceInfo
    ? regions.filter((region) => provinceInfo.regionSlugs.includes(region.slug))
    : regions;

  return (
    <div className="food-v2">
      <FoodTabs active="regions" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.regionsEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">
            {provinceInfo
              ? `${provinceInfo.nameEn} · ${provinceInfo.nameKo}`
              : dict.lists.regionsTitle}
          </span>
        </div>
        <p className="food-v2-summary">{dict.lists.regionsSummary}</p>
        {provinceInfo ? (
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
