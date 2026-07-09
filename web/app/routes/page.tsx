import Link from "next/link";

import { getPublishedRegions, getPublishedRoutes } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";

export const metadata = {
  title: "K-food Routes"
};

export default async function RoutesPage() {
  const [routes, regions, dict] = await Promise.all([
    getPublishedRoutes(),
    getPublishedRegions(),
    getDict()
  ]);

  return (
    <div className="food-v2">
      <FoodTabs active="routes" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.routesEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{dict.lists.routesTitle}</span>
        </div>
        <p className="food-v2-summary">{dict.lists.routesSummary}</p>
      </header>
      <div className="card-grid-v2">
        {routes.map((route) => {
          const region = regions.find((item) => item.slug === route.regionSlug);
          return (
            <Link className="card-v2" href={`/routes/${route.slug}`} key={route.slug}>
              <CardPhoto label={route.title} variant="route" />
              <div className="card-v2-body">
                <span className="food-chip">{route.estimatedDuration}</span>
                <span className="card-v2-title">{route.title}</span>
                <span className="card-v2-meta">
                  {route.summary} {region ? `Start with ${region.nameEn}.` : ""}
                </span>
                <span className="card-v2-link">{dict.common.view} →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
