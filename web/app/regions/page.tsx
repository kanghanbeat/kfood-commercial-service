import Link from "next/link";

import { getPublishedRegions } from "@kfood/data";

export const metadata = {
  title: "Seoul K-food Regions"
};

export default async function RegionsPage() {
  const regions = await getPublishedRegions();

  return (
    <div className="food-v2">
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">Regions</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">Seoul areas by food intent</span>
        </div>
        <p className="food-v2-summary">
          Start with the neighborhood that matches the traveler, then move into
          foods, places, and route ideas.
        </p>
      </header>
      <div className="card-grid-v2">
        {regions.map((region) => (
          <Link className="card-v2" href={`/regions/${region.slug}`} key={region.slug}>
            <div className="card-v2-body">
              <span className="food-chip">{region.primaryAudience}</span>
              <span className="card-v2-title">{region.nameEn}</span>
              <span className="card-v2-meta">{region.intro}</span>
              <span className="card-v2-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
