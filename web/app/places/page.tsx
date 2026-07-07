import Link from "next/link";

import { getPublishedPlaces, getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";

export const metadata = {
  title: "K-food Places"
};

export default async function PlacesPage() {
  const [places, regions] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions()
  ]);

  return (
    <div className="food-v2">
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">Places</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">Editorial place directions</span>
        </div>
        <p className="food-v2-summary">
          Place pages start as curated directions and trust notes before adding
          live map data or reservations.
        </p>
      </header>
      <div className="card-grid-v2">
        {places.map((place) => {
          const region = regions.find((item) => item.slug === place.regionSlug);
          return (
            <Link className="card-v2" href={`/places/${place.slug}`} key={place.slug}>
              <CardPhoto label={place.nameEn} variant="place" />
              <div className="card-v2-body">
                <span className="food-chip">{region?.nameEn ?? "Seoul"}</span>
                <span className="card-v2-title">{place.nameEn}</span>
                <span className="card-v2-meta">{place.editorialNote}</span>
                <span className="card-v2-link">View →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
