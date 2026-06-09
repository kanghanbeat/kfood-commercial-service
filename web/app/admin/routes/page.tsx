import { getPublishedRoutes } from "@kfood/data";

export const metadata = {
  title: "Admin Routes"
};

export default async function AdminRoutesPage() {
  const routes = await getPublishedRoutes();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Routes</h1>
        <p className="detail-intro">
          Manage route summaries, linked places, duration, and publication state.
        </p>
      </header>
      <ul className="content-list">
        {routes.map((route) => (
          <li key={route.slug}>
            <div className="list-item-body">
              <span className="meta-label">{route.estimatedDuration}</span>
              <strong>{route.title}</strong>
              <p>{route.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
