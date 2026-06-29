import Link from "next/link";

import { getPublishedFoods, getPublishedRoutes } from "@kfood/data";

export const metadata = {
  title: "Recommend"
};

export default async function RecommendPage() {
  const [foods, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedRoutes()
  ]);
  const starterFoods = foods.slice(0, 4);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Recommendations</p>
        <h1>Curated K-food guidance before personalization.</h1>
        <p className="detail-intro">
          Recommend starts with admin-curated foods and routes. Likes, follows,
          and interest-based suggestions can be added after the community data
          model is safe.
        </p>
      </header>
      <section className="section-block" aria-labelledby="editor-picks">
        <div className="section-heading">
          <p className="eyebrow">Editor&apos;s picks</p>
          <h2 id="editor-picks">Begin with verified food pages</h2>
        </div>
        <ul className="directory-grid">
          {starterFoods.map((food) => (
            <li className="directory-card" key={food.slug}>
              <Link href={`/foods/${food.slug}`}>
                <span>Spicy level {food.spicyLevel}/4</span>
                <strong>{food.nameEn}</strong>
                <p>{food.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-block" aria-labelledby="route-picks">
        <div className="section-heading">
          <p className="eyebrow">Routes</p>
          <h2 id="route-picks">Use routes as recommendation paths</h2>
        </div>
        <ul className="content-list">
          {routes.map((route) => (
            <li key={route.slug}>
              <div className="list-item-body">
                <span className="meta-label">{route.estimatedDuration}</span>
                <strong>{route.title}</strong>
                <p>{route.summary}</p>
                <Link className="inline-link" href={`/routes/${route.slug}`}>
                  Open route
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
