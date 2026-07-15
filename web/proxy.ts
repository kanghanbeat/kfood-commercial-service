import { NextRequest, NextResponse } from "next/server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

const adminAccessTokenCookie = "kfood_admin_access_token";
const adminRefreshTokenCookie = "kfood_admin_refresh_token";

const adminSessionMaxAge = 60 * 60;
const refreshSkewSeconds = 60 * 5;

type RefreshResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

type RequestCookieJar = Map<string, string>;
type ResponseCookie = {
  name: string;
  options: CookieOptions;
  value: string;
};

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

function setSessionCookies(
  requestCookies: RequestCookieJar,
  session: RefreshResult
) {
  requestCookies.set(adminAccessTokenCookie, session.access_token);
  requestCookies.set(adminRefreshTokenCookie, session.refresh_token);
}

function clearSessionCookies(requestCookies: RequestCookieJar) {
  requestCookies.delete(adminAccessTokenCookie);
  requestCookies.delete(adminRefreshTokenCookie);
}

async function refreshAdminScopeIfNeeded(
  request: NextRequest,
  requestCookies: RequestCookieJar
) {
  const accessToken = request.cookies.get(adminAccessTokenCookie)?.value;
  const refreshToken = request.cookies.get(adminRefreshTokenCookie)?.value;

  if (!shouldRefresh(accessToken)) {
    return;
  }

  const refreshedSession = await refreshSession(refreshToken);

  if (!refreshedSession) {
    // 갱신 요청 자체가 실패해도, 지금 가진 토큰이 아직 만료 전이면 그대로 둔다.
    // (일시적 네트워크 문제로 멀쩡한 세션을 지우는 것을 방지 — 다음 요청에서 다시 시도됨)
    if (isExpired(accessToken)) {
      clearSessionCookies(requestCookies);
    }
    return;
  }

  setSessionCookies(requestCookies, refreshedSession);
}

function updateRequestCookieJar(
  requestCookies: RequestCookieJar,
  cookie: ResponseCookie
) {
  if (cookie.options.maxAge === 0 || cookie.value === "") {
    // 공개 세션 쿠키는 지우지 않는다(위 writeSupabaseResponseCookies와 동일 이유).
    // 미들웨어가 현재 요청의 다운스트림 페이지에 넘길 쿠키에서 세션을 빼버리면
    // 그 페이지(mypage 등)가 즉시 로그인으로 튕긴다.
    if (isSupabaseAuthCookieName(cookie.name)) {
      return;
    }
    requestCookies.delete(cookie.name);
    return;
  }

  requestCookies.set(cookie.name, cookie.value);
}

async function syncPublicSupabaseSession(requestCookies: RequestCookieJar) {
  const config = getSupabaseConfig();
  const cookiesToSet: ResponseCookie[] = [];
  const headersToSet: Record<string, string> = {};

  if (!config) {
    return { cookiesToSet, headersToSet };
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return Array.from(requestCookies.entries()).map(([name, value]) => ({
          name,
          value
        }));
      },
      setAll(nextCookies, nextHeaders) {
        nextCookies.forEach((cookie) => {
          updateRequestCookieJar(requestCookies, cookie);
          cookiesToSet.push(cookie);
        });
        Object.assign(headersToSet, nextHeaders);
      }
    }
  });

  await supabase.auth.getUser();

  return { cookiesToSet, headersToSet };
}

function getRequestCookieJar(request: NextRequest): RequestCookieJar {
  return new Map(
    request.cookies.getAll().map((cookie) => [cookie.name, cookie.value])
  );
}

function serializeCookieHeader(cookies: RequestCookieJar) {
  return Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function writeResponseCookies(
  request: NextRequest,
  response: NextResponse,
  requestCookies: RequestCookieJar
) {
  const secure = process.env.NODE_ENV === "production";

  const writeHttpOnlyCookie = (
    name: string,
    path: string,
    maxAge: number,
    fallbackValue?: string
  ) => {
    const originalValue = request.cookies.get(name)?.value;
    const nextValue = requestCookies.get(name);

    if (nextValue && nextValue !== originalValue) {
      response.cookies.set(name, nextValue, {
        httpOnly: true,
        maxAge,
        path,
        sameSite: "lax",
        secure
      });
      return;
    }

    if (!nextValue && originalValue) {
      response.cookies.set(name, "", {
        httpOnly: true,
        maxAge: 0,
        path,
        sameSite: "lax",
        secure
      });
      return;
    }

    if (fallbackValue && !originalValue && nextValue === fallbackValue) {
      response.cookies.set(name, fallbackValue, {
        httpOnly: true,
        maxAge,
        path,
        sameSite: "lax",
        secure
      });
    }
  };

  writeHttpOnlyCookie(
    adminAccessTokenCookie,
    "/admin",
    adminSessionMaxAge
  );
  writeHttpOnlyCookie(
    adminRefreshTokenCookie,
    "/admin",
    adminSessionMaxAge
  );
}

function isSupabaseAuthCookieName(name: string) {
  return name.startsWith("sb-") && name.includes("auth-token");
}

function writeSupabaseResponseCookies(
  response: NextResponse,
  cookiesToSet: ResponseCookie[],
  headersToSet: Record<string, string>
) {
  cookiesToSet.forEach(({ name, options, value }) => {
    // 미들웨어는 공개 세션 쿠키를 "삭제"하지 않는다.
    // getUser()가 일시적 이유(네트워크 hiccup, refresh rotation 타이밍)로
    // 세션을 무효 판단하면 setAll이 빈 값/maxAge 0으로 삭제를 지시하는데,
    // 그대로 반영하면 방금 로그인한 멀쩡한 세션까지 날아간다
    // (로그인 직후 두 번째 요청에서 로그아웃되는 버그의 원인).
    // 실제 로그아웃은 /auth/logout이 담당하므로 미들웨어는 삭제를 건너뛴다.
    const isAuthDeletion =
      isSupabaseAuthCookieName(name) && (options.maxAge === 0 || value === "");

    if (isAuthDeletion) {
      return;
    }

    response.cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === "production"
    });
  });

  Object.entries(headersToSet).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

// Next.js가 화면의 링크를 미리 당겨오는 프리페치 요청인지 판별한다.
// mypage처럼 링크가 많은 페이지는 진입 순간 수십 개의 프리페치가 동시에
// 미들웨어를 때리는데, 그 요청마다 세션 토큰을 갱신(회전)하면 회전 충돌로
// 방금 로그인한 세션이 폐기된다. 프리페치는 화면에 실제로 반영되지 않는
// 사변적 요청이므로 세션 쿠키를 건드리지 않고 통과시킨다.
function isPrefetchRequest(request: NextRequest) {
  if (request.headers.get("next-router-prefetch") === "1") {
    return true;
  }
  const purpose =
    request.headers.get("sec-purpose") ?? request.headers.get("purpose") ?? "";
  return purpose.includes("prefetch");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestCookies = getRequestCookieJar(request);
  const requestHeaders = new Headers(request.headers);

  // 프리페치 요청은 세션을 갱신/삭제하지 않고 그대로 통과시킨다
  // (동시 프리페치의 토큰 회전 충돌로 세션이 날아가는 것을 막는다).
  if (isPrefetchRequest(request)) {
    const passthrough = NextResponse.next({ request: { headers: requestHeaders } });
    if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
      return passthrough;
    }
    const hasAdminAccessToken = requestCookies.get(adminAccessTokenCookie);
    if (hasAdminAccessToken) {
      return passthrough;
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const publicSessionSync = await syncPublicSupabaseSession(requestCookies);
  await refreshAdminScopeIfNeeded(request, requestCookies);

  requestHeaders.set("cookie", serializeCookieHeader(requestCookies));
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  writeResponseCookies(request, response, requestCookies);
  writeSupabaseResponseCookies(
    response,
    publicSessionSync.cookiesToSet,
    publicSessionSync.headersToSet
  );

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")) {
    return response;
  }

  if (!pathname.startsWith("/admin")) {
    return response;
  }

  // 개발용 어드민 미리보기 스위치. 프로덕션에선 절대 동작하지 않음(NODE_ENV 가드).
  // .env.local 에 ADMIN_PREVIEW=true 일 때만 로컬에서 로그인 없이 어드민 열람.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW === "true"
  ) {
    return response;
  }

  const hasAdminAccess =
    response.cookies.get(adminAccessTokenCookie)?.value ||
    requestCookies.get(adminAccessTokenCookie);

  if (hasAdminAccess) {
    return response;
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ]
};
