import Link from "next/link";

import { getPublishedRegions, getPublishedRoutes } from "@kfood/data";

export const metadata = {
  title: "K-food Routes"
};

export default async function RoutesPage() {
  const [routes, regions] = await Promise.all([
    getPublishedRoutes(),
    getPublishedRegions()
  ]);

  return (
    <div className="food-v2">
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">Routes</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">K-food route ideas</span>
        </div>
        <p className="food-v2-summary">
          Routes package region, food, and place directions into traveler-sized
          plans.
        </p>
      </header>
      <div className="card-grid-v2">
        {routes.map((route) => {
          const region = regions.find((item) => item.slug === route.regionSlug);
          return (
            <Link className="card-v2" href={`/routes/${route.slug}`} key={route.slug}>
              <div className="card-v2-body">
                <span className="food-chip">{route.estimatedDuration}</span>
                <span className="card-v2-title">{route.title}</span>
                <span className="card-v2-meta">
                  {route.summary} {region ? `Start with ${region.nameEn}.` : ""}
                </span>
                <span className="card-v2-link">View →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
