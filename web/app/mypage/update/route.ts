import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { updateMyProfile, type SupportedLanguage } from "@kfood/data";

import { getPublicSession } from "@/lib/public-auth";

const supportedLanguageValues: SupportedLanguage[] = ["en", "ko", "ja", "zh"];

function redirectToMypage(request: NextRequest, key: "error" | "updated", value: string) {
  const url = new URL("/mypage", request.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const session = await getPublicSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", "/mypage");
    loginUrl.searchParams.set("error", "Please sign in again.");
    return NextResponse.redirect(loginUrl);
  }

  const formData = await request.formData();
  const preferredLanguage = String(
    formData.get("preferred_language") ?? "en"
  ) as SupportedLanguage;

  if (!supportedLanguageValues.includes(preferredLanguage)) {
    return redirectToMypage(request, "error", "Choose a supported language.");
  }

  const result = await updateMyProfile(session.accessToken, {
    bio: String(formData.get("bio") ?? ""),
    displayName: String(formData.get("display_name") ?? ""),
    preferredLanguage
  });

  if (!result.ok) {
    return redirectToMypage(request, "error", result.message);
  }

  revalidatePath("/mypage");
  return redirectToMypage(request, "updated", "1");
}
