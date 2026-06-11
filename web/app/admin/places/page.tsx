import { getPublishedPlaces } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Places"
};

export default async function AdminPlacesPage() {
  await requireAdminSession();
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
              <div className="source-grid">
                {place.googleMapsUrl ? (
                  <a
                    className="source-link"
                    href={place.googleMapsUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>Map check</span>
                    <strong>Google Maps</strong>
                    <small>Confirm address, current opening state, and recent reviews.</small>
                  </a>
                ) : null}
                {place.naverMapsUrl ? (
                  <a
                    className="source-link"
                    href={place.naverMapsUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>Map check</span>
                    <strong>Naver Map</strong>
                    <small>Confirm Korean listing, branch choice, and live hours.</small>
                  </a>
                ) : null}
                <div className="source-link">
                  <span>Business note</span>
                  <strong>Before editing</strong>
                  <small>
                    {place.businessHoursNote ??
                      "Check live map details before changing public copy."}
                  </small>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
