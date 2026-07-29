import { ImageResponse } from "next/og";

import { siteConfig } from "@kfood/config";

// 사이트 기본 공유 썸네일(1200×630). 자기 사진이 있는 상세 페이지는 그 사진으로 덮어쓰고,
// 사진이 없는 페이지(홈·목록·사진 미등록 항목)는 이 브랜드 이미지가 공유 미리보기에 뜬다.

export const alt = "K-Food — Discover Korea through its food";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #8500FF 0%, #FF5E00 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, opacity: 0.9 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: 24
          }}
        >
          <span>Discover Korea</span>
          <span>through its food</span>
        </div>
        <div style={{ fontSize: 34, marginTop: 32, opacity: 0.92 }}>
          Regions · Foods · Places · Routes for travelers
        </div>
      </div>
    ),
    { ...size }
  );
}
