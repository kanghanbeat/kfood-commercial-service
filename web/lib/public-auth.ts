import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type User } from "@supabase/supabase-js";

const legacyPublicAccessTokenCookie = "kfood_public_access_token";
const legacyPublicRefreshTokenCookie = "kfood_public_refresh_token";
const legacyPublicSignedInCookie = "kfood_public_signed_in";

export type PublicSession = {
  accessToken: string;
  email: string | null;
  name: string | null;
  provider: string | null;
  user: User;
  userId: string;
};

export type PublicSessionDiagnostic = {
  configurationPresent: boolean;
  host: string | null;
  legacyAccessTokenCookiePresent: boolean;
  legacyRefreshTokenCookiePresent: boolean;
  legacySignedInHintCookiePresent: boolean;
  maskedEmail: string | null;
  provider: string | null;
  serverSessionValid: boolean;
  supabaseAuthCookieCount: number;
  supabaseAuthCookiePresent: boolean;
  userIdSuffix: string | null;
};

type PublicProfileInsert = {
  id: string;
  display_name: string | null;
  role: "user";
  is_active: true;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
}

function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("auth-token");
}

function maskEmail(email: string | null | undefined) {
  if (!email || !email.includes("@")) {
    return null;
  }

  const [name, domain] = email.split("@");
  const visibleName = name.slice(0, 2);
  const domainParts = domain.split(".");
  const visibleDomain = domainParts[0]?.slice(0, 2) ?? "";
  const suffix = domainParts.slice(1).join(".");

  return `${visibleName}${"*".repeat(Math.max(name.length - 2, 2))}@${visibleDomain}***${suffix ? `.${suffix}` : ""}`;
}

function getPublicName(user: User) {
  if (typeof user.user_metadata.display_name === "string") {
    return user.user_metadata.display_name;
  }

  if (typeof user.user_metadata.name === "string") {
    return user.user_metadata.name;
  }

  return null;
}

function getPublicProvider(user: User) {
  return typeof user.app_metadata.provider === "string"
    ? user.app_metadata.provider
    : null;
}

function toNextCookieOptions(options: CookieOptions) {
  return {
    ...options,
    secure: process.env.NODE_ENV === "production"
  };
}

export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  if (value.startsWith("/admin")) {
    return "/";
  }

  return value;
}

export async function getRequestOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  return `${proto}://${host}`;
}

export async function createPublicSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    auth: {
      // 서버 컴포넌트에서는 토큰을 자동 갱신하지 않는다.
      // RSC는 쿠키를 쓸 수 없어(setAll이 조용히 무시됨), 여기서 refresh가
      // 일어나면 서버 쪽 refresh token만 회전(rotation)되고 브라우저 쿠키에는
      // 반영되지 않는다. 그러면 다음 요청이 이미 소비된 토큰을 보내
      // 재사용 감지에 걸려 세션이 통째로 폐기된다(로그인 직후 mypage처럼
      // 세션을 여러 번 읽는 페이지에서 로그아웃되는 원인).
      // 실제 refresh는 쿠키를 쓸 수 있는 미들웨어(proxy.ts)만 담당한다.
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "pkce",
      persistSession: true
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, toNextCookieOptions(options));
          });
        } catch {
          // Server components cannot always mutate cookies. The proxy handles
          // refresh persistence for navigations where mutation is unavailable.
        }
      }
    }
  });
}

export function createPublicSupabaseUserClient(accessToken: string) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

export function clearLegacyPublicAuthCookiesOnResponse(response: NextResponse) {
  const expiredCookieOptions = {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  response.cookies.set(legacyPublicAccessTokenCookie, "", expiredCookieOptions);
  response.cookies.set(legacyPublicRefreshTokenCookie, "", expiredCookieOptions);
  response.cookies.set(legacyPublicSignedInCookie, "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function getPublicSession(): Promise<PublicSession | null> {
  const supabase = await createPublicSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    accessToken: session.access_token,
    email: user.email ?? null,
    name: getPublicName(user),
    provider: getPublicProvider(user),
    user,
    userId: user.id
  };
}

export async function getPublicSessionDiagnostic(): Promise<PublicSessionDiagnostic> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const allCookies = cookieStore.getAll();
  const config = getSupabaseConfig();
  const supabaseAuthCookieCount = allCookies.filter((cookie) =>
    isSupabaseAuthCookie(cookie.name)
  ).length;
  const baseDiagnostic = {
    configurationPresent: Boolean(config),
    host: headerStore.get("host"),
    legacyAccessTokenCookiePresent: Boolean(
      cookieStore.get(legacyPublicAccessTokenCookie)?.value
    ),
    legacyRefreshTokenCookiePresent: Boolean(
      cookieStore.get(legacyPublicRefreshTokenCookie)?.value
    ),
    legacySignedInHintCookiePresent:
      cookieStore.get(legacyPublicSignedInCookie)?.value === "1",
    maskedEmail: null,
    provider: null,
    serverSessionValid: false,
    supabaseAuthCookieCount,
    supabaseAuthCookiePresent: supabaseAuthCookieCount > 0,
    userIdSuffix: null
  } satisfies PublicSessionDiagnostic;

  const session = await getPublicSession();

  if (!session) {
    return baseDiagnostic;
  }

  return {
    ...baseDiagnostic,
    maskedEmail: maskEmail(session.email),
    provider: session.provider,
    serverSessionValid: true,
    userIdSuffix: session.userId.slice(-8)
  };
}

// 개발용 미리보기 세션. 프로덕션에선 절대 동작하지 않음(NODE_ENV 가드).
// .env.local 에 ADMIN_PREVIEW=true 일 때만 로컬에서 로그인 없이 /mypage·/profile 열람.
function publicPreviewSession(): PublicSession | null {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW === "true"
  ) {
    return {
      accessToken: "public-preview",
      email: "preview@local",
      name: "Preview User",
      provider: "preview",
      user: { id: "public-preview" } as unknown as User,
      userId: "public-preview"
    };
  }
  return null;
}

export async function requirePublicSession(nextPath = "/mypage") {
  const preview = publicPreviewSession();
  if (preview) {
    return preview;
  }

  const session = await getPublicSession();

  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export async function ensurePublicProfile(session: PublicSession) {
  const supabase = createPublicSupabaseUserClient(session.accessToken);

  if (!supabase) {
    return;
  }

  const displayName = session.name ?? session.email ?? "K-food member";
  const row: PublicProfileInsert = {
    display_name: displayName,
    id: session.userId,
    is_active: true,
    role: "user"
  };

  await supabase.from("profiles").upsert(row, {
    ignoreDuplicates: true,
    onConflict: "id"
  });
}
