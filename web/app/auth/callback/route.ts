import { NextRequest, NextResponse } from "next/server";

import {
  clearLegacyPublicAuthCookiesOnResponse,
  ensurePublicProfile,
  getSafeNextPath
} from "@/lib/public-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", nextPath);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (error) {
    return redirectWithError(request, error, nextPath);
  }

  if (!code) {
    return redirectWithError(request, "Missing authentication code.", nextPath);
  }

  const routeClient = createSupabaseRouteClient(request);

  if (!routeClient) {
    return redirectWithError(request, "Supabase Auth is not configured.", nextPath);
  }

  const { data, error: exchangeError } =
    await routeClient.supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.session || !data.user) {
    return redirectWithError(
      request,
      "Could not complete sign-in. Check OAuth provider redirect settings.",
      nextPath
    );
  }

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name:
      typeof data.user.user_metadata.name === "string"
        ? data.user.user_metadata.name
        : null,
    provider:
      typeof data.user.app_metadata.provider === "string"
        ? data.user.app_metadata.provider
        : null,
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
