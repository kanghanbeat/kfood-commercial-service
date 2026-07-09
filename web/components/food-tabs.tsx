import Link from "next/link";

// 3카테고리 IA에서 지역·장소·루트는 음식(Food) 카테고리의 하위 탭이다.
// JS 탭 금지 — 탭마다 실제 URL을 유지해 검색 색인·딥링크가 가능해야 한다
// (기획정렬-한빛대조.md §1-3).
const FOOD_TABS = [
  { key: "dishes", label: "Dishes", href: "/foods" },
  { key: "regions", label: "Regions", href: "/regions" },
  { key: "places", label: "Places", href: "/places" },
  { key: "routes", label: "Routes", href: "/routes" }
] as const;

export type FoodTabKey = (typeof FOOD_TABS)[number]["key"];

export function FoodTabs({ active }: { active: FoodTabKey }) {
  return (
    <nav className="food-subnav" aria-label="Food sections">
      {FOOD_TABS.map((tab) => (
        <Link
          aria-current={tab.key === active ? "page" : undefined}
          className={
            tab.key === active ? "food-subnav-tab active" : "food-subnav-tab"
          }
          href={tab.href}
          key={tab.key}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
