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
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalizedPayload)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? decoded.exp : 0;
  } catch {
    return 0;
  }
}

function shouldRefresh(accessToken: string | undefined) {
  const expiresAt = getJwtExpiresAt(accessToken);

  if (!expiresAt) {
    return Boolean(accessToken);
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
  response: NextResponse,
  requestCookies: RequestCookieJar,
  scope: "admin" | "public",
  session: RefreshResult
) {
  const secure = process.env.NODE_ENV === "production";

  if (scope === "admin") {
    const options = {
      httpOnly: true,
      maxAge: adminSessionMaxAge,
      path: "/admin",
      sameSite: "lax" as const,
      secure
    };

    requestCookies.set(adminAccessTokenCookie, session.access_token);
    requestCookies.set(adminRefreshTokenCookie, session.refresh_token);
    response.cookies.set(adminAccessTokenCookie, session.access_token, options);
    response.cookies.set(adminRefreshTokenCookie, session.refresh_token, options);
    return;
  }

  const publicOptions = {
    httpOnly: true,
    maxAge: publicSessionMaxAge,
    path: "/",
    sameSite: "lax" as const,
    secure
  };

  requestCookies.set(publicAccessTokenCookie, session.access_token);
  requestCookies.set(publicRefreshTokenCookie, session.refresh_token);
  requestCookies.set(publicSignedInCookie, "1");
  response.cookies.set(publicAccessTokenCookie, session.access_token, publicOptions);
  response.cookies.set(publicRefreshTokenCookie, session.refresh_token, publicOptions);
  response.cookies.set(publicSignedInCookie, "1", {
    httpOnly: false,
    maxAge: publicSessionMaxAge,
    path: "/",
    sameSite: "lax",
    secure
  });
}

function clearSessionCookies(
  response: NextResponse,
  requestCookies: RequestCookieJar,
  scope: "admin" | "public"
) {
  const secure = process.env.NODE_ENV === "production";

  if (scope === "admin") {
    const options = {
      httpOnly: true,
      maxAge: 0,
      path: "/admin",
      sameSite: "lax" as const,
      secure
    };

    requestCookies.delete(adminAccessTokenCookie);
    requestCookies.delete(adminRefreshTokenCookie);
    response.cookies.set(adminAccessTokenCookie, "", options);
    response.cookies.set(adminRefreshTokenCookie, "", options);
    return;
  }

  const publicOptions = {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const,
    secure
  };

  requestCookies.delete(publicAccessTokenCookie);
  requestCookies.delete(publicRefreshTokenCookie);
  requestCookies.delete(publicSignedInCookie);
  response.cookies.set(publicAccessTokenCookie, "", publicOptions);
  response.cookies.set(publicRefreshTokenCookie, "", publicOptions);
  response.cookies.set(publicSignedInCookie, "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure
  });
}

async function refreshScopeIfNeeded(
  request: NextRequest,
  response: NextResponse,
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
    clearSessionCookies(response, requestCookies, scope);
    return;
  }

  setSessionCookies(response, requestCookies, scope, refreshedSession);
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestCookies = getRequestCookieJar(request);
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  await Promise.all([
    refreshScopeIfNeeded(request, response, requestCookies, "public"),
    refreshScopeIfNeeded(request, response, requestCookies, "admin")
  ]);

  requestHeaders.set("cookie", serializeCookieHeader(requestCookies));

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")) {
    return response;
  }

  if (!pathname.startsWith("/admin")) {
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
