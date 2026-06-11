import { createClient } from "@supabase/supabase-js";

export type PublicRegion = {
  slug: string;
  nameEn: string;
  primaryAudience: string;
  kfoodIdentity: string;
  routeTheme: string;
  intro: string;
  bestForTags: string[];
};

export const fallbackRegions: PublicRegion[] = [
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

export type PublicFood = {
  slug: string;
  nameEn: string;
  nameKo: string;
  regionSlugs: string[];
  summary: string;
  tasteProfile: string;
  spicyLevel: 0 | 1 | 2 | 3 | 4;
  beginnerNote: string;
};

export type PhotoSourceCandidate = {
  sourceName: string;
  href: string;
  licenseFit: string;
  reviewNote: string;
};

export type PhotoReviewState =
  | "candidate_ok"
  | "candidate_found"
  | "association_proposal"
  | "needs_people_free"
  | "no_candidate"
  | "wrong_subject"
  | "unreviewed";

export type PhotoReviewNote = {
  state: PhotoReviewState;
  label: string;
  note: string;
  nextAction: string;
};

export const fallbackFoods: PublicFood[] = [
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

export type PublicPlace = {
  slug: string;
  nameEn: string;
  regionSlug: string;
  foodSlugs: string[];
  editorialNote: string;
  googleMapsUrl: string | null;
  naverMapsUrl: string | null;
  businessHoursNote: string | null;
  businessInfoNote: string | null;
  trustTags: string[];
  cautionTags: string[];
  lastVerifiedLabel: string;
};

export const fallbackPlaces: PublicPlace[] = [
  {
    slug: "myeongdong-street-food-loop",
    nameEn: "Myeongdong Street Food Loop",
    regionSlug: "myeongdong",
    foodSlugs: ["tteokbokki"],
    editorialNote:
      "A beginner-friendly evening walk where the value is variety and convenience rather than one destination restaurant.",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Myeongdong+Street+Food+Loop",
    naverMapsUrl: "https://map.naver.com/p/search/명동%20길거리%20음식",
    businessHoursNote:
      "Street stall hours vary by weather, season, and vendor. Check the live map before visiting.",
    businessInfoNote:
      "Area-level guide. Use map search to choose the exact stall or street segment.",
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
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hongdae+Chimaek",
    naverMapsUrl: "https://map.naver.com/p/search/홍대%20치맥",
    businessHoursNote:
      "Many shops open later, but hours and last orders vary. Check the live map before visiting.",
    businessInfoNote:
      "Area-level guide. Pick a currently open shop from the linked map results.",
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
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gangnam+Korean+BBQ",
    naverMapsUrl: "https://map.naver.com/p/search/강남%20고기집",
    businessHoursNote:
      "Restaurant hours, break times, and reservations vary. Check the live map before visiting.",
    businessInfoNote:
      "Area-level guide. Confirm the exact branch, reservation policy, and current reviews.",
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
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Jongno+Samgyetang",
    naverMapsUrl: "https://map.naver.com/p/search/종로%20삼계탕",
    businessHoursNote:
      "Restaurant hours and queue patterns vary. Check the live map before visiting.",
    businessInfoNote:
      "Area-level guide. Confirm exact restaurant choice and current operation.",
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
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gwangjang+Market+Bindaetteok",
    naverMapsUrl: "https://map.naver.com/p/search/광장시장%20빈대떡",
    businessHoursNote:
      "Market stall hours vary by stall and day. Check the live map before visiting.",
    businessInfoNote:
      "Area-level guide. Use the map results to choose a current stall or row.",
    trustTags: ["local classic", "market"],
    cautionTags: ["crowded"],
    lastVerifiedLabel: "Editorial placeholder"
  }
];

export type PublicRoute = {
  slug: string;
  title: string;
  regionSlug: string;
  summary: string;
  placeSlugs: string[];
  estimatedDuration: string;
};

export const fallbackRoutes: PublicRoute[] = [
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
  return fallbackRegions.find((region) => region.slug === slug);
}

export function getFood(slug: string) {
  return fallbackFoods.find((food) => food.slug === slug);
}

export function getPlace(slug: string) {
  return fallbackPlaces.find((place) => place.slug === slug);
}

export function getRegionFoods(regionSlug: string) {
  return fallbackFoods.filter((food) => food.regionSlugs.includes(regionSlug));
}

export function getRegionPlaces(regionSlug: string) {
  return fallbackPlaces.filter((place) => place.regionSlug === regionSlug);
}

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

const reportTypeAllowlist = new Set([
  "incorrect_info",
  "closed_place",
  "map_issue",
  "sponsorship_disclosure",
  "other"
]);

function allowsFallbackData() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK === "true"
  );
}

function fallbackData<T>(items: T[]): T[] {
  return allowsFallbackData() ? items : [];
}

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

function createAuthenticatedClient(accessToken: string) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
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
  name_ko: string | null;
  editorial_note: string;
  google_maps_url?: string | null;
  naver_maps_url?: string | null;
  business_hours_note?: string | null;
  business_info_note?: string | null;
  trust_tags: string[];
  tourist_tags?: string[];
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

type RelatedSlugRow = {
  regions?: { slug: string } | { slug: string }[] | null;
  foods?: { slug: string } | { slug: string }[] | null;
  places?: { slug: string } | { slug: string }[] | null;
  route_guides?: { slug: string } | { slug: string }[] | null;
  step_order?: number | null;
};

export type ContentReportInput = {
  pageUrl: string;
  entityType?: string | null;
  entityId?: string | null;
  reportType: string;
  message: string;
  userEmail?: string | null;
  honeypot?: string | null;
  reporterFingerprint?: string | null;
};

export type ContentReportResult =
  | { ok: true }
  | { ok: false; message: string };

export type AdminReportStatus =
  | "pending"
  | "in_review"
  | "resolved"
  | "ignored";

export type AdminReport = {
  id: string;
  pageUrl: string;
  entityType: string | null;
  entityId: string | null;
  reportType: string;
  message: string;
  userEmail: string | null;
  status: AdminReportStatus;
  adminNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

type AdminReportRow = {
  id: string;
  page_url: string;
  entity_type: string | null;
  entity_id: string | null;
  report_type: string;
  message: string;
  user_email: string | null;
  status: AdminReportStatus;
  admin_note: string | null;
  resolved_at: string | null;
  created_at: string;
};

export type UpdateAdminReportInput = {
  reportId: string;
  status: AdminReportStatus;
  adminNote?: string | null;
  actorId: string;
};

export type AdminMutationResult =
  | { ok: true }
  | { ok: false; message: string };

const reportRateLimitWindowMs = 10 * 60 * 1000;

function getReportRateLimitWindow(date = new Date()) {
  return new Date(
    Math.floor(date.getTime() / reportRateLimitWindowMs) *
      reportRateLimitWindowMs
  ).toISOString();
}

function firstRelatedSlug(
  related: { slug: string } | { slug: string }[] | null | undefined
) {
  if (Array.isArray(related)) {
    return related[0]?.slug;
  }

  return related?.slug;
}

function mapAdminReport(row: AdminReportRow): AdminReport {
  return {
    adminNote: row.admin_note,
    createdAt: row.created_at,
    entityId: row.entity_id,
    entityType: row.entity_type,
    id: row.id,
    message: row.message,
    pageUrl: row.page_url,
    reportType: row.report_type,
    resolvedAt: row.resolved_at,
    status: row.status,
    userEmail: row.user_email
  };
}

function mapRegion(row: RegionRow): PublicRegion {
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

function mapFood(row: FoodRow): PublicFood {
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

function photoSearchQuery(food: PublicFood) {
  return `${food.nameEn} ${food.nameKo} Korean food`;
}

function googleMapSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function naverMapSearchUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

function businessHoursNote(tags: string[], touristTags: string[] = []) {
  if (tags.includes("area_level")) {
    return "Area-level guide. Opening hours vary by individual shop or stall, so check the linked live map before visiting.";
  }

  if (touristTags.includes("seasonal")) {
    return "Seasonal availability can change quickly. Check the linked live map and recent reviews before visiting.";
  }

  if (touristTags.includes("restaurant_candidate")) {
    return "Restaurant hours, break times, last orders, and holidays can change. Check the linked live map before visiting.";
  }

  if (touristTags.includes("market")) {
    return "Market and stall hours can vary by vendor and day. Check the linked live map before visiting.";
  }

  return "Business hours are not independently verified yet. Check the linked live map before visiting.";
}

function businessInfoNote(tags: string[], touristTags: string[] = []) {
  if (tags.includes("area_level")) {
    return "This is an area-level place direction, not a single verified storefront. Use map results to choose a current shop.";
  }

  if (touristTags.includes("restaurant_candidate")) {
    return "This is a restaurant candidate. Confirm the exact branch, current operation, and queue/reservation conditions.";
  }

  if (touristTags.includes("market")) {
    return "This is a market-level candidate. Individual stalls, prices, menus, and availability may change.";
  }

  return "Confirm address, current operation, and route fit in the linked map before relying on this place.";
}

const photoSearchOverrides: Record<string, string> = {
  "gwangjang-bindaetteok": "bindaetteok mung bean pancake close-up no people",
  "myeongdong-kalguksu": "kalguksu Korean knife cut noodle soup close-up",
  chimaek: "Korean fried chicken beer chimaek close-up",
  "uijeongbu-budae-jjigae": "budae jjigae Korean army stew close-up",
  "incheon-jajangmyeon": "jajangmyeon Korean black bean noodles close-up"
};

const proposedPhotoCandidates: Record<string, PhotoSourceCandidate> = {
  "gwangjang-bindaetteok": {
    sourceName: "Proposed Commons candidate",
    href: "https://commons.wikimedia.org/wiki/File:Bindae-tteok.jpg",
    licenseFit: "KOGL Type 1: commercial use allowed with attribution",
    reviewNote:
      "People-free bindaetteok photo from Korean Culture and Information Service. Verify attribution wording before approval."
  },
  "myeongdong-kalguksu": {
    sourceName: "Proposed Commons candidate",
    href: "https://commons.wikimedia.org/wiki/File:Kalguksu-01.jpg",
    licenseFit: "CC BY 2.0: commercial use allowed with attribution",
    reviewNote:
      "Generic kalguksu photo, not Myeongdong-specific. Use only as an associated dish image if the subject match is approved."
  },
  chimaek: {
    sourceName: "Proposed Commons candidate",
    href: "https://commons.wikimedia.org/wiki/File:Iksan_City_48_Korean_Style_Fried_chicken.jpg",
    licenseFit: "CC BY-SA 2.0: commercial use allowed with attribution and share-alike",
    reviewNote:
      "Shows Korean fried chicken with beer. Verify share-alike implications before using modified/cropped versions."
  },
  "uijeongbu-budae-jjigae": {
    sourceName: "Proposed Commons candidate",
    href: "https://commons.wikimedia.org/wiki/File:Budae_jjigae_before_boiling.jpg",
    licenseFit: "CC BY-SA 2.5: commercial use allowed with attribution and share-alike",
    reviewNote:
      "Generic budae-jjigae photo, not Uijeongbu-specific. Use only as an associated dish image if approved."
  },
  "incheon-jajangmyeon": {
    sourceName: "Proposed Commons candidate",
    href: "https://commons.wikimedia.org/wiki/File:Jajangmyeon_by_KFoodaddict.jpg",
    licenseFit: "CC BY 2.0: commercial use allowed with attribution",
    reviewNote:
      "Jajangmyeon photo reviewed from Flickr on Commons. Verify dish match and attribution text before approval."
  }
};

const photoReviewNotes: Record<string, PhotoReviewNote> = {
  tteokbokki: {
    state: "candidate_ok",
    label: "Food match confirmed",
    note: "User confirmed the candidate photo subject matches the dish.",
    nextAction: "Next check license, author, source URL, and attribution text."
  },
  "gwangjang-bindaetteok": {
    state: "candidate_found",
    label: "People-free candidate found",
    note:
      "A people-free Commons candidate was found after excluding portrait-risk photos.",
    nextAction:
      "Open the proposed candidate and verify KOGL attribution before approval."
  },
  samgyetang: {
    state: "candidate_ok",
    label: "Food match confirmed",
    note: "User confirmed the candidate photo subject matches the dish.",
    nextAction: "Next check license, author, source URL, and attribution text."
  },
  "myeongdong-kalguksu": {
    state: "candidate_found",
    label: "Generic kalguksu candidate found",
    note:
      "No Myeongdong-specific candidate was found, but a generic kalguksu photo is available for association.",
    nextAction:
      "Verify the dish match and label it as associated with Myeongdong Kalguksu, not as a restaurant-specific image."
  },
  "korean-bbq": {
    state: "candidate_ok",
    label: "Food match confirmed",
    note: "User confirmed the candidate photo subject matches the dish.",
    nextAction: "Next check license, author, source URL, and attribution text."
  },
  chimaek: {
    state: "candidate_found",
    label: "Chicken and beer candidate found",
    note:
      "A Commons candidate showing fried chicken and beer together was found.",
    nextAction:
      "Verify attribution and share-alike implications before approval."
  },
  "suwon-galbi": {
    state: "no_candidate",
    label: "No usable candidate found",
    note: "User could not find a usable candidate in the current source links.",
    nextAction:
      "Search again with galbi, grilled beef ribs, or use original photography later."
  },
  "uijeongbu-budae-jjigae": {
    state: "candidate_found",
    label: "Generic budae-jjigae candidate found",
    note:
      "No Uijeongbu-specific candidate was found, but a generic budae-jjigae photo is available for association.",
    nextAction:
      "Verify the dish match and label it as associated with Uijeongbu Budae-jjigae, not as a restaurant-specific image."
  },
  "incheon-jajangmyeon": {
    state: "candidate_found",
    label: "Jajangmyeon candidate found",
    note: "A Commons candidate for jajangmyeon was found after the current pass.",
    nextAction:
      "Verify dish match and attribution text before associating it with Incheon Jajangmyeon."
  },
  hotteok: {
    state: "candidate_ok",
    label: "Food match confirmed",
    note: "User confirmed the candidate photo subject matches the dish.",
    nextAction: "Next check license, author, source URL, and attribution text."
  }
};

export function getFoodPhotoReviewNote(food: PublicFood): PhotoReviewNote {
  return (
    photoReviewNotes[food.slug] ?? {
      state: "unreviewed",
      label: "Not reviewed yet",
      note: "This food has not been checked by the user yet.",
      nextAction: "Open source links and check dish match, people, and license."
    }
  );
}

export function getFoodPhotoSourceCandidates(
  food: PublicFood
): PhotoSourceCandidate[] {
  const baseQuery = photoSearchOverrides[food.slug] ?? photoSearchQuery(food);
  const query = encodeURIComponent(baseQuery);
  const commonsQuery = encodeURIComponent(baseQuery);
  const proposedCandidate = proposedPhotoCandidates[food.slug];

  return [
    ...(proposedCandidate ? [proposedCandidate] : []),
    {
      sourceName: "Wikimedia Commons",
      href: `https://commons.wikimedia.org/w/index.php?search=${commonsQuery}&title=Special:MediaSearch&type=image`,
      licenseFit: "Best first check: public domain, CC BY, or CC BY-SA",
      reviewNote:
        "Open each file page and verify title, author, source URL, license, and attribution requirements before use."
    },
    {
      sourceName: "Openverse",
      href: `https://openverse.org/search/image?q=${query}`,
      licenseFit: "Useful discovery source for CC-licensed or public-domain images",
      reviewNote:
        "Filter out NonCommercial and NoDerivatives licenses for a monetized service; verify the original source page."
    },
    {
      sourceName: "Unsplash / Pexels fallback",
      href: `https://unsplash.com/s/photos/${query}`,
      licenseFit: "Fallback only for generic food mood photos",
      reviewNote:
        "Use only if the photo accurately represents the dish; do not imply restaurant, brand, or person endorsement."
    }
  ];
}

function mapPlace(row: PlaceRow): PublicPlace {
  return {
    slug: row.slug,
    nameEn: row.name_en,
    regionSlug: row.regions?.slug ?? "seoul",
    foodSlugs: [],
    editorialNote: row.editorial_note,
    googleMapsUrl: row.google_maps_url ?? googleMapSearchUrl(row.name_en),
    naverMapsUrl: row.naver_maps_url ?? naverMapSearchUrl(row.name_ko ?? row.name_en),
    businessHoursNote:
      row.business_hours_note ??
      businessHoursNote(row.trust_tags, row.tourist_tags),
    businessInfoNote:
      row.business_info_note ?? businessInfoNote(row.trust_tags, row.tourist_tags),
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

function mapRouteGuide(row: RouteGuideRow): PublicRoute {
  return {
    slug: row.slug,
    title: row.title,
    regionSlug: row.regions?.slug ?? "seoul",
    summary: row.summary,
    placeSlugs: [],
    estimatedDuration: row.estimated_duration ?? "Flexible"
  };
}

function addRegionSlugs(
  foods: PublicFood[],
  rows: RelatedSlugRow[]
): PublicFood[] {
  const regionSlugsByFood = new Map<string, string[]>();

  rows.forEach((row) => {
    const foodSlug = firstRelatedSlug(row.foods);
    const regionSlug = firstRelatedSlug(row.regions);

    if (!foodSlug || !regionSlug) {
      return;
    }

    const slugs = regionSlugsByFood.get(foodSlug) ?? [];
    regionSlugsByFood.set(foodSlug, [...slugs, regionSlug]);
  });

  return foods.map((food) => ({
    ...food,
    regionSlugs: regionSlugsByFood.get(food.slug) ?? food.regionSlugs
  }));
}

function addFoodSlugs(
  places: PublicPlace[],
  rows: RelatedSlugRow[]
): PublicPlace[] {
  const foodSlugsByPlace = new Map<string, string[]>();

  rows.forEach((row) => {
    const placeSlug = firstRelatedSlug(row.places);
    const foodSlug = firstRelatedSlug(row.foods);

    if (!placeSlug || !foodSlug) {
      return;
    }

    const slugs = foodSlugsByPlace.get(placeSlug) ?? [];
    foodSlugsByPlace.set(placeSlug, [...slugs, foodSlug]);
  });

  return places.map((place) => ({
    ...place,
    foodSlugs: foodSlugsByPlace.get(place.slug) ?? place.foodSlugs
  }));
}

function addRoutePlaceSlugs(
  routes: PublicRoute[],
  rows: RelatedSlugRow[]
): PublicRoute[] {
  const placeSlugsByRoute = new Map<string, string[]>();

  [...rows]
    .sort((a, b) => (a.step_order ?? 100) - (b.step_order ?? 100))
    .forEach((row) => {
      const routeSlug = firstRelatedSlug(row.route_guides);
      const placeSlug = firstRelatedSlug(row.places);

      if (!routeSlug || !placeSlug) {
        return;
      }

      const slugs = placeSlugsByRoute.get(routeSlug) ?? [];
      placeSlugsByRoute.set(routeSlug, [...slugs, placeSlug]);
    });

  return routes.map((route) => ({
    ...route,
    placeSlugs: placeSlugsByRoute.get(route.slug) ?? route.placeSlugs
  }));
}

export async function getPublishedRegions() {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackRegions);
  }

  const { data, error } = await supabase
    .from("regions")
    .select("slug, name_en, intro, best_for_tags")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return fallbackData(fallbackRegions);
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
    return fallbackData(fallbackFoods);
  }

  const [{ data, error }, { data: regionFoodRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("foods")
        .select(
          "slug, name_en, name_ko, description, taste_profile, spicy_level, beginner_note"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true }),
      supabase
        .from("region_foods")
        .select("regions(slug), foods(slug), display_order")
        .order("display_order", { ascending: true })
    ]);

  if (error || !data) {
    return fallbackData(fallbackFoods);
  }

  const foods = data.map(mapFood);

  if (relationError || !regionFoodRows) {
    return foods;
  }

  return addRegionSlugs(foods, regionFoodRows as unknown as RelatedSlugRow[]);
}

export async function getPublishedFood(slug: string) {
  const foods = await getPublishedFoods();
  return foods.find((food) => food.slug === slug);
}

export async function getPublishedPlaces() {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackPlaces);
  }

  const [{ data, error }, { data: placeFoodRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("places")
        .select(
          "slug, name_en, name_ko, editorial_note, tourist_tags, trust_tags, caution_tags, last_verified_at, is_sponsored, affiliate_url, sponsorship_note, regions(slug)"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true }),
      supabase
        .from("place_foods")
        .select("places(slug), foods(slug), display_order")
        .order("display_order", { ascending: true })
    ]);

  if (error || !data) {
    return fallbackData(fallbackPlaces);
  }

  const places = data.map((row) => mapPlace(row as unknown as PlaceRow));

  if (relationError || !placeFoodRows) {
    return places;
  }

  return addFoodSlugs(places, placeFoodRows as unknown as RelatedSlugRow[]);
}

export async function getPublishedPlace(slug: string) {
  const places = await getPublishedPlaces();
  return places.find((place) => place.slug === slug);
}

export async function getPublishedRoutes() {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackRoutes);
  }

  const [{ data, error }, { data: routePlaceRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("route_guides")
        .select("slug, title, summary, estimated_duration, regions(slug)")
        .eq("status", "published")
        .order("display_order", { ascending: true }),
      supabase
        .from("route_guide_places")
        .select("route_guides(slug), places(slug), step_order")
        .order("step_order", { ascending: true })
    ]);

  if (error || !data) {
    return fallbackData(fallbackRoutes);
  }

  const routes = data.map((row) => mapRouteGuide(row as unknown as RouteGuideRow));

  if (relationError || !routePlaceRows) {
    return routes;
  }

  return addRoutePlaceSlugs(
    routes,
    routePlaceRows as unknown as RelatedSlugRow[]
  );
}

export async function getPublishedRoute(slug: string) {
  const routes = await getPublishedRoutes();
  return routes.find((route) => route.slug === slug);
}

export async function getAdminReports(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_reports")
    .select(
      "id, page_url, entity_type, entity_id, report_type, message, user_email, status, admin_note, resolved_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminReport(row as AdminReportRow));
}

export async function updateAdminReportStatus(
  accessToken: string,
  input: UpdateAdminReportInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("content_reports")
    .select("*")
    .eq("id", input.reportId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Report was not found." };
  }

  const isTerminal = ["resolved", "ignored"].includes(input.status);
  const updatePayload = {
    admin_note: input.adminNote?.trim() || null,
    resolved_at: isTerminal ? new Date().toISOString() : null,
    resolved_by: isTerminal ? input.actorId : null,
    status: input.status
  };

  const { data: afterData, error: updateError } = await supabase
    .from("content_reports")
    .update(updatePayload)
    .eq("id", input.reportId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Report status could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "content_report.update_status",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.reportId,
    entity_type: "content_report"
  });

  if (auditError) {
    return { ok: false, message: "Report updated, but audit log failed." };
  }

  return { ok: true };
}

export async function submitContentReport(
  input: ContentReportInput
): Promise<ContentReportResult> {
  const supabase = createPublicClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase public environment variables are not configured."
    };
  }

  const pageUrl = input.pageUrl.trim();
  const reportType = input.reportType.trim();
  const message = input.message.trim();
  const userEmail = input.userEmail?.trim() || null;
  const honeypot = input.honeypot?.trim();
  const reporterFingerprint = input.reporterFingerprint?.trim() || null;

  if (honeypot) {
    return { ok: true };
  }

  if (!pageUrl || !reportType || !message) {
    return { ok: false, message: "Page URL, issue type, and details are required." };
  }

  if (!reportTypeAllowlist.has(reportType)) {
    return { ok: false, message: "Choose a supported issue type." };
  }

  try {
    const url = new URL(pageUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return { ok: false, message: "Page URL must start with http or https." };
    }
  } catch {
    return { ok: false, message: "Enter a valid page URL." };
  }

  if (message.length < 10) {
    return { ok: false, message: "Details must be at least 10 characters." };
  }

  if (message.length > 2000) {
    return { ok: false, message: "Details must be 2,000 characters or fewer." };
  }

  if (userEmail && userEmail.length > 320) {
    return { ok: false, message: "Email is too long." };
  }

  const rateLimitWindow = getReportRateLimitWindow();

  if (reporterFingerprint) {
    const { data: rateLimitAccepted, error: rateLimitError } = await supabase.rpc(
      "register_report_submission",
      {
        p_limit: 5,
        p_reporter_fingerprint: reporterFingerprint,
        p_window_start: rateLimitWindow
      }
    );

    if (rateLimitError || rateLimitAccepted !== true) {
      return {
        ok: false,
        message: "Too many reports were submitted recently. Please try again later."
      };
    }
  }

  const { error } = await supabase.from("content_reports").insert({
    page_url: pageUrl,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    report_type: reportType,
    message,
    user_email: userEmail,
    reporter_fingerprint: reporterFingerprint,
    rate_limit_window: reporterFingerprint ? rateLimitWindow : null
  });

  if (error) {
    return {
      ok: false,
      message: "The report could not be submitted. Please try again later."
    };
  }

  return { ok: true };
}
