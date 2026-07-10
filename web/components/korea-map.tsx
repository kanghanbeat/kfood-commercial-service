"use client";

// 메인 4섹션 중 ② 한국 지도 (기획정렬 §1-4·§1-5).
// 유료 지도 API 없이 통계청 시·도 경계 SVG로 구현 — 색은 콘텐츠 밀도
// (연결된 지역·음식 수)에 따라 브랜드 퍼플 농도로 칠한다.
// 클릭하면 해당 시·도의 지역 목록(/regions?province=)으로 이동한다.

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { KOREA_MAP_VIEWBOX, PROVINCE_PATHS } from "@/lib/korea-map-paths";
import { PROVINCES, isProvinceKey } from "@/lib/provinces";

export type ProvinceStats = Record<
  string,
  { regionCount: number; foodCount: number }
>;

type TooltipState = {
  x: number;
  y: number;
  nameEn: string;
  nameKo: string;
  representativeFood: string | null;
  regionCount: number;
  foodCount: number;
};

// 콘텐츠 밀도(음식 수) → 채움색. 0이면 중립 회색(클릭 불가 시·도).
const EMPTY_FILL = "#EDE9F2";
const DENSITY_FILLS = ["#D9BFFF", "#B57BFF", "#8500FF"];

function fillFor(foodCount: number) {
  if (foodCount <= 0) {
    return EMPTY_FILL;
  }
  if (foodCount <= 5) {
    return DENSITY_FILLS[0];
  }
  if (foodCount <= 15) {
    return DENSITY_FILLS[1];
  }
  return DENSITY_FILLS[2];
}

export function KoreaMap({
  stats,
  labels
}: {
  stats: ProvinceStats;
  labels: { areas: string; dishes: string; comingSoon: string; hint: string };
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // 호버 중인 시·도는 살짝 확대해서 보여준다. SVG는 나중에 그린 조각이 위에
  // 올라오므로, 확대된 조각이 이웃에 가려지지 않게 렌더 순서도 맨 뒤로 보낸다.
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const provinces = useMemo(
    () =>
      PROVINCE_PATHS.map((path) => {
        const info = isProvinceKey(path.id) ? PROVINCES[path.id] : null;
        const stat = stats[path.id] ?? { regionCount: 0, foodCount: 0 };
        return {
          ...path,
          nameEn: info?.nameEn ?? path.id,
          representativeFood: info?.representativeFood ?? null,
          regionCount: stat.regionCount,
          foodCount: stat.foodCount,
          hasContent: stat.regionCount > 0
        };
      }),
    [stats]
  );

  function showTooltip(
    event: React.MouseEvent,
    province: (typeof provinces)[number]
  ) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    setTooltip({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      nameEn: province.nameEn,
      nameKo: province.nameKo,
      representativeFood: province.representativeFood,
      regionCount: province.regionCount,
      foodCount: province.foodCount
    });
  }

  function open(province: (typeof provinces)[number]) {
    if (province.hasContent) {
      router.push(`/regions?province=${encodeURIComponent(province.id)}`);
    }
  }

  const hovered = provinces.find((province) => province.id === hoveredId);
  const orderedProvinces = hovered
    ? [...provinces.filter((province) => province.id !== hoveredId), hovered]
    : provinces;

  return (
    <div className="korea-map" ref={containerRef}>
      <svg
        viewBox={KOREA_MAP_VIEWBOX}
        role="img"
        aria-label="Korea food map by province"
        className="korea-map-svg"
      >
        {orderedProvinces.map((province) => (
          <path
            key={province.id}
            d={province.d}
            className={`korea-map-province${province.hasContent ? " active" : ""}${
              province.id === hoveredId ? " hovered" : ""
            }`}
            fill={fillFor(province.foodCount)}
            role={province.hasContent ? "link" : undefined}
            tabIndex={province.hasContent ? 0 : -1}
            aria-label={`${province.nameEn}${
              province.hasContent
                ? ` — ${province.regionCount} ${labels.areas}, ${province.foodCount} ${labels.dishes}`
                : ` — ${labels.comingSoon}`
            }`}
            onMouseEnter={() => setHoveredId(province.id)}
            onMouseMove={(event) => showTooltip(event, province)}
            onMouseLeave={() => {
              setHoveredId(null);
              setTooltip(null);
            }}
            onFocus={() => setHoveredId(province.id)}
            onBlur={() => setHoveredId(null)}
            onClick={() => open(province)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open(province);
              }
            }}
          />
        ))}
      </svg>

      {tooltip ? (
        <div
          className="korea-map-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
          aria-hidden="true"
        >
          <span className="korea-map-tooltip-name">
            {tooltip.nameEn} <em>{tooltip.nameKo}</em>
          </span>
          {tooltip.regionCount > 0 ? (
            <>
              {tooltip.representativeFood ? (
                <span className="korea-map-tooltip-food">
                  {tooltip.representativeFood}
                </span>
              ) : null}
              <span className="korea-map-tooltip-meta">
                {tooltip.regionCount} {labels.areas} · {tooltip.foodCount}{" "}
                {labels.dishes}
              </span>
            </>
          ) : (
            <span className="korea-map-tooltip-meta">{labels.comingSoon}</span>
          )}
        </div>
      ) : null}

      <p className="korea-map-hint">{labels.hint}</p>
    </div>
  );
}
