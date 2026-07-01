import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const adminAccessTokenCookie = "kfood_admin_access_token";
const adminRefreshTokenCookie = "kfood_admin_refresh_token";
const adminSessionMaxAge = 60 * 60;

export type AdminSession = {
  accessToken: string;
  userId: string;
  email: string | null;
  role: "admin" | "editor";
};

type AdminProfileRow = {
  id: string;
  role: "user" | "editor" | "admin";
  is_active: boolean;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
}

export function createSupabaseAuthClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createSupabaseUserClient(accessToken: string) {
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

function createSupabaseRefreshClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false
    }
  });
}

export async function setAdminAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    maxAge: adminSessionMaxAge,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  cookieStore.set(adminAccessTokenCookie, accessToken, cookieOptions);
  cookieStore.set(adminRefreshTokenCookie, refreshToken, cookieOptions);
}

export function setAdminAuthCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const cookieOptions = {
    httpOnly: true,
    maxAge: adminSessionMaxAge,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  response.cookies.set(adminAccessTokenCookie, accessToken, cookieOptions);
  response.cookies.set(adminRefreshTokenCookie, refreshToken, cookieOptions);
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies();
  const expiredCookieOptions = {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  cookieStore.set(adminAccessTokenCookie, "", expiredCookieOptions);
  cookieStore.set(adminRefreshTokenCookie, "", expiredCookieOptions);
}

export function clearAdminAuthCookiesOnResponse(response: NextResponse) {
  const expiredCookieOptions = {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  response.cookies.set(adminAccessTokenCookie, "", expiredCookieOptions);
  response.cookies.set(adminRefreshTokenCookie, "", expiredCookieOptions);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(adminAccessTokenCookie)?.value;
  const refreshToken = cookieStore.get(adminRefreshTokenCookie)?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  let supabase = accessToken ? createSupabaseUserClient(accessToken) : null;

  let userResult = supabase && accessToken
    ? await supabase.auth.getUser(accessToken)
    : null;

  if ((!userResult || userResult.error || !userResult.data.user) && refreshToken) {
    const refreshClient = createSupabaseRefreshClient();

    if (!refreshClient) {
      return null;
    }

    const { data, error } = await refreshClient.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error || !data.session || !data.user) {
      await clearAdminAuthCookies();
      return null;
    }

    accessToken = data.session.access_token;
    supabase = createSupabaseUserClient(accessToken);

    try {
      await setAdminAuthCookies(
        data.session.access_token,
        data.session.refresh_token
      );
    } catch {
      // Server components cannot always mutate cookies, but the refreshed
      // access token can still be used for the current request.
    }

    userResult = {
      data: { user: data.user },
      error: null
    };
  }

  if (!supabase || !accessToken || !userResult || userResult.error || !userResult.data.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", userResult.data.user.id)
    .maybeSingle<AdminProfileRow>();

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    (profile.role !== "admin" && profile.role !== "editor")
  ) {
    return null;
  }

  return {
    accessToken,
    email: userResult.data.user.email ?? null,
    role: profile.role,
    userId: userResult.data.user.id
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
