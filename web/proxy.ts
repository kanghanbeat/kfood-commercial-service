import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

const adminAccessTokenCookie = "kfood_admin_access_token";
const adminRefreshTokenCookie = "kfood_admin_refresh_token";

const adminSessionMaxAge = 60 * 60;
const refreshSkewSeconds = 60 * 5;

type RefreshResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

// 어드민 세션 쿠키를 이번 응답에서 어떻게 처리할지.
// null = 건드리지 않음, "clear" = 만료돼서 삭제, 객체 = 갱신된 토큰으로 교체.
type AdminCookieUpdate = { access: string; refresh: string } | "clear" | null;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
}

function getJwtExpiresAt(token: string | undefined) {
  if (!token) {
    return 0;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return 0;
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(normalizedPayload)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? decoded.exp : 0;
  } catch {
    return 0;
  }
}

function shouldRefresh(accessToken: string | undefined) {
  const expiresAt = getJwtExpiresAt(accessToken);

  if (!expiresAt) {
    return false;
  }

  return expiresAt - Math.floor(Date.now() / 1000) <= refreshSkewSeconds;
}

// 만료 임박(skew) 판단과 별개로, "진짜 만료됐는지"만 본다.
// refreshSession()이 일시적으로 실패했을 때(네트워크 hiccup 등) 아직 유효한
// 토큰까지 지워버리지 않기 위한 구분 — 진짜 만료된 경우에만 세션을 지운다.
function isExpired(accessToken: string | undefined) {
  const expiresAt = getJwtExpiresAt(accessToken);

  if (!expiresAt) {
    return false;
  }

  return expiresAt - Math.floor(Date.now() / 1000) <= 0;
}

async function refreshSession(refreshToken: string | undefined) {
  const config = getSupabaseConfig();

  if (!config || !refreshToken) {
    return null;
  }

  const response = await fetch(
    `${config.url}/auth/v1/token?grant_type=refresh_token`,
    {
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: {
        apikey: config.anonKey,
        "content-type": "application/json"
      },
      method: "POST"
    }
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as RefreshResult;
}

// 어드민 세션(경로 /admin 한정 커스텀 쿠키)은 공개 세션과 완전히 분리해서 관리한다.
async function computeAdminUpdate(
  request: NextRequest
): Promise<AdminCookieUpdate> {
  const accessToken = request.cookies.get(adminAccessTokenCookie)?.value;
  const refreshToken = request.cookies.get(adminRefreshTokenCookie)?.value;

  if (!shouldRefresh(accessToken)) {
    return null;
  }

  const refreshedSession = await refreshSession(refreshToken);

  if (!refreshedSession) {
    // 갱신 요청 자체가 실패해도, 지금 가진 토큰이 아직 만료 전이면 그대로 둔다.
    return isExpired(accessToken) ? "clear" : null;
  }

  return {
    access: refreshedSession.access_token,
    refresh: refreshedSession.refresh_token
  };
}

function applyAdminCookies(response: NextResponse, update: AdminCookieUpdate) {
  if (!update) {
    return;
  }

  const base = {
    httpOnly: true,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  if (update === "clear") {
    response.cookies.set(adminAccessTokenCookie, "", { ...base, maxAge: 0 });
    response.cookies.set(adminRefreshTokenCookie, "", { ...base, maxAge: 0 });
    return;
  }

  response.cookies.set(adminAccessTokenCookie, update.access, {
    ...base,
    maxAge: adminSessionMaxAge
  });
  response.cookies.set(adminRefreshTokenCookie, update.refresh, {
    ...base,
    maxAge: adminSessionMaxAge
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) 어드민 세션 갱신 — 다운스트림 페이지가 새 토큰을 읽도록 요청 쿠키에 반영
  const adminUpdate = await computeAdminUpdate(request);

  if (adminUpdate === "clear") {
    request.cookies.delete(adminAccessTokenCookie);
    request.cookies.delete(adminRefreshTokenCookie);
  } else if (adminUpdate) {
    request.cookies.set(adminAccessTokenCookie, adminUpdate.access);
    request.cookies.set(adminRefreshTokenCookie, adminUpdate.refresh);
  }

  // 2) 공개 세션 — Supabase 공식(@supabase/ssr) 미들웨어 패턴 그대로.
  // getUser()가 필요 시 토큰을 갱신하고, setAll이 요청/응답 양쪽에 반영한다.
  // 쿠키 삭제 가드·프리페치 우회 같은 커스텀 로직은 두지 않는다(과거 로그인
  // 풀림 버그의 원인이 이런 커스텀 배선이었다).
  let response = NextResponse.next({ request });
  applyAdminCookies(response, adminUpdate);

  const config = getSupabaseConfig();

  if (config) {
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          applyAdminCookies(response, adminUpdate);
          cookiesToSet.forEach(({ name, options, value }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    });

    await supabase.auth.getUser();
  }

  // 3) 어드민 접근 게이트
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/logout")
  ) {
    // 개발용 어드민 미리보기 스위치. 프로덕션에선 절대 동작하지 않음(NODE_ENV 가드).
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ADMIN_PREVIEW === "true"
    ) {
      return response;
    }

    const hasAdminAccess = request.cookies.get(adminAccessTokenCookie)?.value;

    if (!hasAdminAccess) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ]
};
