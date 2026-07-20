"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { SupportedLanguage } from "@kfood/data";

import { LanguageSwitcher } from "@/components/language-switcher";

// 어드민(/admin/*)은 자체 사이드바(AdminShell)를 쓰므로 공개 사이트 헤더/푸터를 숨긴다.
function isAdmin(pathname: string | null) {
  return pathname?.startsWith("/admin") ?? false;
}

export type SiteHeaderLabels = {
  food: string;
  community: string;
  myPage: string;
  switchLanguage: string;
};

export type SiteFooterLabels = {
  tagline: string;
  reportIssue: string;
  contact: string;
  editorialPolicy: string;
  contentPolicy: string;
  disclosures: string;
  mapsNotice: string;
  privacy: string;
  terms: string;
};

export function SiteHeader({
  authLink,
  communityEnabled = true,
  locale,
  labels
}: {
  authLink: ReactNode;
  communityEnabled?: boolean;
  locale: SupportedLanguage;
  labels: SiteHeaderLabels;
}) {
  const pathname = usePathname();
  if (isAdmin(pathname)) return null;

  return (
    <header className="nav-v2">
      <div className="nav-v2-inner">
        <div className="nav-v2-logo">
          <Link className="nav-v2-wordmark" href="/">
            K-Food
          </Link>
        </div>
        <nav className="nav-v2-menu" aria-label="Primary navigation">
          <Link href="/foods">{labels.food}</Link>
          {communityEnabled ? <Link href="/feed">{labels.community}</Link> : null}
          <Link href="/mypage">{labels.myPage}</Link>
        </nav>
        <div className="nav-v2-action">
          <LanguageSwitcher ariaLabel={labels.switchLanguage} locale={locale} />
          {authLink}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ labels }: { labels: SiteFooterLabels }) {
  const pathname = usePathname();
  if (isAdmin(pathname)) return null;

  return (
    <footer className="footer-v2">
      <div className="footer-v2-brand">
        <span className="footer-v2-wordmark">K-Food</span>
        <p className="footer-v2-tagline">{labels.tagline}</p>
      </div>
      <nav className="footer-v2-nav" aria-label="Trust and policy navigation">
        <Link href="/report">{labels.reportIssue}</Link>
        <Link href="/contact">{labels.contact}</Link>
        <Link href="/editorial-policy">{labels.editorialPolicy}</Link>
        <Link href="/content-policy">{labels.contentPolicy}</Link>
        <Link href="/disclosures">{labels.disclosures}</Link>
        <Link href="/maps-notice">{labels.mapsNotice}</Link>
        <Link href="/privacy">{labels.privacy}</Link>
        <Link href="/terms">{labels.terms}</Link>
      </nav>
    </footer>
  );
}
