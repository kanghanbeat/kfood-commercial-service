import { NextRequest, NextResponse } from "next/server";

import { clearLegacyPublicAuthCookiesOnResponse } from "@/lib/public-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

export async function GET(request: NextRequest) {
  const routeClient = createSupabaseRouteClient(request);

  if (routeClient) {
    await routeClient.supabase.auth.signOut();
  }

  // signOut이 지시한 세션 쿠키 삭제를 "반환하는 응답"에 직접 실어
  // 브라우저에서 확실히 지워지게 한다.
  const response = NextResponse.redirect(new URL("/", request.url), {
    status: 303
  });
  routeClient?.applyCookies(response);
  clearLegacyPublicAuthCookiesOnResponse(response);
  return response;
}
