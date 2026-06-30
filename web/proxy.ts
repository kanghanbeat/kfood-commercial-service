import { NextRequest, NextResponse } from "next/server";

const adminAccessTokenCookie = "kfood_admin_access_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 개발용 어드민 미리보기 스위치. 프로덕션에선 절대 동작하지 않음(NODE_ENV 가드).
  // .env.local 에 ADMIN_PREVIEW=true 가 있을 때만 로컬에서 로그인 없이 어드민 열람 가능.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW === "true"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")) {
    return NextResponse.next();
  }

  if (request.cookies.has(adminAccessTokenCookie)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
