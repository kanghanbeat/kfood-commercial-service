import type { Metadata } from "next";

import { siteConfig } from "@kfood/config";

// 공개 상세 페이지 공통 SEO 헬퍼.
// - 절대 URL(canonical·OG용)
// - 설명 자르기(검색 스니펫은 ~155자면 충분)
// - per-page 메타(설명·canonical·OpenGraph·Twitter 카드)
// - JSON-LD(구글이 빵부스러기·음식·장소로 인식하게 하는 숨은 표식) 빌더

export function absUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clip(text: string, max = 155): string {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function detailMetadata(opts: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
}): Metadata {
  const url = absUrl(opts.path);
  const description = clip(opts.description);
  const hasImage = Boolean(opts.imageUrl);

  return {
    title: opts.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description,
      url,
      type: "article",
      ...(hasImage ? { images: [{ url: opts.imageUrl as string }] } : {})
    },
    twitter: {
      card: hasImage ? "summary_large_image" : "summary",
      title: opts.title,
      description,
      ...(hasImage ? { images: [opts.imageUrl as string] } : {})
    }
  };
}

/** 빵부스러기(BreadcrumbList) — 검색결과에 경로가 보이게 한다. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absUrl(item.path)
    }))
  };
}
