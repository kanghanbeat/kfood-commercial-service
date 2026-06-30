import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminAccessTokenCookie)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseUserClient(accessToken);

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", user.id)
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
    email: user.email ?? null,
    role: profile.role,
    userId: user.id
  };
}

// 개발용 어드민 미리보기 세션. 프로덕션에선 절대 동작하지 않음(NODE_ENV 가드).
// .env.local 에 ADMIN_PREVIEW=true 가 있을 때만 활성. Supabase 없이 화면 확인용.
function adminPreviewSession(): AdminSession | null {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW === "true"
  ) {
    return {
      accessToken: "admin-preview",
      userId: "admin-preview",
      email: "preview@local",
      role: "admin"
    };
  }
  return null;
}

export async function requireAdminSession() {
  const preview = adminPreviewSession();
  if (preview) {
    return preview;
  }

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
