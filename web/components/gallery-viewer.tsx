"use client";

import { useState } from "react";

import type { ContentImage } from "@kfood/data";

// 공개 상세 페이지 사진 갤러리.
// 위: 큰 메인 사진(원본 비율 그대로, 잘리지 않음).
// 아래: 작은 썸네일을 가로로 스크롤. 누르면 메인이 바뀐다.

export function GalleryViewer({
  images,
  title
}: {
  images: ContentImage[];
  title: string;
}) {
  const [activeId, setActiveId] = useState<string | undefined>(images[0]?.id);
  const active = images.find((image) => image.id === activeId) ?? images[0];

  if (!active) {
    return null;
  }

  return (
    <section aria-label={`${title} 사진`} className="pg">
      <div className="pg-main">
        {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={active.altText ?? title}
          className="pg-main-img"
          src={active.url}
        />
      </div>

      {images.length > 1 ? (
        <ul className="pg-thumbs">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                aria-label={`사진 ${index + 1} 보기`}
                className={image.id === active.id ? "pg-thumb active" : "pg-thumb"}
                onClick={() => setActiveId(image.id)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={image.altText ?? `${title} 사진 ${index + 1}`}
                  loading="lazy"
                  src={image.url}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
