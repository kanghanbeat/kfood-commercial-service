import { getPublishedRegions } from "@kfood/data";

export const metadata = {
  title: "Admin Regions"
};

export default async function AdminRegionsPage() {
  const regions = await getPublishedRegions();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Regions</h1>
        <p className="detail-intro">
          First admin pass: list published region records and define edit states.
        </p>
      </header>
      <ul className="content-list">
        {regions.map((region) => (
          <li key={region.slug}>
            <div className="list-item-body">
              <span className="meta-label">Published preview</span>
              <strong>{region.nameEn}</strong>
              <p>{region.intro}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
