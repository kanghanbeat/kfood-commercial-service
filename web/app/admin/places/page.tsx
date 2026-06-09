import { getPublishedPlaces } from "@kfood/data";

export const metadata = {
  title: "Admin Places"
};

export default async function AdminPlacesPage() {
  const places = await getPublishedPlaces();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Places</h1>
        <p className="detail-intro">
          The key admin workflow is correcting stale place data in under two
          minutes.
        </p>
      </header>
      <ul className="content-list">
        {places.map((place) => (
          <li key={place.slug}>
            <div className="list-item-body">
              <span className="meta-label">{place.lastVerifiedLabel}</span>
              <strong>{place.nameEn}</strong>
              <p>{place.editorialNote}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
