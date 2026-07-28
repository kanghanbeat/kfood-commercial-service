import Link from "next/link";
import type { ReactNode } from "react";

import type { PublicationStatus } from "@kfood/data";

import type { AdminSession } from "@/lib/admin-auth";

export type AdminMenuKey = "insight" | "content" | "manage" | "operations";

// 발행 상태 한글 라벨. DB에는 영문 값(draft 등)이 그대로 저장됨 — 화면 표시만 한글.
export const publicationStatusLabels: Record<PublicationStatus, string> = {
  draft: "초안",
  published: "공개",
  hidden: "숨김",
  archived: "보관"
};

const menuItems: {
  key: AdminMenuKey;
  href: string;
  label: string;
  desc: string;
}[] = [
  { key: "insight", href: "/admin", label: "인사이트", desc: "요약 · 트렌드" },
  { key: "content", href: "/admin/content", label: "콘텐츠 제작", desc: "기획 · 제작" },
  {
    key: "manage",
    href: "/admin/manage",
    label: "콘텐츠 관리",
    desc: "지역 · 음식 · 장소 · 루트"
  },
  {
    key: "operations",
    href: "/admin/operations",
    label: "운영",
    desc: "신고 · 감사 · 회원 · 게시물 · 댓글 · 설정"
  }
];

export function AdminShell({
  active,
  session,
  children
}: {
  active: AdminMenuKey;
  session: AdminSession;
  children: ReactNode;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-sidebar-badge">K</span>
          <div className="admin-sidebar-brand">
            <strong>K-Food Admin</strong>
            <span>발견 → 기획 → 발행</span>
          </div>
        </div>
        <nav className="admin-menu" aria-label="Admin navigation">
          {menuItems.map((item) => (
            <Link
              className={
                item.key === active ? "admin-menu-item active" : "admin-menu-item"
              }
              href={item.href}
              key={item.key}
              // 어드민 링크는 미리 불러오지 않는다. 여러 요청이 동시에 토큰 갱신을
              // 시도하면 리프레시 토큰이 서로를 무효화해 세션이 끊긴다.
              prefetch={false}
              aria-current={item.key === active ? "page" : undefined}
            >
              <span className="admin-menu-label">{item.label}</span>
              <span className="admin-menu-desc">{item.desc}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-sidebar-footer-label">현재 권한</span>
          <span className="admin-sidebar-footer-value">
            {session.email ?? session.userId} · {session.role} 활성 계정 · RLS 적용
          </span>
          <form action="/admin/logout" method="post">
            <button className="admin-sidebar-signout" type="submit">
              로그아웃
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

export function AdminTabs({
  basePath,
  current,
  tabs,
  query
}: {
  basePath: string;
  current: string;
  tabs: { key: string; label: string }[];
  // 탭을 바꿔도 유지할 추가 쿼리(예: 인사이트의 선택 주차)
  query?: Record<string, string>;
}) {
  function href(tabKey: string) {
    const search = new URLSearchParams({ tab: tabKey });
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value) search.set(key, value);
      }
    }
    return `${basePath}?${search.toString()}`;
  }

  return (
    <nav className="admin-tabs" aria-label="Section tabs">
      {tabs.map((tab) => (
        <Link
          className={tab.key === current ? "admin-tab active" : "admin-tab"}
          href={href(tab.key)}
          key={tab.key}
          prefetch={false}
          aria-current={tab.key === current ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
