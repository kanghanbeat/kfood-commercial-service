import Link from "next/link";

import { getPublishedPlaces, getRegion } from "@kfood/data";

export const metadata = {
  title: "K-food Places"
};

export default async function PlacesPage() {
  const places = await getPublishedPlaces();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Places</p>
        <h1>Editorial place directions</h1>
        <p className="detail-intro">
          MVP place pages start as curated directions and trust notes before
          adding live map data or reservations.
        </p>
      </header>
      <ul className="content-list">
        {places.map((place) => {
          const region = getRegion(place.regionSlug);
          return (
            <li key={place.slug}>
              <Link href={`/places/${place.slug}`}>
                <span className="meta-label">{region?.nameEn ?? "Seoul"}</span>
                <strong>{place.nameEn}</strong>
                <p>{place.editorialNote}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
