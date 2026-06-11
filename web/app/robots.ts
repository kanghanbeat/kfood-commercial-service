import type { MetadataRoute } from "next";

import { siteConfig } from "@kfood/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/photo-sources"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
