import { NextRequest, NextResponse } from "next/server";

import { clearLegacyPublicAuthCookiesOnResponse } from "@/lib/public-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/route-client";

// 반드시 POST여야 한다. GET이면 Next.js <Link> 프리페치(화면의 링크를 미리
// 당겨오는 동작)가 이 라우트를 실제 실행해서, 로그인 직후 마이페이지의
// Sign out 링크가 프리페치되는 순간 세션이 통째로 폐기된다
// (모든 PC에서 재현되던 "로그인 풀림" 버그의 근본 원인).
export async function POST(request: NextRequest) {
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
