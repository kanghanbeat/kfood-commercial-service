import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@kfood/config";

import { AuthHashRedirector } from "@/components/auth-hash-redirector";
import { HeaderAuthLink } from "@/components/header-auth-link";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthHashRedirector />
        <header className="site-header">
          <Link className="brand" href="/">
            K-food Service
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/feed">Feed</Link>
            <Link href="/search">Search</Link>
            <Link href="/recommend">Recommend</Link>
            <Link href="/mypage">Mypage</Link>
            <HeaderAuthLink />
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <nav aria-label="Trust and policy navigation">
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/content-policy">Content Policy</Link>
            <Link href="/disclosures">Disclosures</Link>
            <Link href="/maps-notice">Maps Notice</Link>
            <Link href="/report">Report</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
