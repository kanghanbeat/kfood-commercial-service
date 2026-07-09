import Link from "next/link";

import { getPublishedFoods } from "@kfood/data";

import { CardPhoto } from "@/components/card-photo";
import { FoodTabs } from "@/components/food-tabs";
import { getDict } from "@/lib/i18n";

export const metadata = {
  title: "K-food Guide"
};

export default async function FoodsPage() {
  const [foods, dict] = await Promise.all([getPublishedFoods(), getDict()]);

  return (
    <div className="food-v2">
      <FoodTabs active="dishes" />
      <header className="food-v2-header">
        <span className="food-v2-eyebrow">{dict.lists.foodsEyebrow}</span>
        <div className="food-v2-names">
          <span className="food-v2-name-en">{dict.lists.foodsTitle}</span>
        </div>
        <p className="food-v2-summary">{dict.lists.foodsSummary}</p>
        <div className="food-v2-actions">
          <Link className="button secondary" href="/photo-sources">
            Review photo sources
          </Link>
        </div>
      </header>
      <div className="card-grid-v2">
        {foods.map((food) => (
          <Link className="card-v2" href={`/foods/${food.slug}`} key={food.slug}>
            <CardPhoto label={food.nameEn} variant="food" />
            <div className="card-v2-body">
              <span className="food-chip spicy">
                {dict.common.spicy} {food.spicyLevel}/4
              </span>
              <span className="card-v2-title">{food.nameEn}</span>
              <span className="card-v2-meta">{food.summary}</span>
              <span className="card-v2-link">{dict.common.explore} →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
