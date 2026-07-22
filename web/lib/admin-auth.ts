import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const adminAccessTokenCookie = "kfood_admin_access_token";
const adminRefreshTokenCookie = "kfood_admin_refresh_token";
// proxy.ts의 adminSessionMaxAge와 같은 값이어야 한다. 토큰 갱신 때마다
// proxy.ts가 쿠키를 다시 발급하므로 실제로는 "마지막 활동 기준 1시간".
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
      // 자동 갱신 금지. 화면 렌더 중에 갱신되면 새 리프레시 토큰을 쿠키에
      // 저장할 수 없어 옛 토큰만 폐기되고, 다음 요청에서 세션이 통째로 끊긴다.
      // (work-history.md 세션9 근본 원인 — 갱신은 proxy.ts만 담당)
      autoRefreshToken: false,
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
      // 자동 갱신 금지 — createSupabaseAuthClient의 주석 참고.
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
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

// 읽기 전용. 여기서 토큰을 갱신하거나 쿠키를 지우면 안 된다.
// 화면 렌더 중에는 쿠키를 쓸 수 없어서, 갱신하면 Supabase가 새로 발급한
// 리프레시 토큰이 브라우저에 저장되지 못한 채 옛 토큰만 폐기된다
// (= 다음 페이지 이동에서 로그아웃). 갱신은 proxy.ts가 담당한다.
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminAccessTokenCookie)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseUserClient(accessToken);
  const userResult = supabase ? await supabase.auth.getUser(accessToken) : null;

  if (!supabase || !userResult || userResult.error || !userResult.data.user) {
    // [임시 진단] 로그인 풀림 추적용. 원인 확인 후 제거할 것.
    console.log(
      `[admin-diag] getUser 실패 → 로그인으로: ${userResult?.error?.message ?? "응답 없음"}`
    );
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
    // [임시 진단] 로그인 풀림 추적용. 원인 확인 후 제거할 것.
    console.log(
      `[admin-diag] profiles 조회 실패 → 로그인으로:` +
        ` error=${profileError?.message ?? "없음"}` +
        ` profile=${profile ? `role=${profile.role} active=${profile.is_active}` : "없음"}`
    );
    return null;
  }

  return {
    accessToken,
    email: userResult.data.user.email ?? null,
    role: profile.role,
    userId: userResult.data.user.id
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
