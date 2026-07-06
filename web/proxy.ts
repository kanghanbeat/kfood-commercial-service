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
    clearSessionCookies(requestCookies);
    return;
  }

  setSessionCookies(requestCookies, refreshedSession);
}

function updateRequestCookieJar(
  requestCookies: RequestCookieJar,
  cookie: ResponseCookie
) {
  if (cookie.options.maxAge === 0 || cookie.value === "") {
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

function writeSupabaseResponseCookies(
  response: NextResponse,
  cookiesToSet: ResponseCookie[],
  headersToSet: Record<string, string>
) {
  cookiesToSet.forEach(({ name, options, value }) => {
    response.cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === "production"
    });
  });

  Object.entries(headersToSet).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestCookies = getRequestCookieJar(request);
  const requestHeaders = new Headers(request.headers);

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
