import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import {
  createAdminUserPost,
  type SupportedLanguage,
  type UserPostStatus,
  type UserPostVisibility
} from "@kfood/data";

import { getAdminSession } from "@/lib/admin-auth";

const languageValues: SupportedLanguage[] = ["en", "ko", "ja", "zh"];
const visibilityValues: UserPostVisibility[] = ["public", "private", "unlisted"];
const statusValues: Array<Extract<UserPostStatus, "pending_review" | "published">> = [
  "pending_review",
  "published"
];

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/admin/user-posts/new", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", "/admin/user-posts/new");
    loginUrl.searchParams.set("error", "Please sign in again.");
    return NextResponse.redirect(loginUrl);
  }

  const formData = await request.formData();
  const language = String(formData.get("language") ?? "en") as SupportedLanguage;
  const visibility = String(
    formData.get("visibility") ?? "public"
  ) as UserPostVisibility;
  const status = String(formData.get("status") ?? "published") as Extract<
    UserPostStatus,
    "pending_review" | "published"
  >;

  if (!languageValues.includes(language)) {
    return redirectWithError(request, "Choose a supported language.");
  }

  if (!visibilityValues.includes(visibility)) {
    return redirectWithError(request, "Choose a supported visibility.");
  }

  if (!statusValues.includes(status)) {
    return redirectWithError(request, "Choose a supported post status.");
  }

  const result = await createAdminUserPost(session.accessToken, {
    actorId: session.userId,
    authorId: session.userId,
    body: String(formData.get("body") ?? ""),
    foodSlug: String(formData.get("food_slug") ?? "") || null,
    language,
    moderationNote: String(formData.get("moderation_note") ?? ""),
    placeSlug: String(formData.get("place_slug") ?? "") || null,
    regionSlug: String(formData.get("region_slug") ?? "") || null,
    routeSlug: String(formData.get("route_slug") ?? "") || null,
    status,
    visibility
  });

  if (!result.ok) {
    return redirectWithError(request, result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/user-posts");
  const url = new URL("/admin/user-posts", request.url);
  url.searchParams.set("created", "1");
  return NextResponse.redirect(url);
}
