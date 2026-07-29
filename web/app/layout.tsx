import type { Metadata } from "next";
import type { ReactNode } from "react";

import { isCommunityEnabled } from "@kfood/data";
import { siteConfig } from "@kfood/config";

import { AuthHashRedirector } from "@/components/auth-hash-redirector";
import { HeaderAuthLink } from "@/components/header-auth-link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getDict, getLocale } from "@/lib/i18n";

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
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [communityEnabled, locale, dict] = await Promise.all([
    isCommunityEnabled(),
    getLocale(),
    getDict()
  ]);

  return (
    <html lang={locale}>
      <body>
        <AuthHashRedirector />
        <SiteHeader
          authLink={<HeaderAuthLink />}
          communityEnabled={communityEnabled}
          labels={{
            food: dict.nav.food,
            community: dict.nav.community,
            myPage: dict.nav.myPage,
            switchLanguage: dict.nav.switchLanguage
          }}
          locale={locale}
        />
        {children}
        <SiteFooter labels={dict.footer} />
      </body>
    </html>
  );
}
