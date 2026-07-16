import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { enableMyJourneyShare, isBoardEnabled } from "@kfood/data";

import { getPublicSession } from "@/lib/public-auth";

function redirectToJourney(request: NextRequest, message?: string) {
  const url = new URL("/mypage/journey", request.url);
  if (message) {
    url.searchParams.set("error", message);
  }
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  if (!(await isBoardEnabled("journey_share"))) {
    return redirectToJourney(request, "Journey sharing is currently unavailable.");
  }

  const session = await getPublicSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", "/mypage/journey");
    loginUrl.searchParams.set("error", "Please sign in again.");
    return NextResponse.redirect(loginUrl);
  }

  const result = await enableMyJourneyShare(session.accessToken);

  if (!result.ok) {
    return redirectToJourney(request, result.message);
  }

  revalidatePath("/mypage/journey");
  return redirectToJourney(request);
}
