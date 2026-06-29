import type { MetadataRoute } from "next";

import {
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes
} from "@kfood/data";
import { siteConfig } from "@kfood/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [foods, places, regions, routes] = await Promise.all([
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);
  const now = new Date();
  const staticRoutes = [
    "",
    "/feed",
    "/search",
    "/recommend",
    "/regions",
    "/foods",
    "/places",
    "/routes",
    "/report",
    "/contact",
    "/editorial-policy",
    "/content-policy",
    "/disclosures",
    "/maps-notice",
    "/privacy",
    "/terms"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now
    })),
    ...regions.map((region) => ({
      url: `${siteConfig.url}/regions/${region.slug}`,
      lastModified: now
    })),
    ...foods.map((food) => ({
      url: `${siteConfig.url}/foods/${food.slug}`,
      lastModified: now
    })),
    ...places.map((place) => ({
      url: `${siteConfig.url}/places/${place.slug}`,
      lastModified: now
    })),
    ...routes.map((route) => ({
      url: `${siteConfig.url}/routes/${route.slug}`,
      lastModified: now
    }))
  ];
}
