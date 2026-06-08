export type PublicationStatus = "draft" | "published" | "hidden" | "archived";
export type ReportStatus = "pending" | "in_review" | "resolved" | "ignored";
export type UserRole = "user" | "editor" | "admin";

export type Region = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  intro: string;
  heroImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  bestForTags: string[];
  displayOrder: number;
  status: PublicationStatus;
};

export type Food = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  romanizedName?: string | null;
  description: string;
  tasteProfile?: string | null;
  spicyLevel: 0 | 1 | 2 | 3 | 4;
  beginnerNote?: string | null;
  eatingGuide?: string | null;
  cautionNote?: string | null;
  imageUrl?: string | null;
  status: PublicationStatus;
};

export type Place = {
  id: string;
  slug: string;
  regionId: string;
  nameEn: string;
  nameKo?: string | null;
  addressEn?: string | null;
  addressKo?: string | null;
  editorialNote: string;
  googleMapsUrl?: string | null;
  naverMapsUrl?: string | null;
  touristTags: string[];
  trustTags: string[];
  cautionTags: string[];
  lastVerifiedAt?: string | null;
  isSponsored: boolean;
  affiliateUrl?: string | null;
  sponsorshipNote?: string | null;
  status: PublicationStatus;
};

export type RouteGuide = {
  id: string;
  slug: string;
  regionId: string;
  title: string;
  summary: string;
  estimatedDuration?: string | null;
  transportMode?: string | null;
  recommendedForTags: string[];
  status: PublicationStatus;
};

export type ContentReport = {
  id: string;
  pageUrl: string;
  entityType?: string | null;
  entityId?: string | null;
  reportType: string;
  message: string;
  userEmail?: string | null;
  status: ReportStatus;
  adminNote?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
};
