"use client";

// 메인 4섹션 중 ② 한국 지도 (기획정렬 §1-4·§1-5).
// 유료 지도 API 없이 통계청 시·도 경계 SVG로 구현한다.
// - 광역시는 소속 도에 합쳐 9개 권역(수도권·강원·충북·충남·전북·전남·경북·경남·제주)
//   단위로 호버·색칠·클릭이 동작한다.
// - 관광으로 많이 가는 지역은 지도 위 마커(점)로 표시 — 발행된 지역 중
//   REGION_MAP_POINTS에 좌표가 등록된 것만 자동으로 그려진다.

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { KOREA_MAP_VIEWBOX, PROVINCE_PATHS } from "@/lib/korea-map-paths";
import {
  PROVINCE_GROUPS,
  groupOfProvince,
  type ProvinceGroupKey
} from "@/lib/provinces";

export type ProvinceStats = Record<
  string,
  { regionCount: number; foodCount: number }
>;

export type MapMarker = {
  slug: string;
  nameEn: string;
  x: number;
  y: number;
};

type TooltipState = {
  x: number;
  y: number;
  title: string;
  subtitle: string | null;
  food: string | null;
  meta: string | null;
};

// 콘텐츠 밀도(권역 음식 수) → 채움색. 0이면 중립 회색(클릭 불가).
const EMPTY_FILL = "#EDE9F2";
const DENSITY_FILLS = ["#D9BFFF", "#B57BFF", "#8500FF"];

function fillFor(foodCount: number) {
  if (foodCount <= 0) {
    return EMPTY_FILL;
  }
  if (foodCount <= 10) {
    return DENSITY_FILLS[0];
  }
  if (foodCount <= 30) {
    return DENSITY_FILLS[1];
  }
  return DENSITY_FILLS[2];
}

export function KoreaMap({
  stats,
  markers,
  labels
}: {
  stats: ProvinceStats;
  markers: MapMarker[];
  labels: { areas: string; dishes: string; comingSoon: string; hint: string };
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // 호버 중인 권역은 살짝 확대. SVG는 나중에 그린 요소가 위에 오므로
  // 확대된 권역이 이웃에 가려지지 않게 렌더 순서도 맨 뒤로 보낸다.
  const [hoveredGroup, setHoveredGroup] = useState<ProvinceGroupKey | null>(null);

  const groups = useMemo(() => {
    const paths = new Map<ProvinceGroupKey, typeof PROVINCE_PATHS>();
    for (const path of PROVINCE_PATHS) {
      const key = groupOfProvince(path.id);
      if (!key) {
        continue;
      }
      paths.set(key, [...(paths.get(key) ?? []), path]);
    }

    return (Object.keys(PROVINCE_GROUPS) as ProvinceGroupKey[]).map((key) => {
      const info = PROVINCE_GROUPS[key];
      const regionCount = info.memberIds.reduce(
        (sum, member) => sum + (stats[member]?.regionCount ?? 0),
        0
      );
      const foodCount = info.memberIds.reduce(
        (sum, member) => sum + (stats[member]?.foodCount ?? 0),
        0
      );
      return {
        key,
        nameEn: info.nameEn,
        nameKo: info.nameKo,
        representativeFood: info.representativeFood,
        paths: paths.get(key) ?? [],
        regionCount,
        foodCount,
        hasContent: regionCount > 0
      };
    });
  }, [stats]);

  function tooltipPosition(event: React.MouseEvent) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) {
      return null;
    }
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function showGroupTooltip(
    event: React.MouseEvent,
    group: (typeof groups)[number]
  ) {
    const position = tooltipPosition(event);
    if (!position) {
      return;
    }
    setTooltip({
      ...position,
      title: group.nameEn,
      subtitle: group.nameKo,
      food: group.hasContent ? group.representativeFood : null,
      meta: group.hasContent
        ? `${group.regionCount} ${labels.areas} · ${group.foodCount} ${labels.dishes}`
        : labels.comingSoon
    });
  }

  function showMarkerTooltip(event: React.MouseEvent, marker: MapMarker) {
    const position = tooltipPosition(event);
    if (!position) {
      return;
    }
    setTooltip({
      ...position,
      title: marker.nameEn,
      subtitle: null,
      food: null,
      meta: null
    });
  }

  function openGroup(group: (typeof groups)[number]) {
    if (group.hasContent) {
      router.push(`/regions?province=${encodeURIComponent(group.key)}`);
    }
  }

  const hovered = groups.find((group) => group.key === hoveredGroup);
  const orderedGroups = hovered
    ? [...groups.filter((group) => group.key !== hoveredGroup), hovered]
    : groups;

  return (
    <div className="korea-map" ref={containerRef}>
      <svg
        viewBox={KOREA_MAP_VIEWBOX}
        role="img"
        aria-label="Korea food map by province"
        className="korea-map-svg"
      >
        {orderedGroups.map((group) => (
          <g
            key={group.key}
            className={`korea-map-group${group.hasContent ? " active" : ""}${
              group.key === hoveredGroup ? " hovered" : ""
            }`}
            role={group.hasContent ? "link" : undefined}
            tabIndex={group.hasContent ? 0 : -1}
            aria-label={`${group.nameEn}${
              group.hasContent
                ? ` — ${group.regionCount} ${labels.areas}, ${group.foodCount} ${labels.dishes}`
                : ` — ${labels.comingSoon}`
            }`}
            onMouseEnter={() => setHoveredGroup(group.key)}
            onMouseMove={(event) => showGroupTooltip(event, group)}
            onMouseLeave={() => {
              setHoveredGroup(null);
              setTooltip(null);
            }}
            onFocus={() => setHoveredGroup(group.key)}
            onBlur={() => setHoveredGroup(null)}
            onClick={() => openGroup(group)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGroup(group);
              }
            }}
          >
            {group.paths.map((path) => (
              <path key={path.id} d={path.d} fill={fillFor(group.foodCount)} />
            ))}
          </g>
        ))}

        {/* 주요 관광 지역 마커 — 발행된 지역 + 좌표 등록분만 자동 표시 */}
        {markers.map((marker) => (
          <circle
            key={marker.slug}
            className="korea-map-marker"
            cx={marker.x}
            cy={marker.y}
            r={5}
            role="link"
            tabIndex={0}
            aria-label={marker.nameEn}
            onMouseMove={(event) => showMarkerTooltip(event, marker)}
            onMouseLeave={() => setTooltip(null)}
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/regions/${marker.slug}`);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/regions/${marker.slug}`);
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
            {tooltip.title}
            {tooltip.subtitle ? <em>{tooltip.subtitle}</em> : null}
          </span>
          {tooltip.food ? (
            <span className="korea-map-tooltip-food">{tooltip.food}</span>
          ) : null}
          {tooltip.meta ? (
            <span className="korea-map-tooltip-meta">{tooltip.meta}</span>
          ) : null}
        </div>
      ) : null}

      <p className="korea-map-hint">{labels.hint}</p>
    </div>
  );
}
