import Link from "next/link";

import { alphaRegions } from "@kfood/data";

export const metadata = {
  title: "Seoul K-food Regions"
};

export default function RegionsPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Regions</p>
        <h1>Seoul areas by food intent</h1>
        <p className="detail-intro">
          Start with the neighborhood that matches the traveler, then move into
          foods, places, and route ideas.
        </p>
      </header>
      <ul className="directory-grid">
        {alphaRegions.map((region) => (
          <li className="directory-card" key={region.slug}>
            <Link href={`/regions/${region.slug}`}>
              <span>{region.primaryAudience}</span>
              <strong>{region.nameEn}</strong>
              <p>{region.intro}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
