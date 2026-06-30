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
            </nav>
            <div className="nav-v2-action">
              <HeaderAuthLink />
            </div>
          </div>
        </header>
        {children}
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
      </body>
    </html>
  );
}
