import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { setFoodTried } from "@kfood/data";

import { getPublicSession } from "@/lib/public-auth";

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
  const foodSlug = String(formData.get("food_slug") ?? "").trim();
  const tried = String(formData.get("tried") ?? "") === "1";

  if (!foodSlug) {
    return redirectToMypage(request, "error", "Dish not found.");
  }

  const result = await setFoodTried(session.accessToken, session.userId, foodSlug, tried);

  if (!result.ok) {
    return redirectToMypage(request, "error", result.message);
  }

  revalidatePath("/mypage");
  return redirectToMypage(request, "updated", "1");
}
