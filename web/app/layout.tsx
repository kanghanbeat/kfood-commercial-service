import type { Metadata } from "next";
import type { ReactNode } from "react";

import { isCommunityEnabled } from "@kfood/data";
import { siteConfig } from "@kfood/config";

import { AuthHashRedirector } from "@/components/auth-hash-redirector";
import { HeaderAuthLink } from "@/components/header-auth-link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const communityEnabled = await isCommunityEnabled();

  return (
    <html lang="en">
      <body>
        <AuthHashRedirector />
        <SiteHeader communityEnabled={communityEnabled} authLink={<HeaderAuthLink />} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
