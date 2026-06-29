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
            <HeaderAuthLink />
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div className="footer-grid" aria-label="Trust and policy navigation">
            <nav aria-labelledby="footer-support">
              <h2 id="footer-support">Support</h2>
              <Link href="/report">Report</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <nav aria-labelledby="footer-trust">
              <h2 id="footer-trust">Trust</h2>
              <Link href="/editorial-policy">Editorial Policy</Link>
              <Link href="/content-policy">Content Policy</Link>
              <Link href="/disclosures">Disclosures</Link>
              <Link href="/maps-notice">Maps Notice</Link>
            </nav>
            <nav aria-labelledby="footer-legal">
              <h2 id="footer-legal">Legal</h2>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
