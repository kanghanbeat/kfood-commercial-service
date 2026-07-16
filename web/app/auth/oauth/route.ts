import { NextRequest, NextResponse } from "next/server";

import { getRequestOrigin, getSafeNextPath } from "@/lib/public-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

const supportedProviders = ["google", "kakao"] as const;

type SupportedProvider = (typeof supportedProviders)[number];

function isSupportedProvider(value: string): value is SupportedProvider {
  return (supportedProviders as readonly string[]).includes(value);
}

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", nextPath);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const provider = requestUrl.searchParams.get("provider") ?? "";
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!isSupportedProvider(provider)) {
    return redirectWithError(request, "Unsupported login provider.", nextPath);
  }

  const routeClient = createSupabaseRouteClient(request);

  if (!routeClient) {
    return redirectWithError(request, "Supabase Auth is not configured.", nextPath);
  }

  const origin = await getRequestOrigin();
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  const { data, error } = await routeClient.supabase.auth.signInWithOAuth({
    options: {
      redirectTo: callbackUrl.toString()
    },
    provider
  });

  if (error || !data.url) {
    return redirectWithError(
      request,
      "Could not start social sign-in. The provider may not be enabled yet.",
      nextPath
    );
  }

  // PKCE code verifier 쿠키를 제공자 이동 응답에 직접 실어야
  // 콜백에서 코드 교환이 성립한다.
  const response = NextResponse.redirect(data.url, { status: 303 });
  routeClient.applyCookies(response);
  return response;
}
