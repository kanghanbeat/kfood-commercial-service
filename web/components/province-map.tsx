"use client";

// 지역 목록(/regions?province=…) 상단에 보여주는 권역 확대 지도.
// 홈 지도와 달리 마커·이름이 항상 표시되고, 마커 클릭으로 지역 상세에 간다.

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { PROVINCE_PATHS } from "@/lib/korea-map-paths";
import {
  DOKDO_POINT,
  GROUP_VIEWBOXES,
  PROVINCE_GROUPS,
  REGION_MAP_POINTS,
  SUB_LABEL_POINTS,
  ULLEUNGDO_LABEL,
  groupOfProvince,
  type ProvinceGroupKey
} from "@/lib/provinces";
import type { MapMarker } from "@/components/korea-map";

const GROUP_FILL = "#D9BFFF";

export function ProvinceMap({
  groupKey,
  markers
}: {
  groupKey: ProvinceGroupKey;
  markers: MapMarker[];
}) {
  const router = useRouter();

  const paths = useMemo(
    () => PROVINCE_PATHS.filter((path) => groupOfProvince(path.id) === groupKey),
    [groupKey]
  );

  function open(slug: string) {
    router.push(`/regions/${slug}`);
  }

  return (
    <div className="province-map">
      <svg
        viewBox={GROUP_VIEWBOXES[groupKey]}
        role="img"
        aria-label={`${PROVINCE_GROUPS[groupKey].nameEn} food map`}
        className="province-map-svg"
      >
        {paths.map((path) => (
          <path key={path.id} d={path.d} className="province-map-land" fill={GROUP_FILL} />
        ))}

        {groupKey === "gyeonggi"
          ? SUB_LABEL_POINTS.map((point) => (
              <text
                key={point.label}
                x={point.x}
                y={point.y}
                className="province-map-sublabel"
                textAnchor="middle"
              >
                {point.label}
              </text>
            ))
          : null}

        {groupKey === "gyeongbuk" ? (
          <>
            <circle
              className="korea-map-islet"
              cx={DOKDO_POINT.x}
              cy={DOKDO_POINT.y}
              r={2}
            />
            <text
              className="province-map-islet-label"
              x={ULLEUNGDO_LABEL.x}
              y={ULLEUNGDO_LABEL.y}
              textAnchor="middle"
            >
              {ULLEUNGDO_LABEL.label}
            </text>
            <text
              className="province-map-islet-label"
              x={DOKDO_POINT.x}
              y={DOKDO_POINT.y + 8}
              textAnchor="middle"
            >
              {DOKDO_POINT.label}
            </text>
          </>
        ) : null}

        {markers.map((marker) => {
          const labelSide = REGION_MAP_POINTS[marker.slug]?.label ?? "right";
          return (
            <g key={marker.slug} className="province-map-marker-group">
              <circle
                className="province-map-marker"
                cx={marker.x}
                cy={marker.y}
                r={2.6}
                role="link"
                tabIndex={0}
                aria-label={marker.nameEn}
                onClick={() => open(marker.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    open(marker.slug);
                  }
                }}
              />
              {labelSide !== "hidden" ? (
                <text
                  className="province-map-marker-name"
                  x={
                    labelSide === "left"
                      ? marker.x - 5
                      : labelSide === "bottom"
                        ? marker.x
                        : marker.x + 5
                  }
                  y={labelSide === "bottom" ? marker.y + 9 : marker.y + 2}
                  textAnchor={
                    labelSide === "left"
                      ? "end"
                      : labelSide === "bottom"
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
      </svg>
    </div>
  );
}
