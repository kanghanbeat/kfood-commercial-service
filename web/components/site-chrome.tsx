"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// 어드민(/admin/*)은 자체 사이드바(AdminShell)를 쓰므로 공개 사이트 헤더/푸터를 숨긴다.
function isAdmin(pathname: string | null) {
  return pathname?.startsWith("/admin") ?? false;
}

export function SiteHeader({
  authLink,
  communityEnabled = true
}: {
  authLink: ReactNode;
  communityEnabled?: boolean;
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
          <Link href="/regions">Regions</Link>
          <Link href="/foods">Foods</Link>
          <Link href="/places">Places</Link>
          <Link href="/routes">Routes</Link>
          {communityEnabled ? <Link href="/feed">Feed</Link> : null}
          <Link href="/search">Search</Link>
        </nav>
        <div className="nav-v2-action">{authLink}</div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isAdmin(pathname)) return null;

  return (
    <footer className="footer-v2">
      <nav className="footer-v2-nav" aria-label="Trust and policy navigation">
        <Link href="/report">Report an issue</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/editorial-policy">Editorial Policy</Link>
        <Link href="/content-policy">Content Policy</Link>
        <Link href="/disclosures">Disclosures</Link>
        <Link href="/maps-notice">Maps Notice</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
