import Link from "next/link";

import { getDict } from "@/lib/i18n";

// 3카테고리 IA에서 지역·장소·루트는 음식(Food) 카테고리의 하위 탭이다.
// JS 탭 금지 — 탭마다 실제 URL을 유지해 검색 색인·딥링크가 가능해야 한다
// (기획정렬-한빛대조.md §1-3).
const FOOD_TAB_HREFS = [
  { key: "dishes", href: "/foods" },
  { key: "regions", href: "/regions" },
  { key: "places", href: "/places" },
  { key: "routes", href: "/routes" }
] as const;

export type FoodTabKey = (typeof FOOD_TAB_HREFS)[number]["key"];

export async function FoodTabs({ active }: { active: FoodTabKey }) {
  const dict = await getDict();

  return (
    <nav className="food-subnav" aria-label="Food sections">
      {FOOD_TAB_HREFS.map((tab) => (
        <Link
          aria-current={tab.key === active ? "page" : undefined}
          className={
            tab.key === active ? "food-subnav-tab active" : "food-subnav-tab"
          }
          href={tab.href}
          key={tab.key}
        >
          {dict.tabs[tab.key]}
        </Link>
      ))}
    </nav>
  );
}
