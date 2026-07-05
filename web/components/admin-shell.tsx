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
  { key: "content", href: "/admin/content", label: "콘텐츠 제작", desc: "기획 · 촬영" },
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
    desc: "신고 · 감사 · 회원"
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
          <Link className="admin-sidebar-signout" href="/admin/logout">
            로그아웃
          </Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

export function AdminTabs({
  basePath,
  current,
  tabs
}: {
  basePath: string;
  current: string;
  tabs: { key: string; label: string }[];
}) {
  return (
    <nav className="admin-tabs" aria-label="Section tabs">
      {tabs.map((tab) => (
        <Link
          className={tab.key === current ? "admin-tab active" : "admin-tab"}
          href={`${basePath}?tab=${tab.key}`}
          key={tab.key}
          aria-current={tab.key === current ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
