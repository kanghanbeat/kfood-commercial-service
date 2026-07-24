import Link from "next/link";

import { getPublishedPlaces, getPublishedRegions } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";

export const metadata = {
  title: "K-food Places"
};

export default async function PlacesPage() {
  const [places, regions, dict] = await Promise.all([
    getPublishedPlaces(),
    getPublishedRegions(),
    getDict()
  ]);

  return (
    <div className="food-v2">
      <FoodTabs active="places" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.placesEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{dict.lists.placesTitle}</span>
        </div>
        <p className="food-v2-summary">{dict.lists.placesSummary}</p>
      </header>
      <div className="card-grid-v2">
        {places.map((place) => {
          const region = regions.find((item) => item.slug === place.regionSlug);
          return (
            <Link className="card-v2" href={`/places/${place.slug}`} key={place.slug}>
              <CardPhoto
                  imageUrl={place.imageUrl}
                  label={place.nameEn}
                  variant="place" />
              <div className="card-v2-body">
                <span className="food-chip">{region?.nameEn ?? "Seoul"}</span>
                <span className="card-v2-title">{place.nameEn}</span>
                <span className="card-v2-meta">{place.editorialNote}</span>
                <span className="card-v2-link">{dict.common.view} →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
