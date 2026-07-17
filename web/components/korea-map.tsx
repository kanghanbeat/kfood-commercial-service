"use client";

// 메인 4섹션 중 ② 한국 지도 (기획정렬 §1-4·§1-5).
// 유료 지도 API 없이 통계청 시·도 경계 SVG로 구현한다.
// 가시성 원칙: 기본 화면은 9개 권역 + 이름 라벨만 보여주고,
// 마우스를 올린 권역만 확대되면서 그 권역의 주요 지역 마커가 나타난다.
// 마커는 발행된 지역 중 REGION_MAP_POINTS에 좌표가 등록된 것만 자동 렌더.

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { KOREA_MAP_VIEWBOX, PROVINCE_PATHS } from "@/lib/korea-map-paths";
import {
  DOKDO_POINT,
  GROUP_LABEL_POINTS,
  PROVINCE_GROUPS,
  REGION_MAP_POINTS,
  SUB_LABEL_POINTS,
  ULLEUNGDO_LABEL,
  groupOfProvince,
  provinceOfRegion,
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

// 색은 전부 연보라로 통일하고, 마우스를 올린 권역만 진보라(브랜드색)로
// 바뀐다 — 색칠은 CSS(.korea-map-group)에서 처리한다.
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
  // 터치 기기에서 "준비 중" 권역을 탭하면 mouseleave가 없어 툴팁이 남는다 —
  // 잠시 보여주고 자동으로 닫기 위한 타이머.
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // 호버 중인 권역은 확대 + 그 권역 마커 표시. SVG는 나중에 그린 요소가
  // 위에 오므로 확대된 권역이 이웃에 가려지지 않게 렌더 순서도 맨 뒤로.
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

  // 마커를 소속 권역별로 묶는다 — 권역 <g> 안에서 렌더해야 확대 시
  // 지도와 함께 움직이고, 호버한 권역의 마커만 보여줄 수 있다.
  const markersByGroup = useMemo(() => {
    const byGroup = new Map<
      ProvinceGroupKey,
      (MapMarker & { labelSide: "left" | "right" | "bottom" | "hidden" })[]
    >();
    for (const marker of markers) {
      const province = provinceOfRegion(marker.slug);
      const group = province ? groupOfProvince(province) : null;
      if (!group) {
        continue;
      }
      byGroup.set(group, [
        ...(byGroup.get(group) ?? []),
        { ...marker, labelSide: REGION_MAP_POINTS[marker.slug]?.label ?? "right" }
      ]);
    }
    return byGroup;
  }, [markers]);

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

  function openGroup(group: (typeof groups)[number]) {
    if (group.hasContent) {
      router.push(`/regions?province=${encodeURIComponent(group.key)}`);
    }
  }

  function handleGroupClick(
    event: React.MouseEvent,
    group: (typeof groups)[number]
  ) {
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current);
    }
    if (group.hasContent) {
      // 이동 직전 확대·툴팁 정리 (터치에선 mouseleave가 안 오므로 여기서)
      setHoveredGroup(null);
      setTooltip(null);
      openGroup(group);
      return;
    }
    // 콘텐츠 없는 권역 탭: "준비 중" 툴팁을 잠깐 보여주고 자동으로 닫는다
    showGroupTooltip(event, group);
    setHoveredGroup(group.key);
    tooltipTimer.current = setTimeout(() => {
      setHoveredGroup(null);
      setTooltip(null);
    }, 1600);
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
            onClick={(event) => handleGroupClick(event, group)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGroup(group);
              }
            }}
          >
            {group.paths.map((path) => (
              <path key={path.id} d={path.d} />
            ))}

            {/* 수도권 소라벨 — 서울·인천은 항상 이름이 보이게 (그룹과 함께 확대) */}
            {group.key === "gyeonggi"
              ? SUB_LABEL_POINTS.map((point) => (
                  <text
                    key={point.label}
                    x={point.x}
                    y={point.y}
                    className="korea-map-sublabel"
                    textAnchor="middle"
                  >
                    {point.label}
                  </text>
                ))
              : null}

            {/* 주요 관광 지역 마커 — 이 권역을 호버했을 때만 나타난다 */}
            {(markersByGroup.get(group.key) ?? []).map((marker) => {
              const visible = group.key === hoveredGroup;
              return (
                <g
                  key={marker.slug}
                  className={`korea-map-marker-group${visible ? " visible" : ""}`}
                >
                  <circle
                    className="korea-map-marker"
                    cx={marker.x}
                    cy={marker.y}
                    r={4.5}
                    role="link"
                    tabIndex={visible ? 0 : -1}
                    aria-label={marker.nameEn}
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/regions/${marker.slug}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        router.push(`/regions/${marker.slug}`);
                      }
                    }}
                  />
                  {marker.labelSide !== "hidden" ? (
                    <text
                      className="korea-map-marker-name"
                      x={
                        marker.labelSide === "left"
                          ? marker.x - 8
                          : marker.labelSide === "bottom"
                            ? marker.x
                            : marker.x + 8
                      }
                      y={marker.labelSide === "bottom" ? marker.y + 14 : marker.y + 3}
                      textAnchor={
                        marker.labelSide === "left"
                          ? "end"
                          : marker.labelSide === "bottom"
                            ? "middle"
                            : "start"
                      }
                    >
                      {marker.nameEn}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ))}

        {/* 울릉도·독도 — 항상 표시 (울릉도 지형은 경북 path에 포함, 독도는 점으로) */}
        <circle
          className="korea-map-islet"
          cx={DOKDO_POINT.x}
          cy={DOKDO_POINT.y}
          r={2.4}
        />
        <text
          className="korea-map-islet-label"
          x={ULLEUNGDO_LABEL.x}
          y={ULLEUNGDO_LABEL.y}
          textAnchor="middle"
        >
          {ULLEUNGDO_LABEL.label}
        </text>
        <text
          className="korea-map-islet-label"
          x={DOKDO_POINT.x}
          y={DOKDO_POINT.y + 14}
          textAnchor="middle"
        >
          {DOKDO_POINT.label}
        </text>

        {/* 권역 이름 라벨 — 항상 표시, 호버 중인 권역만 숨김(마커와 겹침 방지) */}
        {(Object.keys(GROUP_LABEL_POINTS) as ProvinceGroupKey[]).map((key) => {
          const point = GROUP_LABEL_POINTS[key];
          const hasContent = groups.find((g) => g.key === key)?.hasContent;
          return (
            <text
              key={key}
              x={point.x}
              y={point.y}
              className={`korea-map-label${hasContent ? " on-color" : ""}${
                key === hoveredGroup ? " dimmed" : ""
              }`}
              textAnchor="middle"
            >
              {point.label}
            </text>
          );
        })}
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
