import { createClient } from "@supabase/supabase-js";
import type {
  SupportedLanguage,
  UserPost,
  UserPostComment,
  UserPostCommentStatus,
  UserPostStatus,
  UserPostVisibility,
  UserProfile,
  UserRole
} from "@kfood/types";

export type {
  SupportedLanguage,
  UserPost,
  UserPostComment,
  UserPostCommentStatus,
  UserPostStatus,
  UserPostVisibility,
  UserProfile
} from "@kfood/types";

export type PublicRegion = {
  slug: string;
  nameEn: string;
  primaryAudience: string;
  kfoodIdentity: string;
  routeTheme: string;
  intro: string;
  bestForTags: string[];
  imageUrl?: string | null;
  id?: string;
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
  imageUrl?: string | null;
  id?: string;
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
  imageUrl?: string | null;
  id?: string;
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
  imageUrl?: string | null;
  id?: string;
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

const supportedLanguages = new Set<SupportedLanguage>(["ko", "en", "ja", "zh"]);

function allowsFallbackData() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK === "true"
  );
}

function fallbackData<T>(items: T[]): T[] {
  return allowsFallbackData() ? items : [];
}

// fallback으로 넘어가면 실 DB 장애가 화면에서 안 보이게 되므로,
// 원인 추적이 가능하도록 서버 로그에는 반드시 남긴다.
function logDataError(source: string, error: unknown) {
  if (error) {
    console.error(`[kfood-data] ${source} failed:`, error);
  }
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
  hero_image_url: string | null;
  id: string;
};

type FoodRow = {
  slug: string;
  name_en: string;
  name_ko: string;
  description: string;
  taste_profile: string | null;
  spicy_level: 0 | 1 | 2 | 3 | 4;
  beginner_note: string | null;
  image_url: string | null;
  id: string;
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
  image_url: string | null;
  id: string;
};

type RouteGuideRow = {
  slug: string;
  title: string;
  summary: string;
  estimated_duration: string | null;
  regions: { slug: string } | null;
  hero_image_url: string | null;
  id: string;
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

type ProfileRow = {
  id: string;
  display_name: string | null;
  bio: string | null;
  preferred_language: SupportedLanguage | null;
  role: UserRole;
  is_active: boolean;
};

export type UpdateMyProfileInput = {
  displayName: string;
  bio: string;
  preferredLanguage: SupportedLanguage;
};

export type UserProfileMutationResult =
  | { ok: true }
  | { ok: false; message: string };

type UserPostRow = {
  id: string;
  author_id: string;
  body: string;
  language: SupportedLanguage;
  visibility: UserPostVisibility;
  status: UserPostStatus;
  region_id: string | null;
  food_id: string | null;
  place_id: string | null;
  route_guide_id: string | null;
  moderation_note: string | null;
  created_at: string;
  updated_at: string;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
  user_post_comments: { count: number }[] | null;
};

type UserPostCommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  status: UserPostCommentStatus;
  moderation_note: string | null;
  created_at: string;
  updated_at: string;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
};

export type CreateUserPostInput = {
  authorId: string;
  body: string;
  language: SupportedLanguage;
  visibility: UserPostVisibility;
  regionSlug?: string | null;
  foodSlug?: string | null;
  placeSlug?: string | null;
  routeSlug?: string | null;
};

export type CreateAdminUserPostInput = CreateUserPostInput & {
  actorId: string;
  status: Extract<UserPostStatus, "pending_review" | "published">;
  moderationNote?: string | null;
};

export type CreatePostCommentInput = {
  authorId: string;
  postId: string;
  body: string;
};

export type UserPostMutationResult =
  | { ok: true; postId?: string }
  | { ok: false; message: string };

export type UserCommentMutationResult =
  | { ok: true }
  | { ok: false; message: string };

export type UpdateAdminUserPostInput = {
  actorId: string;
  postId: string;
  status: Extract<UserPostStatus, "published" | "hidden" | "removed">;
  moderationNote?: string | null;
};

export type UpdateAdminCommentInput = {
  actorId: string;
  commentId: string;
  status: UserPostCommentStatus;
  moderationNote?: string | null;
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

export type PublicationStatus =
  | "draft"
  | "published"
  | "hidden"
  | "archived";

export type AdminPlace = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string | null;
  regionSlug: string;
  status: PublicationStatus;
  editorialNote: string;
  googleMapsUrl: string | null;
  naverMapsUrl: string | null;
  businessHoursNote: string | null;
  businessInfoNote: string | null;
  trustTags: string[];
  cautionTags: string[];
  lastVerifiedAt: string | null;
  imageUrl: string | null;
  updatedAt: string;
};

type AdminPlaceRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ko: string | null;
  status: PublicationStatus;
  editorial_note: string;
  google_maps_url: string | null;
  naver_maps_url: string | null;
  business_hours_note: string | null;
  business_info_note: string | null;
  trust_tags: string[];
  caution_tags: string[];
  last_verified_at: string | null;
  image_url: string | null;
  updated_at: string;
  regions: { slug: string } | { slug: string }[] | null;
};

export type UpdateAdminPlaceInput = {
  actorId: string;
  businessHoursNote?: string | null;
  businessInfoNote?: string | null;
  cautionTags?: string[];
  editorialNote: string;
  googleMapsUrl?: string | null;
  markVerifiedToday?: boolean;
  naverMapsUrl?: string | null;
  placeId: string;
  status: PublicationStatus;
  trustTags?: string[];
};

export type CreateAdminPlaceInput = {
  actorId: string;
  addressEn?: string | null;
  addressKo?: string | null;
  businessHoursNote?: string | null;
  businessInfoNote?: string | null;
  cautionTags?: string[];
  editorialNote: string;
  googleMapsUrl?: string | null;
  nameEn: string;
  nameKo?: string | null;
  naverMapsUrl?: string | null;
  regionId: string;
  slug: string;
  status: PublicationStatus;
  trustTags?: string[];
};

export type AdminAuditLog = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
};

type AdminAuditLogRow = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
};

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

function firstProfileName(
  related:
    | { display_name: string | null }
    | { display_name: string | null }[]
    | null
    | undefined
) {
  if (Array.isArray(related)) {
    return related[0]?.display_name ?? null;
  }

  return related?.display_name ?? null;
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    bio: row.bio,
    displayName: row.display_name,
    id: row.id,
    isActive: row.is_active,
    preferredLanguage: row.preferred_language ?? "en",
    role: row.role
  };
}

function mapUserPost(row: UserPostRow): UserPost {
  return {
    authorDisplayName: firstProfileName(row.profiles),
    authorId: row.author_id,
    body: row.body,
    commentCount: row.user_post_comments?.[0]?.count ?? 0,
    createdAt: row.created_at,
    foodId: row.food_id,
    id: row.id,
    language: row.language,
    moderationNote: row.moderation_note,
    placeId: row.place_id,
    regionId: row.region_id,
    routeGuideId: row.route_guide_id,
    status: row.status,
    updatedAt: row.updated_at,
    visibility: row.visibility
  };
}

function mapUserPostComment(row: UserPostCommentRow): UserPostComment {
  return {
    authorDisplayName: firstProfileName(row.profiles),
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    id: row.id,
    moderationNote: row.moderation_note,
    postId: row.post_id,
    status: row.status,
    updatedAt: row.updated_at
  };
}

async function resolveEntityIdBySlug(
  supabase: ReturnType<typeof createAuthenticatedClient>,
  table: "regions" | "foods" | "places" | "route_guides",
  slug?: string | null
) {
  const normalized = slug?.trim();

  if (!supabase || !normalized) {
    return null;
  }

  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("slug", normalized)
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    return null;
  }

  return data.id;
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

function mapAdminPlace(row: AdminPlaceRow): AdminPlace {
  return {
    businessHoursNote: row.business_hours_note,
    businessInfoNote: row.business_info_note,
    cautionTags: row.caution_tags,
    editorialNote: row.editorial_note,
    googleMapsUrl: row.google_maps_url,
    id: row.id,
    imageUrl: row.image_url,
    lastVerifiedAt: row.last_verified_at,
    nameEn: row.name_en,
    nameKo: row.name_ko,
    naverMapsUrl: row.naver_maps_url,
    regionSlug: firstRelatedSlug(row.regions) ?? "unknown",
    slug: row.slug,
    status: row.status,
    trustTags: row.trust_tags,
    updatedAt: row.updated_at
  };
}

function mapAdminAuditLog(row: AdminAuditLogRow): AdminAuditLog {
  return {
    action: row.action,
    actorId: row.actor_id,
    createdAt: row.created_at,
    entityId: row.entity_id,
    entityType: row.entity_type,
    id: row.id
  };
}

// DB 태그는 capital_region 같은 snake_case 원시 값이라 그대로 노출하면
// 화면에서 어색하다. 표시 직전에 사람이 읽는 라벨로 바꾼다.
const TAG_LABEL_OVERRIDES: Record<string, string> = {
  bbq: "BBQ",
  first_time: "First-time friendly",
  solo_travel: "Solo travel",
  day_trip: "Day trip",
  near_seoul: "Near Seoul",
  tteokbokki: "Tteokbokki",
  jokbal: "Jokbal",
  budae_jjigae: "Budae-jjigae"
};

export function humanizeTag(tag: string): string {
  const override = TAG_LABEL_OVERRIDES[tag];
  if (override) {
    return override;
  }
  const spaced = tag.replace(/_/g, " ").trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : tag;
}

function mapRegion(row: RegionRow): PublicRegion {
  const displayTags = row.best_for_tags.map(humanizeTag);
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.hero_image_url ?? null,
    nameEn: row.name_en,
    primaryAudience: displayTags[0] ?? "K-food travelers",
    kfoodIdentity: displayTags.join(", "),
    routeTheme: "Curated K-food route",
    intro: row.intro,
    bestForTags: displayTags
  };
}

function mapFood(row: FoodRow): PublicFood {
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.image_url ?? null,
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
    id: row.id,
    slug: row.slug,
    imageUrl: row.image_url ?? null,
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
      ...row.trust_tags.map(humanizeTag),
      ...(row.is_sponsored ? ["Sponsored"] : []),
      ...(row.affiliate_url ? ["Affiliate link"] : [])
    ],
    cautionTags: row.caution_tags.map(humanizeTag),
    lastVerifiedLabel: row.last_verified_at
      ? `Last verified ${row.last_verified_at}`
      : "Verification pending"
  };
}

function mapRouteGuide(row: RouteGuideRow): PublicRoute {
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.hero_image_url ?? null,
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
    .select("id, slug, name_en, intro, best_for_tags, hero_image_url")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data) {
    logDataError("getPublishedRegions", error);
    return fallbackData(fallbackRegions);
  }

  return data.map(mapRegion);
}

export async function getPublishedRegion(slug: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackRegions).find((region) => region.slug === slug);
  }

  const { data, error } = await supabase
    .from("regions")
    .select("id, slug, name_en, intro, best_for_tags, hero_image_url")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle<RegionRow>();

  if (error) {
    logDataError("getPublishedRegion", error);
    return fallbackData(fallbackRegions).find((region) => region.slug === slug);
  }

  return data ? mapRegion(data) : undefined;
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
          "id, slug, name_en, name_ko, description, taste_profile, spicy_level, beginner_note, image_url"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true }),
      supabase
        .from("region_foods")
        .select("regions(slug), foods(slug), display_order")
        .order("display_order", { ascending: true })
        .returns<RelatedSlugRow[]>()
    ]);

  if (error || !data) {
    logDataError("getPublishedFoods", error);
    return fallbackData(fallbackFoods);
  }

  const foods = data.map(mapFood);

  if (relationError || !regionFoodRows) {
    logDataError("getPublishedFoods.regionFoods", relationError);
    return foods;
  }

  return addRegionSlugs(foods, regionFoodRows);
}

export async function getPublishedFood(slug: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackFoods).find((food) => food.slug === slug);
  }

  const [{ data, error }, { data: regionFoodRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("foods")
        .select(
          "id, slug, name_en, name_ko, description, taste_profile, spicy_level, beginner_note, image_url"
        )
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle<FoodRow>(),
      supabase
        .from("region_foods")
        .select("regions(slug), foods!inner(slug)")
        .eq("foods.slug", slug)
        .returns<RelatedSlugRow[]>()
    ]);

  if (error) {
    logDataError("getPublishedFood", error);
    return fallbackData(fallbackFoods).find((food) => food.slug === slug);
  }

  if (!data) {
    return undefined;
  }

  const food = mapFood(data);

  if (relationError || !regionFoodRows) {
    logDataError("getPublishedFood.regionFoods", relationError);
    return food;
  }

  return addRegionSlugs([food], regionFoodRows)[0];
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
          "id, slug, name_en, name_ko, editorial_note, google_maps_url, naver_maps_url, business_hours_note, business_info_note, tourist_tags, trust_tags, caution_tags, last_verified_at, is_sponsored, affiliate_url, sponsorship_note, image_url, regions(slug)"
        )
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .returns<PlaceRow[]>(),
      supabase
        .from("place_foods")
        .select("places(slug), foods(slug), display_order")
        .order("display_order", { ascending: true })
        .returns<RelatedSlugRow[]>()
    ]);

  if (error || !data) {
    logDataError("getPublishedPlaces", error);
    return fallbackData(fallbackPlaces);
  }

  const places = data.map(mapPlace);

  if (relationError || !placeFoodRows) {
    logDataError("getPublishedPlaces.placeFoods", relationError);
    return places;
  }

  return addFoodSlugs(places, placeFoodRows);
}

export async function getPublishedPlace(slug: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackPlaces).find((place) => place.slug === slug);
  }

  const [{ data, error }, { data: placeFoodRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("places")
        .select(
          "id, slug, name_en, name_ko, editorial_note, google_maps_url, naver_maps_url, business_hours_note, business_info_note, tourist_tags, trust_tags, caution_tags, last_verified_at, is_sponsored, affiliate_url, sponsorship_note, image_url, regions(slug)"
        )
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle<PlaceRow>(),
      supabase
        .from("place_foods")
        .select("places!inner(slug), foods(slug), display_order")
        .eq("places.slug", slug)
        .order("display_order", { ascending: true })
        .returns<RelatedSlugRow[]>()
    ]);

  if (error) {
    logDataError("getPublishedPlace", error);
    return fallbackData(fallbackPlaces).find((place) => place.slug === slug);
  }

  if (!data) {
    return undefined;
  }

  const place = mapPlace(data);

  if (relationError || !placeFoodRows) {
    logDataError("getPublishedPlace.placeFoods", relationError);
    return place;
  }

  return addFoodSlugs([place], placeFoodRows)[0];
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
        .select("id, slug, title, summary, estimated_duration, hero_image_url, regions(slug)")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .returns<RouteGuideRow[]>(),
      supabase
        .from("route_guide_places")
        .select("route_guides(slug), places(slug), step_order")
        .order("step_order", { ascending: true })
        .returns<RelatedSlugRow[]>()
    ]);

  if (error || !data) {
    logDataError("getPublishedRoutes", error);
    return fallbackData(fallbackRoutes);
  }

  const routes = data.map(mapRouteGuide);

  if (relationError || !routePlaceRows) {
    logDataError("getPublishedRoutes.routePlaces", relationError);
    return routes;
  }

  return addRoutePlaceSlugs(routes, routePlaceRows);
}

export async function getPublishedRoute(slug: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return fallbackData(fallbackRoutes).find((route) => route.slug === slug);
  }

  const [{ data, error }, { data: routePlaceRows, error: relationError }] =
    await Promise.all([
      supabase
        .from("route_guides")
        .select("id, slug, title, summary, estimated_duration, hero_image_url, regions(slug)")
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle<RouteGuideRow>(),
      supabase
        .from("route_guide_places")
        .select("route_guides!inner(slug), places(slug), step_order")
        .eq("route_guides.slug", slug)
        .order("step_order", { ascending: true })
        .returns<RelatedSlugRow[]>()
    ]);

  if (error) {
    logDataError("getPublishedRoute", error);
    return fallbackData(fallbackRoutes).find((route) => route.slug === slug);
  }

  if (!data) {
    return undefined;
  }

  const route = mapRouteGuide(data);

  if (relationError || !routePlaceRows) {
    logDataError("getPublishedRoute.routePlaces", relationError);
    return route;
  }

  return addRoutePlaceSlugs([route], routePlaceRows)[0];
}

// ── 공개: 촬영·제작 콘텐츠(productions) 노출 ──────────────────
// 음식/지역 상세 페이지에서 태그로 연결된 우리 제작 콘텐츠를 보여준다.
// productions 테이블(마이그레이션 008)이 아직 DB에 없으면 조용히 빈 배열을
// 반환하므로, 한빛이 마이그레이션을 적용하는 즉시 섹션이 살아난다.

export type PublicProduction = {
  slug: string;
  title: string;
  type: ProductionType;
  channel: string | null;
  summary: string | null;
  externalUrl: string | null;
  publishedAt: string | null;
};

type PublicProductionRow = {
  slug: string;
  title: string;
  type: ProductionType;
  channel: string | null;
  summary: string | null;
  external_url: string | null;
  published_at: string | null;
};

const PRODUCTION_ENTITY_TABLE: Record<ProductionEntityType, string> = {
  region: "regions",
  food: "foods",
  place: "places",
  route: "route_guides"
};

export async function getPublishedProductionsFor(
  entityType: ProductionEntityType,
  entitySlug: string
): Promise<PublicProduction[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data: entity, error: entityError } = await supabase
    .from(PRODUCTION_ENTITY_TABLE[entityType])
    .select("id")
    .eq("slug", entitySlug)
    .maybeSingle<{ id: string }>();

  if (entityError || !entity) {
    return [];
  }

  const { data, error } = await supabase
    .from("production_tags")
    .select(
      "productions!inner(slug, title, type, channel, summary, external_url, published_at)"
    )
    .eq("entity_type", entityType)
    .eq("entity_id", entity.id);

  if (error || !data) {
    // 마이그레이션 008 미적용 상태(테이블 없음, PGRST205)는 정상 경로라 로그 제외
    if (error && (error as { code?: string }).code !== "PGRST205") {
      logDataError("getPublishedProductionsFor", error);
    }
    return [];
  }

  return data
    .map((row) => {
      const production = (row as { productions: PublicProductionRow | PublicProductionRow[] })
        .productions;
      return Array.isArray(production) ? production[0] : production;
    })
    .filter((row): row is PublicProductionRow => Boolean(row))
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      type: row.type,
      channel: row.channel,
      summary: row.summary,
      externalUrl: row.external_url,
      publishedAt: row.published_at
    }))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

// 메인 "From our channels" 섹션용 — 태그와 무관하게 최신 제작 콘텐츠를 가져온다.
// RLS가 published만 공개하므로 상태 필터는 명시용. 테이블 미존재 시 빈 배열.
export async function getPublishedProductions(
  limit = 6
): Promise<PublicProduction[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("productions")
    .select("slug, title, type, channel, summary, external_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !data) {
    if (error && (error as { code?: string }).code !== "PGRST205") {
      logDataError("getPublishedProductions", error);
    }
    return [];
  }

  return (data as PublicProductionRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    type: row.type,
    channel: row.channel,
    summary: row.summary,
    externalUrl: row.external_url,
    publishedAt: row.published_at
  }));
}

export async function getMyProfile(accessToken: string, userId: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, bio, preferred_language, role, is_active")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    return null;
  }

  return mapProfile(data);
}

export async function updateMyProfile(
  accessToken: string,
  input: UpdateMyProfileInput
): Promise<UserProfileMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const displayName = input.displayName.trim();
  const bio = input.bio.trim();
  const preferredLanguage = input.preferredLanguage;

  if (displayName.length > 80) {
    return { ok: false, message: "Display name must be 80 characters or fewer." };
  }

  if (bio.length > 240) {
    return { ok: false, message: "Bio must be 240 characters or fewer." };
  }

  if (!supportedLanguages.has(preferredLanguage)) {
    return { ok: false, message: "Choose a supported language." };
  }

  const { error } = await supabase.rpc("update_my_profile", {
    p_bio: bio || null,
    p_display_name: displayName || null,
    p_preferred_language: preferredLanguage
  });

  if (error) {
    return {
      ok: false,
      message: "Profile could not be updated. Please try again later."
    };
  }

  return { ok: true };
}

export async function getMyFoodLog(accessToken: string, userId: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return new Map<string, string>();
  }

  const { data, error } = await supabase
    .from("user_food_log")
    .select("tried_at, foods(slug)")
    .eq("user_id", userId);

  if (error || !data) {
    return new Map<string, string>();
  }

  const entries = data
    .map((row) => {
      const food = row.foods as { slug: string } | { slug: string }[] | null;
      const slug = food ? (Array.isArray(food) ? food[0]?.slug : food.slug) : null;
      return slug ? ([slug, row.tried_at] as const) : null;
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);

  return new Map(entries);
}

export async function setFoodTried(
  accessToken: string,
  userId: string,
  foodSlug: string,
  tried: boolean
): Promise<UserPostMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const foodId = await resolveEntityIdBySlug(supabase, "foods", foodSlug);

  if (!foodId) {
    return { ok: false, message: "Dish not found." };
  }

  if (tried) {
    const { error } = await supabase
      .from("user_food_log")
      .upsert(
        { food_id: foodId, user_id: userId },
        { onConflict: "user_id,food_id", ignoreDuplicates: true }
      );

    if (error) {
      return { ok: false, message: "Could not save this record. Please try again later." };
    }

    return { ok: true };
  }

  const { error } = await supabase
    .from("user_food_log")
    .delete()
    .eq("user_id", userId)
    .eq("food_id", foodId);

  if (error) {
    return { ok: false, message: "Could not update this record. Please try again later." };
  }

  return { ok: true };
}

export type JourneyShareMutationResult =
  | { ok: true; token: string }
  | { ok: false; message: string };

export type PublicJourney = {
  displayName: string | null;
  entries: Array<{ foodSlug: string; triedAt: string }>;
};

export async function getMyJourneyShareToken(accessToken: string, userId: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("journey_share_token")
    .eq("id", userId)
    .maybeSingle<{ journey_share_token: string | null }>();

  if (error || !data) {
    return null;
  }

  return data.journey_share_token;
}

export async function enableMyJourneyShare(
  accessToken: string
): Promise<JourneyShareMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const { data, error } = await supabase.rpc("enable_my_journey_share");

  if (error || !data) {
    return { ok: false, message: "Could not create a share link. Please try again later." };
  }

  return { ok: true, token: data as string };
}

export async function getPublicJourney(shareToken: string): Promise<PublicJourney | null> {
  const supabase = createPublicClient();

  if (!supabase) {
    return null;
  }

  const [{ data: profileRows, error: profileError }, { data: entryRows, error: entryError }] =
    await Promise.all([
      supabase.rpc("get_public_journey_profile", { p_share_token: shareToken }),
      supabase.rpc("get_public_journey", { p_share_token: shareToken })
    ]);

  if (profileError || !profileRows || profileRows.length === 0) {
    return null;
  }

  const profile = profileRows as unknown as Array<{ display_name: string | null }>;
  const entries = entryError
    ? []
    : (entryRows as unknown as Array<{ food_slug: string; tried_at: string }>).map((row) => ({
        foodSlug: row.food_slug,
        triedAt: row.tried_at
      }));

  return { displayName: profile[0]?.display_name ?? null, entries };
}

export async function getPublishedUserPosts(limit = 30) {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_posts")
    .select(
      "id, author_id, body, language, visibility, status, region_id, food_id, place_id, route_guide_id, moderation_note, created_at, updated_at, profiles!user_posts_author_id_fkey(display_name), user_post_comments(count)"
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapUserPost(row as unknown as UserPostRow));
}

export async function getPublishedUserPost(postId: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_posts")
    .select(
      "id, author_id, body, language, visibility, status, region_id, food_id, place_id, route_guide_id, moderation_note, created_at, updated_at, profiles!user_posts_author_id_fkey(display_name), user_post_comments(count)"
    )
    .eq("id", postId)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapUserPost(data as unknown as UserPostRow);
}

export async function getPublishedPostComments(postId: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_post_comments")
    .select(
      "id, post_id, author_id, body, status, moderation_note, created_at, updated_at, profiles!user_post_comments_author_id_fkey(display_name)"
    )
    .eq("post_id", postId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapUserPostComment(row as unknown as UserPostCommentRow));
}

export async function createUserPost(
  accessToken: string,
  input: CreateUserPostInput
): Promise<UserPostMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const body = input.body.trim();

  if (body.length < 10) {
    return { ok: false, message: "Record text must be at least 10 characters." };
  }

  if (body.length > 2000) {
    return { ok: false, message: "Record text must be 2,000 characters or fewer." };
  }

  if (!supportedLanguages.has(input.language)) {
    return { ok: false, message: "Choose a supported language." };
  }

  if (!["public", "private", "unlisted"].includes(input.visibility)) {
    return { ok: false, message: "Choose a supported visibility." };
  }

  const [regionId, foodId, placeId, routeGuideId] = await Promise.all([
    resolveEntityIdBySlug(supabase, "regions", input.regionSlug),
    resolveEntityIdBySlug(supabase, "foods", input.foodSlug),
    resolveEntityIdBySlug(supabase, "places", input.placeSlug),
    resolveEntityIdBySlug(supabase, "route_guides", input.routeSlug)
  ]);

  const { data, error } = await supabase
    .from("user_posts")
    .insert({
      author_id: input.authorId,
      body,
      food_id: foodId,
      language: input.language,
      place_id: placeId,
      region_id: regionId,
      route_guide_id: routeGuideId,
      status: "pending_review",
      visibility: input.visibility
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    return {
      ok: false,
      message: "Record could not be submitted. Please try again later."
    };
  }

  return { ok: true, postId: data.id };
}

export async function createAdminUserPost(
  accessToken: string,
  input: CreateAdminUserPostInput
): Promise<UserPostMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const body = input.body.trim();

  if (body.length < 10) {
    return { ok: false, message: "Record text must be at least 10 characters." };
  }

  if (body.length > 2000) {
    return { ok: false, message: "Record text must be 2,000 characters or fewer." };
  }

  if (!supportedLanguages.has(input.language)) {
    return { ok: false, message: "Choose a supported language." };
  }

  if (!["public", "private", "unlisted"].includes(input.visibility)) {
    return { ok: false, message: "Choose a supported visibility." };
  }

  if (!["pending_review", "published"].includes(input.status)) {
    return { ok: false, message: "Choose a supported post status." };
  }

  const [regionId, foodId, placeId, routeGuideId] = await Promise.all([
    resolveEntityIdBySlug(supabase, "regions", input.regionSlug),
    resolveEntityIdBySlug(supabase, "foods", input.foodSlug),
    resolveEntityIdBySlug(supabase, "places", input.placeSlug),
    resolveEntityIdBySlug(supabase, "route_guides", input.routeSlug)
  ]);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("user_posts")
    .insert({
      author_id: input.authorId,
      body,
      food_id: foodId,
      language: input.language,
      moderated_by: input.actorId,
      moderation_note: input.moderationNote?.trim() || null,
      place_id: placeId,
      region_id: regionId,
      route_guide_id: routeGuideId,
      status: input.status,
      updated_at: now,
      visibility: input.visibility
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      message: "Admin record could not be created. Please check database policies."
    };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "user_post.create",
    actor_id: input.actorId,
    after_data: data,
    before_data: null,
    entity_id: data.id,
    entity_type: "user_post"
  });

  if (auditError) {
    return { ok: false, message: "Admin record created, but audit log failed." };
  }

  return { ok: true, postId: data.id };
}

export async function createPostComment(
  accessToken: string,
  input: CreatePostCommentInput
): Promise<UserCommentMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const body = input.body.trim();

  if (body.length < 2) {
    return { ok: false, message: "Comment must be at least 2 characters." };
  }

  if (body.length > 800) {
    return { ok: false, message: "Comment must be 800 characters or fewer." };
  }

  const { error } = await supabase.from("user_post_comments").insert({
    author_id: input.authorId,
    body,
    post_id: input.postId,
    status: "published"
  });

  if (error) {
    return {
      ok: false,
      message: "Comment could not be submitted. Please try again later."
    };
  }

  return { ok: true };
}

export async function removeOwnComment(
  accessToken: string,
  commentId: string
): Promise<UserCommentMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase user client is not configured." };
  }

  const { error } = await supabase
    .from("user_post_comments")
    .update({
      removed_at: new Date().toISOString(),
      status: "removed",
      updated_at: new Date().toISOString()
    })
    .eq("id", commentId);

  if (error) {
    return { ok: false, message: "Comment could not be removed." };
  }

  return { ok: true };
}

export async function getAdminUserPosts(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_posts")
    .select(
      "id, author_id, body, language, visibility, status, region_id, food_id, place_id, route_guide_id, moderation_note, created_at, updated_at, profiles!user_posts_author_id_fkey(display_name), user_post_comments(count)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapUserPost(row as unknown as UserPostRow));
}

export async function getAdminComments(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_post_comments")
    .select(
      "id, post_id, author_id, body, status, moderation_note, created_at, updated_at, profiles!user_post_comments_author_id_fkey(display_name)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapUserPostComment(row as unknown as UserPostCommentRow));
}

export async function updateAdminUserPostStatus(
  accessToken: string,
  input: UpdateAdminUserPostInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("user_posts")
    .select("*")
    .eq("id", input.postId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "User post was not found." };
  }

  const now = new Date().toISOString();
  const updatePayload = {
    hidden_at: input.status === "hidden" ? now : null,
    moderated_by: input.actorId,
    moderation_note: input.moderationNote?.trim() || null,
    removed_at: input.status === "removed" ? now : null,
    status: input.status,
    updated_at: now
  };

  const { data: afterData, error: updateError } = await supabase
    .from("user_posts")
    .update(updatePayload)
    .eq("id", input.postId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "User post could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "user_post.update_status",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.postId,
    entity_type: "user_post"
  });

  if (auditError) {
    return { ok: false, message: "User post updated, but audit log failed." };
  }

  return { ok: true };
}

export async function updateAdminCommentStatus(
  accessToken: string,
  input: UpdateAdminCommentInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("user_post_comments")
    .select("*")
    .eq("id", input.commentId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Comment was not found." };
  }

  const now = new Date().toISOString();
  const updatePayload = {
    hidden_at: input.status === "hidden" ? now : null,
    moderated_by: input.actorId,
    moderation_note: input.moderationNote?.trim() || null,
    removed_at: input.status === "removed" ? now : null,
    status: input.status,
    updated_at: now
  };

  const { data: afterData, error: updateError } = await supabase
    .from("user_post_comments")
    .update(updatePayload)
    .eq("id", input.commentId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Comment could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "user_post_comment.update_status",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.commentId,
    entity_type: "user_post_comment"
  });

  if (auditError) {
    return { ok: false, message: "Comment updated, but audit log failed." };
  }

  return { ok: true };
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

export async function getAdminPlaces(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("places")
    .select(
      "id, slug, name_en, name_ko, status, editorial_note, google_maps_url, naver_maps_url, business_hours_note, business_info_note, trust_tags, caution_tags, last_verified_at, image_url, updated_at, regions(slug)"
    )
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminPlace(row as unknown as AdminPlaceRow));
}

export async function getAdminAuditLogs(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("id, actor_id, action, entity_type, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminAuditLog(row as AdminAuditLogRow));
}

// 게시판(공개 영역) 단위 on/off 토글 키. platform_settings는 key/enabled 문자열
// 구조라 키 추가에 스키마 변경이 필요 없다 (기획정렬 §1-1: 노출 여부는 운영에서 결정).
// - community: 커뮤니티 피드·게시물·댓글 (/feed)
// - food_log: 푸드도감·트래커 (마이페이지 컬렉션 + 기록 저장)
// - journey_share: 여정 리캡·공유 URL (/mypage/journey, /journey/[token])
export type PlatformSettingKey = "community" | "food_log" | "journey_share";

export async function getPlatformSettings(): Promise<Record<string, boolean>> {
  const supabase = createPublicClient();

  if (!supabase) {
    return { community: true };
  }

  const { data, error } = await supabase
    .from("platform_settings")
    .select("key, enabled");

  if (error || !data) {
    return { community: true };
  }

  return Object.fromEntries(data.map((row) => [row.key, row.enabled]));
}

export async function isCommunityEnabled(): Promise<boolean> {
  return isBoardEnabled("community");
}

// 게시판 토글 공통 조회. 설정 행이 없으면 공개(true)가 기본값 —
// 기존 동작(커뮤니티 기본 공개)과 동일한 규칙을 모든 게시판에 적용한다.
export async function isBoardEnabled(key: PlatformSettingKey): Promise<boolean> {
  const settings = await getPlatformSettings();
  return settings[key] ?? true;
}

export async function updatePlatformSetting(
  accessToken: string,
  key: PlatformSettingKey,
  enabled: boolean,
  actorId: string
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("platform_settings")
    .upsert({ enabled, key, updated_at: new Date().toISOString(), updated_by: actorId })
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Setting could not be updated." };
  }

  // entity_id는 uuid 컬럼이라 "community" 같은 키 문자열을 넣을 수 없다.
  // 어떤 설정인지는 action 뒤에 붙이고, entity_id는 비운다.
  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: `platform_setting.update.${key}`,
    actor_id: actorId,
    after_data: afterData,
    before_data: null,
    entity_id: null,
    entity_type: "platform_setting"
  });

  if (auditError) {
    return { ok: false, message: "Setting updated, but audit log failed." };
  }

  return { ok: true };
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

// 장소 생성. updateAdminPlace 패턴을 그대로 따름(감사 로그 포함).
// RLS의 places_editor_manage(for all)가 editor/admin 삽입을 허용한다.
export async function createAdminPlace(
  accessToken: string,
  input: CreateAdminPlaceInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  if (!input.slug.trim()) {
    return { ok: false, message: "Slug is required." };
  }
  if (!input.nameEn.trim()) {
    return { ok: false, message: "English name is required." };
  }
  if (!input.regionId) {
    return { ok: false, message: "Region is required." };
  }
  if (!input.editorialNote.trim()) {
    return { ok: false, message: "Editorial note is required." };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("places")
    .insert({
      address_en: input.addressEn?.trim() || null,
      address_ko: input.addressKo?.trim() || null,
      business_hours_note: input.businessHoursNote?.trim() || null,
      business_info_note: input.businessInfoNote?.trim() || null,
      caution_tags: input.cautionTags ?? [],
      editorial_note: input.editorialNote.trim(),
      google_maps_url: input.googleMapsUrl?.trim() || null,
      name_en: input.nameEn.trim(),
      name_ko: input.nameKo?.trim() || null,
      naver_maps_url: input.naverMapsUrl?.trim() || null,
      region_id: input.regionId,
      slug: input.slug.trim(),
      status: input.status,
      trust_tags: input.trustTags ?? [],
      updated_at: new Date().toISOString()
    })
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "Place could not be created." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "place.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: (afterData as { id: string }).id,
    entity_type: "place"
  });

  if (auditError) {
    return { ok: false, message: "Place created, but audit log failed." };
  }

  return { ok: true };
}

export async function updateAdminPlace(
  accessToken: string,
  input: UpdateAdminPlaceInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("places")
    .select("*")
    .eq("id", input.placeId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Place was not found." };
  }

  const existingReview = beforeData as {
    last_verified_at?: string | null;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
  };
  const today = new Date().toISOString().slice(0, 10);
  const updatePayload = {
    business_hours_note: input.businessHoursNote?.trim() || null,
    business_info_note: input.businessInfoNote?.trim() || null,
    caution_tags: input.cautionTags ?? [],
    editorial_note: input.editorialNote.trim(),
    google_maps_url: input.googleMapsUrl?.trim() || null,
    last_verified_at: input.markVerifiedToday
      ? today
      : existingReview.last_verified_at ?? null,
    naver_maps_url: input.naverMapsUrl?.trim() || null,
    reviewed_at: input.markVerifiedToday
      ? new Date().toISOString()
      : existingReview.reviewed_at ?? null,
    reviewed_by: input.markVerifiedToday
      ? input.actorId
      : existingReview.reviewed_by ?? null,
    status: input.status,
    trust_tags: input.trustTags ?? [],
    updated_at: new Date().toISOString()
  };

  if (!updatePayload.editorial_note) {
    return { ok: false, message: "Editorial note is required." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("places")
    .update(updatePayload)
    .eq("id", input.placeId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Place could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "place.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.placeId,
    entity_type: "place"
  });

  if (auditError) {
    return { ok: false, message: "Place updated, but audit log failed." };
  }

  return { ok: true };
}

// ── Admin: regions CRUD ─────────────────────────────────────
// 기존 RLS(regions_editor_manage: editor/admin 쓰기 허용) 위에 얹은 앱 함수.
// updateAdminPlace 패턴을 그대로 따름(감사 로그 포함).

export type AdminRegion = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  intro: string;
  bestForTags: string[];
  displayOrder: number;
  status: PublicationStatus;
  editorialNote: string | null;
  imageUrl: string | null;
  updatedAt: string | null;
};

type AdminRegionRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ko: string;
  intro: string;
  best_for_tags: string[] | null;
  display_order: number;
  status: PublicationStatus;
  editorial_note: string | null;
  hero_image_url: string | null;
  updated_at: string | null;
};

function mapAdminRegion(row: AdminRegionRow): AdminRegion {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.name_en,
    nameKo: row.name_ko,
    intro: row.intro,
    bestForTags: row.best_for_tags ?? [],
    displayOrder: row.display_order,
    status: row.status,
    editorialNote: row.editorial_note,
    imageUrl: row.hero_image_url,
    updatedAt: row.updated_at
  };
}

export type CreateAdminRegionInput = {
  actorId: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  intro: string;
  bestForTags?: string[];
  editorialNote?: string;
  status: PublicationStatus;
};

export type UpdateAdminRegionInput = CreateAdminRegionInput & {
  regionId: string;
};

const adminRegionColumns =
  "id, slug, name_en, name_ko, intro, best_for_tags, display_order, status, editorial_note, hero_image_url, updated_at";

export async function getAdminRegions(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("regions")
    .select(adminRegionColumns)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminRegion(row as unknown as AdminRegionRow));
}

function validateRegionInput(input: CreateAdminRegionInput) {
  if (!input.slug.trim()) return "Slug is required.";
  if (!input.nameEn.trim()) return "English name is required.";
  if (!input.nameKo.trim()) return "Korean name is required.";
  if (!input.intro.trim()) return "Intro is required.";
  return null;
}

function regionWritePayload(input: CreateAdminRegionInput) {
  return {
    slug: input.slug.trim(),
    name_en: input.nameEn.trim(),
    name_ko: input.nameKo.trim(),
    intro: input.intro.trim(),
    best_for_tags: input.bestForTags ?? [],
    editorial_note: input.editorialNote?.trim() || null,
    status: input.status,
    updated_at: new Date().toISOString()
  };
}

export async function createAdminRegion(
  accessToken: string,
  input: CreateAdminRegionInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateRegionInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("regions")
    .insert(regionWritePayload(input))
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "Region could not be created." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "region.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: (afterData as { id: string }).id,
    entity_type: "region"
  });

  if (auditError) {
    return { ok: false, message: "Region created, but audit log failed." };
  }

  return { ok: true };
}

export async function updateAdminRegion(
  accessToken: string,
  input: UpdateAdminRegionInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateRegionInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("regions")
    .select("*")
    .eq("id", input.regionId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Region was not found." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("regions")
    .update(regionWritePayload(input))
    .eq("id", input.regionId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Region could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "region.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.regionId,
    entity_type: "region"
  });

  if (auditError) {
    return { ok: false, message: "Region updated, but audit log failed." };
  }

  return { ok: true };
}

// ── Admin: foods CRUD ───────────────────────────────────────
// 기존 RLS(foods_editor_manage) 위에 얹은 앱 함수. 지역 CRUD와 동일 패턴.

export type AdminFood = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  romanizedName: string | null;
  description: string;
  tasteProfile: string | null;
  spicyLevel: number;
  beginnerNote: string | null;
  eatingGuide: string | null;
  cautionNote: string | null;
  status: PublicationStatus;
  editorialNote: string | null;
  imageUrl: string | null;
  updatedAt: string | null;
};

type AdminFoodRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ko: string;
  romanized_name: string | null;
  description: string;
  taste_profile: string | null;
  spicy_level: number;
  beginner_note: string | null;
  eating_guide: string | null;
  caution_note: string | null;
  status: PublicationStatus;
  editorial_note: string | null;
  image_url: string | null;
  updated_at: string | null;
};

function mapAdminFood(row: AdminFoodRow): AdminFood {
  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.name_en,
    nameKo: row.name_ko,
    romanizedName: row.romanized_name,
    description: row.description,
    tasteProfile: row.taste_profile,
    spicyLevel: row.spicy_level,
    beginnerNote: row.beginner_note,
    eatingGuide: row.eating_guide,
    cautionNote: row.caution_note,
    status: row.status,
    editorialNote: row.editorial_note,
    imageUrl: row.image_url,
    updatedAt: row.updated_at
  };
}

export type CreateAdminFoodInput = {
  actorId: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  romanizedName?: string;
  description: string;
  tasteProfile?: string;
  spicyLevel: number;
  beginnerNote?: string;
  eatingGuide?: string;
  cautionNote?: string;
  editorialNote?: string;
  status: PublicationStatus;
};

export type UpdateAdminFoodInput = CreateAdminFoodInput & { foodId: string };

const adminFoodColumns =
  "id, slug, name_en, name_ko, romanized_name, description, taste_profile, spicy_level, beginner_note, eating_guide, caution_note, status, editorial_note, image_url, updated_at";

export async function getAdminFoods(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("foods")
    .select(adminFoodColumns)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminFood(row as unknown as AdminFoodRow));
}

function validateFoodInput(input: CreateAdminFoodInput) {
  if (!input.slug.trim()) return "Slug is required.";
  if (!input.nameEn.trim()) return "English name is required.";
  if (!input.nameKo.trim()) return "Korean name is required.";
  if (!input.description.trim()) return "Description is required.";
  if (input.spicyLevel < 0 || input.spicyLevel > 4)
    return "Spicy level must be between 0 and 4.";
  return null;
}

function foodWritePayload(input: CreateAdminFoodInput) {
  return {
    slug: input.slug.trim(),
    name_en: input.nameEn.trim(),
    name_ko: input.nameKo.trim(),
    romanized_name: input.romanizedName?.trim() || null,
    description: input.description.trim(),
    taste_profile: input.tasteProfile?.trim() || null,
    spicy_level: input.spicyLevel,
    beginner_note: input.beginnerNote?.trim() || null,
    eating_guide: input.eatingGuide?.trim() || null,
    caution_note: input.cautionNote?.trim() || null,
    editorial_note: input.editorialNote?.trim() || null,
    status: input.status,
    updated_at: new Date().toISOString()
  };
}

export async function createAdminFood(
  accessToken: string,
  input: CreateAdminFoodInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateFoodInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("foods")
    .insert(foodWritePayload(input))
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "Food could not be created." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "food.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: (afterData as { id: string }).id,
    entity_type: "food"
  });

  if (auditError) {
    return { ok: false, message: "Food created, but audit log failed." };
  }

  return { ok: true };
}

export async function updateAdminFood(
  accessToken: string,
  input: UpdateAdminFoodInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateFoodInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("foods")
    .select("*")
    .eq("id", input.foodId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Food was not found." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("foods")
    .update(foodWritePayload(input))
    .eq("id", input.foodId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Food could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "food.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.foodId,
    entity_type: "food"
  });

  if (auditError) {
    return { ok: false, message: "Food updated, but audit log failed." };
  }

  return { ok: true };
}

// ── Admin: routes CRUD ──────────────────────────────────────
// 기존 RLS(route_guides_editor_manage) 위에 얹은 앱 함수. region_id 필수(FK).

export type AdminRoute = {
  id: string;
  slug: string;
  regionId: string;
  title: string;
  summary: string;
  estimatedDuration: string | null;
  transportMode: string | null;
  recommendedForTags: string[];
  editorialNote: string | null;
  imageUrl: string | null;
  status: PublicationStatus;
  updatedAt: string | null;
};

type AdminRouteRow = {
  id: string;
  slug: string;
  region_id: string;
  title: string;
  summary: string;
  estimated_duration: string | null;
  transport_mode: string | null;
  recommended_for_tags: string[] | null;
  editorial_note: string | null;
  hero_image_url: string | null;
  status: PublicationStatus;
  updated_at: string | null;
};

function mapAdminRoute(row: AdminRouteRow): AdminRoute {
  return {
    id: row.id,
    slug: row.slug,
    regionId: row.region_id,
    title: row.title,
    summary: row.summary,
    estimatedDuration: row.estimated_duration,
    transportMode: row.transport_mode,
    recommendedForTags: row.recommended_for_tags ?? [],
    editorialNote: row.editorial_note,
    imageUrl: row.hero_image_url,
    status: row.status,
    updatedAt: row.updated_at
  };
}

export type CreateAdminRouteInput = {
  actorId: string;
  slug: string;
  regionId: string;
  title: string;
  summary: string;
  estimatedDuration?: string;
  transportMode?: string;
  recommendedForTags?: string[];
  editorialNote?: string;
  status: PublicationStatus;
};

export type UpdateAdminRouteInput = CreateAdminRouteInput & { routeId: string };

const adminRouteColumns =
  "id, slug, region_id, title, summary, estimated_duration, transport_mode, recommended_for_tags, editorial_note, status, hero_image_url, updated_at";

export async function getAdminRoutes(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("route_guides")
    .select(adminRouteColumns)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminRoute(row as unknown as AdminRouteRow));
}

function validateRouteInput(input: CreateAdminRouteInput) {
  if (!input.slug.trim()) return "Slug is required.";
  if (!input.regionId.trim()) return "Region is required.";
  if (!input.title.trim()) return "Title is required.";
  if (!input.summary.trim()) return "Summary is required.";
  return null;
}

function routeWritePayload(input: CreateAdminRouteInput) {
  return {
    slug: input.slug.trim(),
    region_id: input.regionId,
    title: input.title.trim(),
    summary: input.summary.trim(),
    estimated_duration: input.estimatedDuration?.trim() || null,
    transport_mode: input.transportMode?.trim() || null,
    recommended_for_tags: input.recommendedForTags ?? [],
    editorial_note: input.editorialNote?.trim() || null,
    status: input.status,
    updated_at: new Date().toISOString()
  };
}

export async function createAdminRoute(
  accessToken: string,
  input: CreateAdminRouteInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateRouteInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("route_guides")
    .insert(routeWritePayload(input))
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "Route could not be created." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "route.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: (afterData as { id: string }).id,
    entity_type: "route"
  });

  if (auditError) {
    return { ok: false, message: "Route created, but audit log failed." };
  }

  return { ok: true };
}

export async function updateAdminRoute(
  accessToken: string,
  input: UpdateAdminRouteInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateRouteInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("route_guides")
    .select("*")
    .eq("id", input.routeId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Route was not found." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("route_guides")
    .update(routeWritePayload(input))
    .eq("id", input.routeId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Route could not be updated." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "route.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.routeId,
    entity_type: "route"
  });

  if (auditError) {
    return { ok: false, message: "Route updated, but audit log failed." };
  }

  return { ok: true };
}

// ── Admin: productions (촬영·제작 콘텐츠, B) CRUD + 태그 ──────
// 신규 테이블(007_productions.sql). 참조 콘텐츠를 태그로 연결.

export type ProductionType = "video" | "blog" | "reels" | "shorts" | "photo";
export type ProductionEntityType = "region" | "food" | "place" | "route";

export type ProductionTag = {
  entityType: ProductionEntityType;
  entityId: string;
};

export type AdminProduction = {
  id: string;
  slug: string;
  title: string;
  titleKo: string | null;
  type: ProductionType;
  channel: string | null;
  summary: string | null;
  externalUrl: string | null;
  status: PublicationStatus;
  editorialNote: string | null;
  scheduledDate: string | null;
  tags: ProductionTag[];
  updatedAt: string | null;
};

type ProductionTagRow = { entity_type: ProductionEntityType; entity_id: string };

type AdminProductionRow = {
  id: string;
  slug: string;
  title: string;
  title_ko: string | null;
  type: ProductionType;
  channel: string | null;
  summary: string | null;
  external_url: string | null;
  status: PublicationStatus;
  editorial_note: string | null;
  scheduled_date: string | null;
  updated_at: string | null;
  production_tags?: ProductionTagRow[] | null;
};

function mapAdminProduction(row: AdminProductionRow): AdminProduction {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleKo: row.title_ko,
    type: row.type,
    channel: row.channel,
    summary: row.summary,
    externalUrl: row.external_url,
    status: row.status,
    editorialNote: row.editorial_note,
    scheduledDate: row.scheduled_date,
    tags: (row.production_tags ?? []).map((tag) => ({
      entityType: tag.entity_type,
      entityId: tag.entity_id
    })),
    updatedAt: row.updated_at
  };
}

export type CreateAdminProductionInput = {
  actorId: string;
  slug: string;
  title: string;
  titleKo?: string;
  type: ProductionType;
  channel?: string;
  summary?: string;
  externalUrl?: string;
  editorialNote?: string;
  scheduledDate?: string | null;
  status: PublicationStatus;
  tags: ProductionTag[];
};

export type UpdateAdminProductionInput = CreateAdminProductionInput & {
  productionId: string;
};

const adminProductionColumns =
  "id, slug, title, title_ko, type, channel, summary, external_url, status, editorial_note, scheduled_date, updated_at, production_tags(entity_type, entity_id)";

export async function getAdminProductions(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("productions")
    .select(adminProductionColumns)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapAdminProduction(row as unknown as AdminProductionRow));
}

function validateProductionInput(input: CreateAdminProductionInput) {
  if (!input.slug.trim()) return "Slug is required.";
  if (!input.title.trim()) return "Title is required.";
  return null;
}

function productionWritePayload(input: CreateAdminProductionInput) {
  return {
    slug: input.slug.trim(),
    title: input.title.trim(),
    title_ko: input.titleKo?.trim() || null,
    type: input.type,
    channel: input.channel?.trim() || null,
    summary: input.summary?.trim() || null,
    external_url: input.externalUrl?.trim() || null,
    editorial_note: input.editorialNote?.trim() || null,
    scheduled_date: input.scheduledDate?.trim() || null,
    status: input.status,
    updated_at: new Date().toISOString()
  };
}

async function replaceProductionTags(
  supabase: NonNullable<ReturnType<typeof createAuthenticatedClient>>,
  productionId: string,
  tags: ProductionTag[]
) {
  await supabase.from("production_tags").delete().eq("production_id", productionId);

  if (tags.length === 0) {
    return null;
  }

  const { error } = await supabase.from("production_tags").insert(
    tags.map((tag) => ({
      production_id: productionId,
      entity_type: tag.entityType,
      entity_id: tag.entityId
    }))
  );

  return error ? "Content saved, but tags failed." : null;
}

export async function createAdminProduction(
  accessToken: string,
  input: CreateAdminProductionInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateProductionInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("productions")
    .insert(productionWritePayload(input))
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "Content could not be created." };
  }

  const productionId = (afterData as { id: string }).id;
  const tagError = await replaceProductionTags(supabase, productionId, input.tags);

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "production.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: productionId,
    entity_type: "production"
  });

  if (tagError) return { ok: false, message: tagError };
  if (auditError) return { ok: false, message: "Content created, but audit log failed." };

  return { ok: true };
}

export async function updateAdminProduction(
  accessToken: string,
  input: UpdateAdminProductionInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const validationError = validateProductionInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("productions")
    .select("*")
    .eq("id", input.productionId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "Content was not found." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("productions")
    .update(productionWritePayload(input))
    .eq("id", input.productionId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "Content could not be updated." };
  }

  const tagError = await replaceProductionTags(
    supabase,
    input.productionId,
    input.tags
  );

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "production.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.productionId,
    entity_type: "production"
  });

  if (tagError) return { ok: false, message: tagError };
  if (auditError) return { ok: false, message: "Content updated, but audit log failed." };

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

// ── Admin: 보관 · 삭제 ─────────────────────────────────────
// 보관(archive)은 status를 archived로 바꿔 목록에서 감추는 것이고,
// 삭제(delete)는 DB에서 실제로 제거하는 것이다. 둘 다 감사 로그를 남긴다.
//
// 지역·장소는 다른 데이터가 참조 중이면 DB가 삭제를 막는다(on delete restrict).
// 그 경우 Postgres가 23503(외래키 위반)을 돌려주므로, 왜 막혔는지 설명해준다.
// 어드민 화면은 한국어라 이 메시지들만 한국어로 쓴다.

export type AdminDeletableEntity =
  | "region"
  | "food"
  | "place"
  | "route"
  | "production";

const adminDeleteTargets: Record<
  AdminDeletableEntity,
  { table: string; label: string; blockedMessage: string }
> = {
  region: {
    table: "regions",
    label: "지역",
    blockedMessage:
      "이 지역에 연결된 장소나 루트가 있어 삭제할 수 없습니다. 그것들을 먼저 삭제하거나 다른 지역으로 옮긴 뒤 다시 시도하세요."
  },
  food: {
    table: "foods",
    label: "음식",
    blockedMessage:
      "이 음식에 연결된 데이터가 있어 삭제할 수 없습니다. 연결을 먼저 정리한 뒤 다시 시도하세요."
  },
  place: {
    table: "places",
    label: "장소",
    blockedMessage:
      "이 장소가 포함된 루트가 있어 삭제할 수 없습니다. 루트에서 이 장소를 먼저 빼낸 뒤 다시 시도하세요."
  },
  route: {
    table: "route_guides",
    label: "루트",
    blockedMessage:
      "이 루트에 연결된 데이터가 있어 삭제할 수 없습니다. 연결을 먼저 정리한 뒤 다시 시도하세요."
  },
  production: {
    table: "productions",
    label: "촬영 콘텐츠",
    blockedMessage:
      "이 콘텐츠에 연결된 데이터가 있어 삭제할 수 없습니다. 연결을 먼저 정리한 뒤 다시 시도하세요."
  }
};

export type AdminEntityMutationInput = {
  actorId: string;
  entity: AdminDeletableEntity;
  id: string;
};

/** 보관: status를 archived로. 데이터는 남고 공개 사이트에서만 빠진다. */
export async function archiveAdminEntity(
  accessToken: string,
  input: AdminEntityMutationInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const target = adminDeleteTargets[input.entity];

  if (!target) {
    return { ok: false, message: "지원하지 않는 콘텐츠 유형입니다." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from(target.table)
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: `${target.label}을(를) 찾을 수 없습니다.` };
  }

  const { data: afterData, error: updateError } = await supabase
    .from(target.table)
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", input.id)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: `${target.label}을(를) 보관할 수 없습니다.` };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: `${input.entity}.archive`,
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.id,
    entity_type: input.entity
  });

  if (auditError) {
    return {
      ok: false,
      message: `${target.label}을(를) 보관했지만 감사 로그 기록에 실패했습니다.`
    };
  }

  return { ok: true };
}

/** 발행 상태만 바꾼다(공개·숨김·초안·보관). 일괄 상태 변경에 쓴다. */
export async function setAdminEntityStatus(
  accessToken: string,
  input: {
    actorId: string;
    entity: AdminDeletableEntity;
    id: string;
    status: PublicationStatus;
  }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const target = adminDeleteTargets[input.entity];

  if (!target) {
    return { ok: false, message: "지원하지 않는 콘텐츠 유형입니다." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from(target.table)
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: `${target.label}을(를) 찾을 수 없습니다.` };
  }

  const { data: afterData, error: updateError } = await supabase
    .from(target.table)
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.id)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: `${target.label} 상태를 바꾸지 못했습니다.` };
  }

  await supabase.from("admin_audit_logs").insert({
    action: `${input.entity}.status_change`,
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.id,
    entity_type: input.entity
  });

  return { ok: true };
}

/** 완전 삭제: DB에서 제거. 되돌릴 수 없다. 삭제 직전 내용은 감사 로그에 남는다. */
export async function deleteAdminEntity(
  accessToken: string,
  input: AdminEntityMutationInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const target = adminDeleteTargets[input.entity];

  if (!target) {
    return { ok: false, message: "지원하지 않는 콘텐츠 유형입니다." };
  }

  // 삭제하면 내용을 다시 읽을 수 없으므로 미리 감사 로그용으로 확보한다.
  const { data: beforeData, error: beforeError } = await supabase
    .from(target.table)
    .select("*")
    .eq("id", input.id)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: `${target.label}을(를) 찾을 수 없습니다.` };
  }

  const { error: deleteError } = await supabase
    .from(target.table)
    .delete()
    .eq("id", input.id);

  if (deleteError) {
    if (deleteError.code === "23503") {
      return { ok: false, message: target.blockedMessage };
    }
    return { ok: false, message: `${target.label}을(를) 삭제할 수 없습니다.` };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: `${input.entity}.delete`,
    actor_id: input.actorId,
    after_data: null,
    before_data: beforeData,
    entity_id: input.id,
    entity_type: input.entity
  });

  if (auditError) {
    return {
      ok: false,
      message: `${target.label}을(를) 삭제했지만 감사 로그 기록에 실패했습니다.`
    };
  }

  return { ok: true };
}

// ── Admin: 콘텐츠 기획 (content_plans) ──────────────────────
// "무엇을 만들 것인가"를 적어두는 내부 기획. 인사이트 → 기획 → 제작(productions) 흐름.
// 012_content_plans.sql 참조. 공개 사이트에는 노출되지 않는다.

export type ContentPlanPriority = "high" | "medium" | "low";

export type ContentPlanStatus =
  | "planned"
  | "in_progress"
  | "published"
  | "dropped";

export type AdminContentPlan = {
  id: string;
  title: string;
  titleEn: string | null;
  category: string | null;
  priority: ContentPlanPriority;
  status: ContentPlanStatus;
  insightNote: string | null;
  targetWeek: string | null;
  targetDate: string | null;
  body: string | null;
  productionId: string | null;
  productionTitle: string | null;
  updatedAt: string | null;
};

type AdminContentPlanRow = {
  id: string;
  title: string;
  title_en: string | null;
  category: string | null;
  priority: ContentPlanPriority;
  status: ContentPlanStatus;
  insight_note: string | null;
  target_week: string | null;
  target_date: string | null;
  body: string | null;
  production_id: string | null;
  updated_at: string | null;
  productions: { title: string } | { title: string }[] | null;
};

const adminContentPlanColumns =
  "id, title, title_en, category, priority, status, insight_note, target_week, target_date, body, production_id, updated_at, productions(title)";

function mapAdminContentPlan(row: AdminContentPlanRow): AdminContentPlan {
  const production = Array.isArray(row.productions)
    ? row.productions[0]
    : row.productions;

  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en,
    category: row.category,
    priority: row.priority,
    status: row.status,
    insightNote: row.insight_note,
    targetWeek: row.target_week,
    targetDate: row.target_date,
    body: row.body,
    productionId: row.production_id,
    productionTitle: production?.title ?? null,
    updatedAt: row.updated_at
  };
}

export async function getAdminContentPlans(accessToken: string) {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_plans")
    .select(adminContentPlanColumns)
    .order("target_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) =>
    mapAdminContentPlan(row as unknown as AdminContentPlanRow)
  );
}

export type CreateAdminContentPlanInput = {
  actorId: string;
  body?: string | null;
  category?: string | null;
  insightNote?: string | null;
  priority: ContentPlanPriority;
  status: ContentPlanStatus;
  targetDate?: string | null;
  targetWeek?: string | null;
  title: string;
  titleEn?: string | null;
};

export type UpdateAdminContentPlanInput = CreateAdminContentPlanInput & {
  planId: string;
  productionId?: string | null;
};

function contentPlanWritePayload(input: CreateAdminContentPlanInput) {
  return {
    body: input.body?.trim() || null,
    category: input.category?.trim() || null,
    insight_note: input.insightNote?.trim() || null,
    priority: input.priority,
    status: input.status,
    target_date: input.targetDate?.trim() || null,
    target_week: input.targetWeek?.trim() || null,
    title: input.title.trim(),
    title_en: input.titleEn?.trim() || null,
    updated_at: new Date().toISOString()
  };
}

export async function createAdminContentPlan(
  accessToken: string,
  input: CreateAdminContentPlanInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  if (!input.title.trim()) {
    return { ok: false, message: "기획 주제는 필수입니다." };
  }

  const { data: afterData, error: insertError } = await supabase
    .from("content_plans")
    .insert({ ...contentPlanWritePayload(input), created_by: input.actorId })
    .select("*")
    .maybeSingle();

  if (insertError || !afterData) {
    return { ok: false, message: "기획을 생성할 수 없습니다." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "content_plan.create",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: null,
    entity_id: (afterData as { id: string }).id,
    entity_type: "content_plan"
  });

  if (auditError) {
    return { ok: false, message: "기획을 만들었지만 감사 로그 기록에 실패했습니다." };
  }

  return { ok: true };
}

export async function updateAdminContentPlan(
  accessToken: string,
  input: UpdateAdminContentPlanInput
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  if (!input.title.trim()) {
    return { ok: false, message: "기획 주제는 필수입니다." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("content_plans")
    .select("*")
    .eq("id", input.planId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "기획을 찾을 수 없습니다." };
  }

  const { data: afterData, error: updateError } = await supabase
    .from("content_plans")
    .update(contentPlanWritePayload(input))
    .eq("id", input.planId)
    .select("*")
    .maybeSingle();

  if (updateError || !afterData) {
    return { ok: false, message: "기획을 수정할 수 없습니다." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "content_plan.update",
    actor_id: input.actorId,
    after_data: afterData,
    before_data: beforeData,
    entity_id: input.planId,
    entity_type: "content_plan"
  });

  if (auditError) {
    return { ok: false, message: "기획을 수정했지만 감사 로그 기록에 실패했습니다." };
  }

  return { ok: true };
}

export async function deleteAdminContentPlan(
  accessToken: string,
  input: { actorId: string; planId: string }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("content_plans")
    .select("*")
    .eq("id", input.planId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "기획을 찾을 수 없습니다." };
  }

  const { error: deleteError } = await supabase
    .from("content_plans")
    .delete()
    .eq("id", input.planId);

  if (deleteError) {
    return { ok: false, message: "기획을 삭제할 수 없습니다." };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "content_plan.delete",
    actor_id: input.actorId,
    after_data: null,
    before_data: beforeData,
    entity_id: input.planId,
    entity_type: "content_plan"
  });

  if (auditError) {
    return { ok: false, message: "기획을 삭제했지만 감사 로그 기록에 실패했습니다." };
  }

  return { ok: true };
}

/**
 * 기획 → 제작 전환. 기획 내용을 바탕으로 촬영·제작 콘텐츠(productions)를 만들고
 * 기획에 연결한다. 기획 상태는 '진행 중'으로 바뀐다.
 */
export async function startProductionFromPlan(
  accessToken: string,
  input: { actorId: string; planId: string; slug: string }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  if (!input.slug.trim()) {
    return { ok: false, message: "제작 콘텐츠의 Slug는 필수입니다." };
  }

  const { data: planData, error: planError } = await supabase
    .from("content_plans")
    .select("*")
    .eq("id", input.planId)
    .maybeSingle();

  if (planError || !planData) {
    return { ok: false, message: "기획을 찾을 수 없습니다." };
  }

  const plan = planData as {
    id: string;
    title: string;
    title_en: string | null;
    body: string | null;
    production_id: string | null;
  };

  if (plan.production_id) {
    return { ok: false, message: "이미 제작 콘텐츠가 연결된 기획입니다." };
  }

  const { data: production, error: productionError } = await supabase
    .from("productions")
    .insert({
      slug: input.slug.trim(),
      title: plan.title_en?.trim() || plan.title,
      title_ko: plan.title,
      summary: plan.body,
      status: "draft",
      updated_at: new Date().toISOString()
    })
    .select("*")
    .maybeSingle();

  if (productionError || !production) {
    return {
      ok: false,
      message:
        "제작 콘텐츠를 만들 수 없습니다. Slug가 이미 쓰이고 있는지 확인하세요."
    };
  }

  const productionId = (production as { id: string }).id;

  const { data: afterPlan, error: linkError } = await supabase
    .from("content_plans")
    .update({
      production_id: productionId,
      status: "in_progress",
      updated_at: new Date().toISOString()
    })
    .eq("id", input.planId)
    .select("*")
    .maybeSingle();

  if (linkError || !afterPlan) {
    return {
      ok: false,
      message: "제작 콘텐츠는 만들었지만 기획에 연결하지 못했습니다."
    };
  }

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: "content_plan.start_production",
    actor_id: input.actorId,
    after_data: afterPlan,
    before_data: planData,
    entity_id: input.planId,
    entity_type: "content_plan"
  });

  if (auditError) {
    return {
      ok: false,
      message: "제작을 시작했지만 감사 로그 기록에 실패했습니다."
    };
  }

  return { ok: true };
}

// ── Admin: 콘텐츠 사진 업로드 ────────────────────────────────
// 어드민에서 고른 사진 파일을 Supabase Storage에 올리고, 공개 주소를 돌려준다.
// 014_content_images_storage.sql의 content-images 버킷을 쓴다.
// 이미지 주소는 각 테이블의 image_url / hero_image_url 컬럼에 저장된다.

const contentImageBucket = "content-images";

export type ImageOwnerType = "food" | "place" | "region" | "route";

// 테이블마다 사진 주소를 담는 컬럼 이름이 다르다.
const imageColumnByOwner: Record<
  ImageOwnerType,
  { table: string; column: string; label: string }
> = {
  food: { table: "foods", column: "image_url", label: "음식" },
  place: { table: "places", column: "image_url", label: "장소" },
  region: { table: "regions", column: "hero_image_url", label: "지역" },
  route: { table: "route_guides", column: "hero_image_url", label: "루트" }
};

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];

const maxImageBytes = 5 * 1024 * 1024;

function imageExtension(fileType: string) {
  if (fileType === "image/png") return "png";
  if (fileType === "image/webp") return "webp";
  if (fileType === "image/avif") return "avif";
  return "jpg";
}

export type ContentImage = {
  id: string;
  url: string;
  altText: string | null;
  displayOrder: number;
};

/** 한 콘텐츠에 붙은 사진 전부(순서대로). */
export async function getContentImages(
  ownerType: ImageOwnerType,
  ownerId: string
): Promise<ContentImage[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_images")
    .select("id, url, alt_text, display_order")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    altText: (row.alt_text as string | null) ?? null,
    displayOrder: row.display_order as number
  }));
}

/**
 * 갤러리의 첫 사진을 대표 사진(image_url / hero_image_url)에 반영한다.
 * 목록 카드는 대표 1장만 읽으므로 갤러리가 바뀔 때마다 맞춰준다.
 */
async function syncPrimaryImage(
  supabase: NonNullable<ReturnType<typeof createAuthenticatedClient>>,
  ownerType: ImageOwnerType,
  ownerId: string
) {
  const target = imageColumnByOwner[ownerType];

  const { data } = await supabase
    .from("content_images")
    .select("url")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1);

  const firstUrl = (data?.[0]?.url as string | undefined) ?? null;

  await supabase
    .from(target.table)
    .update({ [target.column]: firstUrl, updated_at: new Date().toISOString() })
    .eq("id", ownerId);
}

/** 사진 한 장을 갤러리에 추가한다. */
export async function addContentImage(
  accessToken: string,
  input: {
    actorId: string;
    altText?: string | null;
    file: { name: string; type: string; size: number; bytes: ArrayBuffer };
    ownerId: string;
    ownerType: ImageOwnerType;
  }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const target = imageColumnByOwner[input.ownerType];

  if (!target) {
    return { ok: false, message: "지원하지 않는 콘텐츠 유형입니다." };
  }

  if (!allowedImageTypes.includes(input.file.type)) {
    return {
      ok: false,
      message: "JPG · PNG · WebP · AVIF 형식만 올릴 수 있습니다."
    };
  }

  if (input.file.size > maxImageBytes) {
    return { ok: false, message: "사진은 5MB 이하만 올릴 수 있습니다." };
  }

  if (input.file.size === 0) {
    return { ok: false, message: "선택된 파일이 비어 있습니다." };
  }

  // 캐시 때문에 옛 사진이 남지 않도록 매번 새 파일명을 쓴다.
  const stamp = Date.now().toString(36);
  const suffix = Math.floor(Math.random() * 1e6).toString(36);
  const path = `${input.ownerType}/${input.ownerId}/${stamp}${suffix}.${imageExtension(input.file.type)}`;

  const { error: uploadError } = await supabase.storage
    .from(contentImageBucket)
    .upload(path, input.file.bytes, {
      contentType: input.file.type,
      upsert: false
    });

  if (uploadError) {
    return {
      ok: false,
      message:
        "사진을 저장소에 올리지 못했습니다. 저장소 설정(content-images 버킷)이 되어 있는지 확인하세요."
    };
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(contentImageBucket).getPublicUrl(path);

  // 맨 뒤에 붙인다.
  const { data: lastRow } = await supabase
    .from("content_images")
    .select("display_order")
    .eq("owner_type", input.ownerType)
    .eq("owner_id", input.ownerId)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = ((lastRow?.[0]?.display_order as number | undefined) ?? 0) + 10;

  const { data: inserted, error: insertError } = await supabase
    .from("content_images")
    .insert({
      alt_text: input.altText?.trim() || null,
      created_by: input.actorId,
      display_order: nextOrder,
      owner_id: input.ownerId,
      owner_type: input.ownerType,
      storage_path: path,
      url: publicUrl
    })
    .select("*")
    .maybeSingle();

  if (insertError || !inserted) {
    await supabase.storage.from(contentImageBucket).remove([path]);
    return { ok: false, message: "사진 정보를 저장하지 못했습니다." };
  }

  await syncPrimaryImage(supabase, input.ownerType, input.ownerId);

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: `${input.ownerType}.image_add`,
    actor_id: input.actorId,
    after_data: inserted,
    before_data: null,
    entity_id: input.ownerId,
    entity_type: input.ownerType
  });

  if (auditError) {
    return { ok: false, message: "사진은 올렸지만 감사 로그 기록에 실패했습니다." };
  }

  return { ok: true };
}

/** 갤러리에서 사진 한 장을 지운다(저장소 파일도 함께). */
export async function deleteContentImage(
  accessToken: string,
  input: { actorId: string; imageId: string }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: beforeData, error: beforeError } = await supabase
    .from("content_images")
    .select("*")
    .eq("id", input.imageId)
    .maybeSingle();

  if (beforeError || !beforeData) {
    return { ok: false, message: "사진을 찾을 수 없습니다." };
  }

  const image = beforeData as {
    owner_type: ImageOwnerType;
    owner_id: string;
    storage_path: string;
  };

  const { error: deleteError } = await supabase
    .from("content_images")
    .delete()
    .eq("id", input.imageId);

  if (deleteError) {
    return { ok: false, message: "사진을 지우지 못했습니다." };
  }

  await supabase.storage.from(contentImageBucket).remove([image.storage_path]);
  await syncPrimaryImage(supabase, image.owner_type, image.owner_id);

  const { error: auditError } = await supabase.from("admin_audit_logs").insert({
    action: `${image.owner_type}.image_delete`,
    actor_id: input.actorId,
    after_data: null,
    before_data: beforeData,
    entity_id: image.owner_id,
    entity_type: image.owner_type
  });

  if (auditError) {
    return { ok: false, message: "사진은 지웠지만 감사 로그 기록에 실패했습니다." };
  }

  return { ok: true };
}

/** 사진 순서를 한 칸 옮긴다. 맨 앞 사진이 대표 사진이 된다. */
export async function moveContentImage(
  accessToken: string,
  input: { actorId: string; direction: "up" | "down"; imageId: string }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: currentData, error: currentError } = await supabase
    .from("content_images")
    .select("*")
    .eq("id", input.imageId)
    .maybeSingle();

  if (currentError || !currentData) {
    return { ok: false, message: "사진을 찾을 수 없습니다." };
  }

  const current = currentData as {
    id: string;
    owner_type: ImageOwnerType;
    owner_id: string;
    display_order: number;
  };

  // 옮길 자리에 있는 사진(바로 앞 또는 바로 뒤)을 찾아 순서를 맞바꾼다.
  const { data: neighbourRows } = await supabase
    .from("content_images")
    .select("*")
    .eq("owner_type", current.owner_type)
    .eq("owner_id", current.owner_id)
    .order("display_order", { ascending: input.direction === "down" })
    .limit(50);

  const ordered = (neighbourRows ?? []) as Array<{
    id: string;
    display_order: number;
  }>;
  const currentIndex = ordered.findIndex((row) => row.id === current.id);
  const neighbour = ordered[currentIndex + 1];

  if (!neighbour) {
    // 이미 맨 끝이면 아무것도 하지 않는다.
    return { ok: true };
  }

  await supabase
    .from("content_images")
    .update({ display_order: neighbour.display_order })
    .eq("id", current.id);
  await supabase
    .from("content_images")
    .update({ display_order: current.display_order })
    .eq("id", neighbour.id);

  await syncPrimaryImage(supabase, current.owner_type, current.owner_id);

  await supabase.from("admin_audit_logs").insert({
    action: `${current.owner_type}.image_reorder`,
    actor_id: input.actorId,
    after_data: null,
    before_data: currentData,
    entity_id: current.owner_id,
    entity_type: current.owner_type
  });

  return { ok: true };
}

/** 드래그로 바뀐 순서를 통째로 저장한다. orderedIds 순서대로 display_order를 0,1,2…로 다시 매긴다. */
export async function reorderContentImages(
  accessToken: string,
  input: {
    actorId: string;
    ownerType: ImageOwnerType;
    ownerId: string;
    orderedIds: string[];
  }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  if (input.orderedIds.length === 0) {
    return { ok: true };
  }

  // 넘어온 id가 실제 이 콘텐츠의 사진인지 확인(엉뚱한 id 차단).
  const { data: rows } = await supabase
    .from("content_images")
    .select("id")
    .eq("owner_type", input.ownerType)
    .eq("owner_id", input.ownerId);

  const owned = new Set((rows ?? []).map((row) => (row as { id: string }).id));
  const ids = input.orderedIds.filter((id) => owned.has(id));

  if (ids.length === 0) {
    return { ok: false, message: "순서를 바꿀 사진을 찾지 못했습니다." };
  }

  for (let index = 0; index < ids.length; index += 1) {
    await supabase
      .from("content_images")
      .update({ display_order: index })
      .eq("id", ids[index]);
  }

  await syncPrimaryImage(supabase, input.ownerType, input.ownerId);

  await supabase.from("admin_audit_logs").insert({
    action: `${input.ownerType}.image_reorder`,
    actor_id: input.actorId,
    after_data: { orderedIds: ids },
    before_data: null,
    entity_id: input.ownerId,
    entity_type: input.ownerType
  });

  return { ok: true };
}

/** 사진 한 장을 맨 앞(대표 사진)으로 보낸다. 20장 이상일 때 한 칸씩 옮기지 않도록. */
export async function setPrimaryContentImage(
  accessToken: string,
  input: { actorId: string; imageId: string }
): Promise<AdminMutationResult> {
  const supabase = createAuthenticatedClient(accessToken);

  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { data: currentData, error: currentError } = await supabase
    .from("content_images")
    .select("*")
    .eq("id", input.imageId)
    .maybeSingle();

  if (currentError || !currentData) {
    return { ok: false, message: "사진을 찾을 수 없습니다." };
  }

  const current = currentData as {
    id: string;
    owner_type: ImageOwnerType;
    owner_id: string;
    display_order: number;
  };

  // 현재 맨 앞 사진의 순서값보다 하나 작게 주면 맨 앞으로 온다(전체 renumber 없이).
  const { data: firstRow } = await supabase
    .from("content_images")
    .select("display_order")
    .eq("owner_type", current.owner_type)
    .eq("owner_id", current.owner_id)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const firstOrder = (firstRow?.display_order as number | undefined) ?? current.display_order;

  if (current.display_order <= firstOrder) {
    // 이미 맨 앞이면 아무것도 하지 않는다.
    return { ok: true };
  }

  await supabase
    .from("content_images")
    .update({ display_order: firstOrder - 1 })
    .eq("id", current.id);

  await syncPrimaryImage(supabase, current.owner_type, current.owner_id);

  await supabase.from("admin_audit_logs").insert({
    action: `${current.owner_type}.image_set_primary`,
    actor_id: input.actorId,
    after_data: null,
    before_data: currentData,
    entity_id: current.owner_id,
    entity_type: current.owner_type
  });

  return { ok: true };
}

/** 공개 주소에서 저장소 경로를 되짚어 파일을 지운다(우리 버킷 파일일 때만). */
async function removeStoredImage(
  supabase: ReturnType<typeof createAuthenticatedClient>,
  publicUrl: string | null
) {
  if (!supabase || !publicUrl) {
    return;
  }

  const marker = `/${contentImageBucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return;
  }

  const path = publicUrl.slice(markerIndex + marker.length);

  if (!path) {
    return;
  }

  await supabase.storage.from(contentImageBucket).remove([path]);
}
