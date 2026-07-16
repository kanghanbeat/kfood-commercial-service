import { NextRequest, NextResponse } from "next/server";

import {
  clearLegacyPublicAuthCookiesOnResponse,
  ensurePublicProfile,
  getSafeNextPath
} from "@/lib/public-auth";
import { isTransientAuthError, signInWithPasswordResilient } from "@/lib/sign-in-retry";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", nextPath);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/mypage"));

  if (!email || !password) {
    return redirectWithError(request, "Enter your email and password.", nextPath);
  }

  const routeClient = createSupabaseRouteClient(request);

  if (!routeClient) {
    return redirectWithError(request, "Supabase Auth is not configured.", nextPath);
  }

  const { data, error } = await signInWithPasswordResilient(
    routeClient.supabase,
    email,
    password
  );

  if (error || !data.session || !data.user) {
    if (isTransientAuthError(error)) {
      return redirectWithError(
        request,
        "Sign-in service is temporarily unavailable. Please try again.",
        nextPath
      );
    }

    return redirectWithError(
      request,
      "Could not sign in. Check your email and password.",
      nextPath
    );
  }

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name:
      typeof data.user.user_metadata.display_name === "string"
        ? data.user.user_metadata.display_name
        : typeof data.user.user_metadata.name === "string"
          ? data.user.user_metadata.name
          : null,
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
