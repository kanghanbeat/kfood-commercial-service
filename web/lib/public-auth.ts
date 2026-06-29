import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient, type User } from "@supabase/supabase-js";

const publicAccessTokenCookie = "kfood_public_access_token";
const publicRefreshTokenCookie = "kfood_public_refresh_token";
const publicSignedInCookie = "kfood_public_signed_in";
const publicSessionMaxAge = 60 * 60 * 24 * 7;
const oauthStorageMaxAge = 60 * 10;

export type PublicSession = {
  accessToken: string;
  email: string | null;
  name: string | null;
  provider: string | null;
  user: User;
  userId: string;
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

function oauthCookieName(key: string) {
  return `kfood_public_oauth_${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
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

export async function createPublicSupabaseAuthClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createClient(config.url, config.anonKey, {
    auth: {
      detectSessionInUrl: false,
      flowType: "pkce",
      persistSession: true,
      storage: {
        getItem(key: string) {
          return cookieStore.get(oauthCookieName(key))?.value ?? null;
        },
        removeItem(key: string) {
          cookieStore.set(oauthCookieName(key), "", {
            httpOnly: true,
            maxAge: 0,
            path: "/auth",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
          });
        },
        setItem(key: string, value: string) {
          cookieStore.set(oauthCookieName(key), value, {
            httpOnly: true,
            maxAge: oauthStorageMaxAge,
            path: "/auth",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
          });
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

export async function setPublicAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    maxAge: publicSessionMaxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  cookieStore.set(publicAccessTokenCookie, accessToken, cookieOptions);
  cookieStore.set(publicRefreshTokenCookie, refreshToken, cookieOptions);
  cookieStore.set(publicSignedInCookie, "1", {
    httpOnly: false,
    maxAge: publicSessionMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearPublicAuthCookies() {
  const cookieStore = await cookies();
  const expiredCookieOptions = {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  cookieStore.set(publicAccessTokenCookie, "", expiredCookieOptions);
  cookieStore.set(publicRefreshTokenCookie, "", expiredCookieOptions);
  cookieStore.set(publicSignedInCookie, "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function getPublicSession(): Promise<PublicSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(publicAccessTokenCookie)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createPublicSupabaseUserClient(accessToken);

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  return {
    accessToken,
    email: user.email ?? null,
    name:
      typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : null,
    provider:
      typeof user.app_metadata.provider === "string"
        ? user.app_metadata.provider
        : null,
    user,
    userId: user.id
  };
}

export async function requirePublicSession(nextPath = "/mypage") {
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

  await supabase.from("profiles").insert(row);
}
