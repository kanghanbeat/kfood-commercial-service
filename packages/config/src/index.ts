declare const process: {
  env: Record<string, string | undefined>;
};

export const siteConfig = {
  name: "K-food Service",
  description:
    "Trusted K-food discovery for Korea travelers: regions, foods, places, and simple routes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kfood.example.com"
} as const;

export const trustLabels = [
  "editor_pick",
  "tourist_friendly",
  "near_transit",
  "local_classic",
  "beginner_friendly",
  "spicy_warning",
  "english_menu",
  "card_accepted",
  "solo_friendly",
  "sponsored",
  "affiliate_link"
] as const;

export type TrustLabel = (typeof trustLabels)[number];

export const alphaAreaSlugs = [
  "myeongdong",
  "hongdae",
  "gangnam",
  "jongno",
  "gwangjang-market"
] as const;
