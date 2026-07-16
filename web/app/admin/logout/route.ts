import { NextRequest, NextResponse } from "next/server";

import { clearAdminAuthCookiesOnResponse } from "@/lib/admin-auth";

// 반드시 POST여야 한다. GET이면 <Link> 프리페치가 이 라우트를 실제 실행해서
// 어드민 화면을 여는 순간 세션 쿠키가 지워진다(공개 로그아웃과 동일한 함정).
export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminAuthCookiesOnResponse(response);
  return response;
}
