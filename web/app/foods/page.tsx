import Link from "next/link";

import { getPublishedFoods } from "@kfood/data";

export const metadata = {
  title: "K-food Guide"
};

export default async function FoodsPage() {
  const foods = await getPublishedFoods();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Foods</p>
        <h1>Beginner-friendly K-food choices</h1>
        <p className="detail-intro">
          Food pages explain taste, spice level, and where each dish fits in a
          Seoul trip.
        </p>
      </header>
      <ul className="directory-grid">
        {foods.map((food) => (
          <li className="directory-card" key={food.slug}>
            <Link href={`/foods/${food.slug}`}>
              <span>Spicy level {food.spicyLevel}/4</span>
              <strong>{food.nameEn}</strong>
              <p>{food.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
