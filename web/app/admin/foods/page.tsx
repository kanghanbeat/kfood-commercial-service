import { getPublishedFoods } from "@kfood/data";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Foods"
};

export default async function AdminFoodsPage() {
  await requireAdminSession();
  const foods = await getPublishedFoods();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Foods</h1>
        <p className="detail-intro">
          Maintain dish descriptions, spice levels, and traveler notes.
        </p>
      </header>
      <AdminNav />
      <ul className="content-list">
        {foods.map((food) => (
          <li key={food.slug}>
            <div className="list-item-body">
              <span className="meta-label">Spicy level {food.spicyLevel}/4</span>
              <strong>{food.nameEn}</strong>
              <p>{food.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
