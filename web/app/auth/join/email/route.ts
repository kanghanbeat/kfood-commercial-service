import { NextRequest, NextResponse } from "next/server";

import {
  clearLegacyPublicAuthCookiesOnResponse,
  ensurePublicProfile,
  getSafeNextPath
} from "@/lib/public-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const joinUrl = new URL("/auth/join", request.url);
  joinUrl.searchParams.set("next", nextPath);
  joinUrl.searchParams.set("error", message);
  return NextResponse.redirect(joinUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/mypage"));

  if (!email || !password) {
    return redirectWithError(request, "Enter your email and password.", nextPath);
  }

  if (password.length < 8) {
    return redirectWithError(
      request,
      "Password must be at least 8 characters.",
      nextPath
    );
  }

  if (displayName.length > 80) {
    return redirectWithError(
      request,
      "Display name must be 80 characters or fewer.",
      nextPath
    );
  }

  const routeClient = createSupabaseRouteClient(request);

  if (!routeClient) {
    return redirectWithError(request, "Supabase Auth is not configured.", nextPath);
  }

  const { data, error } = await routeClient.supabase.auth.signUp({
    email,
    options: {
      data: {
        display_name: displayName || null,
        name: displayName || null
      }
    },
    password
  });

  if (error || !data.user) {
    return redirectWithError(
      request,
      "Could not create the account. The email may already be registered.",
      nextPath
    );
  }

  if (!data.session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set(
      "notice",
      "Account created. Check your email before signing in."
    );
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name: displayName || (data.user.email ?? null),
    provider:
      typeof data.user.app_metadata.provider === "string"
        ? data.user.app_metadata.provider
        : "email",
    user: data.user,
    userId: data.user.id
  });

  // 세션 쿠키를 "반환하는 응답"에 직접 실어 브라우저 전달을 보장한다.
  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303
  });
  routeClient.applyCookies(response);
  clearLegacyPublicAuthCookiesOnResponse(response);
  return response;
}
