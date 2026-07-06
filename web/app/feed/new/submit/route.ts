import { NextRequest, NextResponse } from "next/server";

import {
  createUserPost,
  type SupportedLanguage,
  type UserPostVisibility
} from "@kfood/data";

import { ensurePublicProfile, getPublicSession } from "@/lib/public-auth";

const languageValues: SupportedLanguage[] = ["en", "ko", "ja", "zh"];
const visibilityValues: UserPostVisibility[] = ["public", "private", "unlisted"];

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/feed/new", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const session = await getPublicSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", "/feed/new");
    loginUrl.searchParams.set("error", "Please sign in again.");
    return NextResponse.redirect(loginUrl);
  }

  await ensurePublicProfile(session);

  const formData = await request.formData();
  const language = String(formData.get("language") ?? "en") as SupportedLanguage;
  const visibility = String(
    formData.get("visibility") ?? "public"
  ) as UserPostVisibility;

  if (!languageValues.includes(language)) {
    return redirectWithError(request, "Choose a supported language.");
  }

  if (!visibilityValues.includes(visibility)) {
    return redirectWithError(request, "Choose a supported visibility.");
  }

  const result = await createUserPost(session.accessToken, {
    authorId: session.userId,
    body: String(formData.get("body") ?? ""),
    foodSlug: String(formData.get("food_slug") ?? "") || null,
    language,
    placeSlug: String(formData.get("place_slug") ?? "") || null,
    regionSlug: String(formData.get("region_slug") ?? "") || null,
    routeSlug: String(formData.get("route_slug") ?? "") || null,
    visibility
  });

  if (!result.ok) {
    return redirectWithError(request, result.message);
  }

  const url = new URL("/mypage", request.url);
  url.searchParams.set("updated", "1");
  return NextResponse.redirect(url);
}
