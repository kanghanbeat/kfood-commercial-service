import { NextRequest, NextResponse } from "next/server";

const adminAccessTokenCookie = "kfood_admin_access_token";
const adminRefreshTokenCookie = "kfood_admin_refresh_token";
const publicAccessTokenCookie = "kfood_public_access_token";
const publicRefreshTokenCookie = "kfood_public_refresh_token";
const publicSignedInCookie = "kfood_public_signed_in";

const adminSessionMaxAge = 60 * 60;
const publicSessionMaxAge = 60 * 60 * 24 * 7;
const refreshSkewSeconds = 60 * 5;

type RefreshResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

type RequestCookieJar = Map<string, string>;

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
  scope: "admin" | "public",
  session: RefreshResult
) {
  if (scope === "admin") {
    requestCookies.set(adminAccessTokenCookie, session.access_token);
    requestCookies.set(adminRefreshTokenCookie, session.refresh_token);
    return;
  }

  requestCookies.set(publicAccessTokenCookie, session.access_token);
  requestCookies.set(publicRefreshTokenCookie, session.refresh_token);
  requestCookies.set(publicSignedInCookie, "1");
}

function clearSessionCookies(
  requestCookies: RequestCookieJar,
  scope: "admin" | "public"
) {
  if (scope === "admin") {
    requestCookies.delete(adminAccessTokenCookie);
    requestCookies.delete(adminRefreshTokenCookie);
    return;
  }

  requestCookies.delete(publicAccessTokenCookie);
  requestCookies.delete(publicRefreshTokenCookie);
  requestCookies.delete(publicSignedInCookie);
}

async function refreshScopeIfNeeded(
  request: NextRequest,
  requestCookies: RequestCookieJar,
  scope: "admin" | "public"
) {
  const accessToken =
    scope === "admin"
      ? request.cookies.get(adminAccessTokenCookie)?.value
      : request.cookies.get(publicAccessTokenCookie)?.value;
  const refreshToken =
    scope === "admin"
      ? request.cookies.get(adminRefreshTokenCookie)?.value
      : request.cookies.get(publicRefreshTokenCookie)?.value;

  if (!shouldRefresh(accessToken)) {
    return;
  }

  const refreshedSession = await refreshSession(refreshToken);

  if (!refreshedSession) {
    clearSessionCookies(requestCookies, scope);
    return;
  }

  setSessionCookies(requestCookies, scope, refreshedSession);
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
    publicAccessTokenCookie,
    "/",
    publicSessionMaxAge
  );
  writeHttpOnlyCookie(
    publicRefreshTokenCookie,
    "/",
    publicSessionMaxAge
  );
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

  const originalPublicHint = request.cookies.get(publicSignedInCookie)?.value;
  const nextPublicHint = requestCookies.get(publicSignedInCookie);

  if (nextPublicHint && nextPublicHint !== originalPublicHint) {
    response.cookies.set(publicSignedInCookie, nextPublicHint, {
      httpOnly: false,
      maxAge: publicSessionMaxAge,
      path: "/",
      sameSite: "lax",
      secure
    });
  }

  if (!nextPublicHint && originalPublicHint) {
    response.cookies.set(publicSignedInCookie, "", {
      httpOnly: false,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure
    });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestCookies = getRequestCookieJar(request);
  const requestHeaders = new Headers(request.headers);

  await Promise.all([
    refreshScopeIfNeeded(request, requestCookies, "public"),
    refreshScopeIfNeeded(request, requestCookies, "admin")
  ]);

  requestHeaders.set("cookie", serializeCookieHeader(requestCookies));
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  writeResponseCookies(request, response, requestCookies);

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
