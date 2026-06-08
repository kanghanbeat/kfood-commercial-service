import Link from "next/link";

import { alphaRoutes, getRegion } from "@kfood/data";

export const metadata = {
  title: "K-food Routes"
};

export default function RoutesPage() {
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
        {alphaRoutes.map((route) => {
          const region = getRegion(route.regionSlug);
          return (
            <li key={route.slug}>
              <Link href={region ? `/regions/${region.slug}` : "/regions"}>
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
