import Link from "next/link";

import { getPublishedFoods } from "@kfood/data";

export const metadata = {
  title: "K-food Guide"
};

export default async function FoodsPage() {
  const foods = await getPublishedFoods();

  return (
    <div className="food-v2">
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">Foods</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">Beginner-friendly K-food</span>
        </div>
        <p className="food-v2-summary">
          Food pages explain taste, spice level, and where each dish fits in a
          Seoul trip.
        </p>
        <div className="food-v2-actions">
          <Link className="button secondary" href="/photo-sources">
            Review photo sources
          </Link>
        </div>
      </header>
      <div className="card-grid-v2">
        {foods.map((food) => (
          <Link className="card-v2" href={`/foods/${food.slug}`} key={food.slug}>
            <div className="card-v2-body">
              <span className="food-chip spicy">Spicy {food.spicyLevel}/4</span>
              <span className="card-v2-title">{food.nameEn}</span>
              <span className="card-v2-meta">{food.summary}</span>
              <span className="card-v2-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
