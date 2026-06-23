import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@kfood/config";

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
        <header className="site-header">
          <Link className="brand" href="/">
            K-food Service
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/regions">Regions</Link>
            <Link href="/foods">Foods</Link>
            <Link href="/places">Places</Link>
            <Link href="/routes">Routes</Link>
            <Link href="/report">Report</Link>
            <Link href="/contact">Contact</Link>
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
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
