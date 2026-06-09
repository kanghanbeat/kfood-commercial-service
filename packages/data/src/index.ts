import { createClient } from "@supabase/supabase-js";

export type AlphaRegion = {
  slug: string;
  nameEn: string;
  primaryAudience: string;
  kfoodIdentity: string;
  routeTheme: string;
  intro: string;
  bestForTags: string[];
};

export const alphaRegions: AlphaRegion[] = [
  {
    slug: "myeongdong",
    nameEn: "Myeongdong",
    primaryAudience: "First-time tourists",
    kfoodIdentity: "Street food, beginner-friendly K-food, familiar BBQ",
    routeTheme: "Street food night route",
    intro:
      "A compact first-stop area for travelers who want easy snacks, late shopping, and low-friction K-food choices.",
    bestForTags: ["first visit", "street snacks", "shopping"]
  },
  {
    slug: "hongdae",
    nameEn: "Hongdae",
    primaryAudience: "Gen Z and solo travelers",
    kfoodIdentity: "Trendy cafes, casual pubs, chimaek, budget eats",
    routeTheme: "Youth nightlife and casual food route",
    intro:
      "A youth-heavy area for casual restaurants, cafes, fried chicken, late meals, and flexible solo-friendly stops.",
    bestForTags: ["nightlife", "solo", "budget"]
  },
  {
    slug: "gangnam",
    nameEn: "Gangnam",
    primaryAudience: "Premium seekers",
    kfoodIdentity: "Modern K-food, clean K-BBQ, trend-driven dining",
    routeTheme: "Trendy and polished dining route",
    intro:
      "A polished dining district for travelers who prefer cleaner interiors, reservations, and modern Korean food formats.",
    bestForTags: ["premium", "bbq", "modern"]
  },
  {
    slug: "jongno",
    nameEn: "Jongno",
    primaryAudience: "Culture and history travelers",
    kfoodIdentity: "Traditional soups, pajeon, old Seoul dishes",
    routeTheme: "Old Seoul alley food walk",
    intro:
      "A historic center for old Seoul flavors, market alleys, traditional dishes, and culture-linked meal routes.",
    bestForTags: ["traditional", "history", "walkable"]
  },
  {
    slug: "gwangjang-market",
    nameEn: "Gwangjang Market",
    primaryAudience: "Street-food adventurers",
    kfoodIdentity: "Bindaetteok, mayak kimbap, market classics",
    routeTheme: "Market food exploration route",
    intro:
      "A direct market-food experience for visitors who want classic stalls, quick bites, and a lively Seoul food scene.",
    bestForTags: ["market", "street food", "classic"]
  }
];

export type AlphaFood = {
  slug: string;
  nameEn: string;
  nameKo: string;
  regionSlugs: string[];
  summary: string;
  tasteProfile: string;
  spicyLevel: 0 | 1 | 2 | 3 | 4;
  beginnerNote: string;
};

export const alphaFoods: AlphaFood[] = [
  {
    slug: "tteokbokki",
    nameEn: "Tteokbokki",
    nameKo: "Tteokbokki",
    regionSlugs: ["myeongdong", "gwangjang-market", "hongdae"],
    summary: "Chewy rice cakes in a sweet-spicy gochujang sauce.",
    tasteProfile: "sweet, spicy, chewy",
    spicyLevel: 3,
    beginnerNote: "Ask for mild sauce if available and pair it with fried snacks."
  },
  {
    slug: "korean-bbq",
    nameEn: "Korean BBQ",
    nameKo: "Gogi gui",
    regionSlugs: ["myeongdong", "gangnam", "hongdae"],
    summary: "Grilled meat served with lettuce wraps, sauces, and side dishes.",
    tasteProfile: "savory, smoky, shareable",
    spicyLevel: 1,
    beginnerNote: "Good for groups; confirm whether staff help with grilling."
  },
  {
    slug: "bindaetteok",
    nameEn: "Bindaetteok",
    nameKo: "Bindaetteok",
    regionSlugs: ["gwangjang-market", "jongno"],
    summary: "Crisp mung-bean pancake often found in traditional markets.",
    tasteProfile: "crispy, nutty, savory",
    spicyLevel: 0,
    beginnerNote: "Usually easy for first-timers and works well as a shared snack."
  },
  {
    slug: "samgyetang",
    nameEn: "Samgyetang",
    nameKo: "Samgyetang",
    regionSlugs: ["jongno"],
    summary: "Ginseng chicken soup served as a warming traditional meal.",
    tasteProfile: "mild, herbal, comforting",
    spicyLevel: 0,
    beginnerNote: "A good choice when you want a non-spicy Korean dish."
  },
  {
    slug: "chimaek",
    nameEn: "Chimaek",
    nameKo: "Chicken and beer",
    regionSlugs: ["hongdae", "gangnam"],
    summary: "Korean fried chicken paired with beer or soft drinks.",
    tasteProfile: "crispy, saucy, casual",
    spicyLevel: 2,
    beginnerNote: "Order half-and-half flavors when you want to compare sauces."
  }
];

export type AlphaPlace = {
  slug: string;
  nameEn: string;
  regionSlug: string;
  foodSlugs: string[];
  editorialNote: string;
  trustTags: string[];
  cautionTags: string[];
  lastVerifiedLabel: string;
};

export const alphaPlaces: AlphaPlace[] = [
  {
    slug: "myeongdong-street-food-loop",
    nameEn: "Myeongdong Street Food Loop",
    regionSlug: "myeongdong",
    foodSlugs: ["tteokbokki"],
    editorialNote:
      "A beginner-friendly evening walk where the value is variety and convenience rather than one destination restaurant.",
    trustTags: ["tourist friendly", "near transit"],
    cautionTags: ["prices vary by stall"],
    lastVerifiedLabel: "Editorial placeholder"
  },
  {
    slug: "hongdae-chimaek-night",
    nameEn: "Hongdae Chimaek Night",
    regionSlug: "hongdae",
    foodSlugs: ["chimaek"],
    editorialNote:
      "Best used as a casual late-meal option after cafes, shopping, or music venues.",
    trustTags: ["solo friendly", "late hours"],
    cautionTags: ["wait times on weekends"],
    lastVerifiedLabel: "Editorial placeholder"
  },
  {
    slug: "gangnam-polished-bbq",
    nameEn: "Gangnam Polished BBQ",
    regionSlug: "gangnam",
    foodSlugs: ["korean-bbq"],
    editorialNote:
      "A cleaner, reservation-friendly BBQ direction for travelers who want less friction.",
    trustTags: ["card accepted", "premium"],
    cautionTags: ["confirm reservation"],
    lastVerifiedLabel: "Editorial placeholder"
  },
  {
    slug: "jongno-samgyetang-stop",
    nameEn: "Jongno Samgyetang Stop",
    regionSlug: "jongno",
    foodSlugs: ["samgyetang"],
    editorialNote:
      "A mild traditional meal direction that pairs well with palace or old-city walking routes.",
    trustTags: ["traditional", "non spicy"],
    cautionTags: ["peak lunch queue"],
    lastVerifiedLabel: "Editorial placeholder"
  },
  {
    slug: "gwangjang-bindaetteok-row",
    nameEn: "Gwangjang Bindaetteok Row",
    regionSlug: "gwangjang-market",
    foodSlugs: ["bindaetteok"],
    editorialNote:
      "A market-first experience where visitors should expect energy, crowds, and quick seating.",
    trustTags: ["local classic", "market"],
    cautionTags: ["crowded"],
    lastVerifiedLabel: "Editorial placeholder"
  }
];

export type AlphaRoute = {
  slug: string;
  title: string;
  regionSlug: string;
  summary: string;
  placeSlugs: string[];
  estimatedDuration: string;
};

export const alphaRoutes: AlphaRoute[] = [
  {
    slug: "myeongdong-first-night",
    title: "Myeongdong First Night",
    regionSlug: "myeongdong",
    summary: "A low-risk first evening route for snacks, shopping, and easy transit.",
    placeSlugs: ["myeongdong-street-food-loop"],
    estimatedDuration: "90 minutes"
  },
  {
    slug: "old-seoul-market-walk",
    title: "Old Seoul Market Walk",
    regionSlug: "gwangjang-market",
    summary: "A classic market-food route for crispy pancakes and quick bites.",
    placeSlugs: ["gwangjang-bindaetteok-row"],
    estimatedDuration: "60 minutes"
  }
];

export function getRegion(slug: string) {
  return alphaRegions.find((region) => region.slug === slug);
}

export function getFood(slug: string) {
  return alphaFoods.find((food) => food.slug === slug);
}

export function getPlace(slug: string) {
  return alphaPlaces.find((place) => place.slug === slug);
}

export function getRegionFoods(regionSlug: string) {
  return alphaFoods.filter((food) => food.regionSlugs.includes(regionSlug));
}

export function getRegionPlaces(regionSlug: string) {
  return alphaPlaces.filter((place) => place.regionSlug === regionSlug);
}

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function createPublicClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false
    }
  });
}

type RegionRow = {
  slug: string;
  name_en: string;
  intro: string;
  best_for_tags: string[];
};

type FoodRow = {
  slug: string;
  name_en: string;
  name_ko: string;
  description: string;
  taste_profile: string | null;
  spicy_level: 0 | 1 | 2 | 3 | 4;
  beginner_note: string | null;
};

type PlaceRow = {
  slug: string;
  name_en: string;
  editorial_note: string;
  trust_tags: string[];
  caution_tags: string[];
  last_verified_at: string | null;
  is_sponsored: boolean;
  affiliate_url: string | null;
  sponsorship_note: string | null;
  regions: { slug: string } | null;
};

type RouteGuideRow = {
  slug: string;
  title: string;
  summary: string;
  estimated_duration: string | null;
  regions: { slug: string } | null;
};

function mapRegion(row: RegionRow): AlphaRegion {
  return {
    slug: row.slug,
    nameEn: row.name_en,
    primaryAudience: row.best_for_tags[0] ?? "K-food travelers",
    kfoodIdentity: row.best_for_tags.join(", "),
    routeTheme: "Curated K-food route",
    intro: row.intro,
    bestForTags: row.best_for_tags
  };
}

function mapFood(row: FoodRow): AlphaFood {
  return {
    slug: row.slug,
    nameEn: row.name_en,
    nameKo: row.name_ko,
    regionSlugs: [],
    summary: row.description,
    tasteProfile: row.taste_profile ?? "editorial guide",
    spicyLevel: row.spicy_level,
    beginnerNote: row.beginner_note ?? "Check local notes before ordering."
  };
}

function mapPlace(row: PlaceRow): AlphaPlace {
  return {
    slug: row.slug,
    nameEn: row.name_en,
    regionSlug: row.regions?.slug ?? "seoul",
    foodSlugs: [],
    editorialNote: row.editorial_note,
    trustTags: [
      ...row.trust_tags,
      ...(row.is_sponsored ? ["sponsored"] : []),
      ...(row.affiliate_url ? ["affiliate link"] : [])
    ],
    cautionTags: row.caution_tags,
    lastVerifiedLabel: row.last_verified_at
      ? `Last verified ${row.last_verified_at}`
      : "Verification pending"
  };
}

function mapRouteGuide(row: RouteGuideRow): AlphaRoute {
  return {
    slug: row.slug,
    title: row.title,
    regionSlug: row.regions?.slug ?? "seoul",
    summary: row.summary,
    placeSlugs: [],
    estimatedDuration: row.estimated_duration ?? "Flexible"
  };
}

export async function getPublishedRegions() {
  const supabase = createPublicClient();

  if (!supabase) {
    return alphaRegions;
  }

  const { data, error } = await supabase
    .from("regions")
    .select("slug, name_en, intro, best_for_tags")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return alphaRegions;
  }

  return data.map(mapRegion);
}

export async function getPublishedRegion(slug: string) {
  const regions = await getPublishedRegions();
  return regions.find((region) => region.slug === slug);
}

export async function getPublishedFoods() {
  const supabase = createPublicClient();

  if (!supabase) {
    return alphaFoods;
  }

  const { data, error } = await supabase
    .from("foods")
    .select(
      "slug, name_en, name_ko, description, taste_profile, spicy_level, beginner_note"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return alphaFoods;
  }

  return data.map(mapFood);
}

export async function getPublishedFood(slug: string) {
  const foods = await getPublishedFoods();
  return foods.find((food) => food.slug === slug);
}

export async function getPublishedPlaces() {
  const supabase = createPublicClient();

  if (!supabase) {
    return alphaPlaces;
  }

  const { data, error } = await supabase
    .from("places")
    .select(
      "slug, name_en, editorial_note, trust_tags, caution_tags, last_verified_at, is_sponsored, affiliate_url, sponsorship_note, regions(slug)"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return alphaPlaces;
  }

  return data.map((row) => mapPlace(row as unknown as PlaceRow));
}

export async function getPublishedPlace(slug: string) {
  const places = await getPublishedPlaces();
  return places.find((place) => place.slug === slug);
}

export async function getPublishedRoutes() {
  const supabase = createPublicClient();

  if (!supabase) {
    return alphaRoutes;
  }

  const { data, error } = await supabase
    .from("route_guides")
    .select("slug, title, summary, estimated_duration, regions(slug)")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return alphaRoutes;
  }

  return data.map((row) => mapRouteGuide(row as unknown as RouteGuideRow));
}

export async function getPublishedRoute(slug: string) {
  const routes = await getPublishedRoutes();
  return routes.find((route) => route.slug === slug);
}
