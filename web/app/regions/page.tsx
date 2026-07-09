import Link from "next/link";

import { getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";

export const metadata = {
  title: "Seoul K-food Regions"
};

export default async function RegionsPage() {
  const [regions, dict] = await Promise.all([getPublishedRegions(), getDict()]);

  return (
    <div className="food-v2">
      <FoodTabs active="regions" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.regionsEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{dict.lists.regionsTitle}</span>
        </div>
        <p className="food-v2-summary">{dict.lists.regionsSummary}</p>
      </header>
      <div className="card-grid-v2">
        {regions.map((region) => (
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
