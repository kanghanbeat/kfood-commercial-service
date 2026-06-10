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
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Routes</p>
        <h1>Simple K-food route ideas</h1>
        <p className="detail-intro">
          Routes package region, food, and place directions into traveler-sized
          plans.
        </p>
      </header>
      <ul className="content-list">
        {routes.map((route) => {
          const region = regions.find((item) => item.slug === route.regionSlug);
          return (
            <li key={route.slug}>
              <Link href={`/routes/${route.slug}`}>
                <span className="meta-label">{route.estimatedDuration}</span>
                <strong>{route.title}</strong>
                <p>
                  {route.summary} {region ? `Start with ${region.nameEn}.` : ""}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
