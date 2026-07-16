import { NextRequest, NextResponse } from "next/server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

type PendingCookie = {
  name: string;
  options: CookieOptions;
  value: string;
};

// 인증 라우트(로그인·가입·OAuth·로그아웃) 전용 Supabase 클라이언트.
// Supabase가 발급/삭제하는 쿠키를 즉시 어딘가에 쓰지 않고 pending에 모아뒀다가,
// applyCookies(response)로 "실제 반환할 리다이렉트 응답"에 직접 싣는다.
// (이전 구조의 버그 원인: 쿠키는 요청 저장소에 쓰고 응답은 따로 새로 만들어
// 반환해서, 발급된 세션 쿠키가 브라우저까지 전달된다는 보장이 없었다.)
export function createSupabaseRouteClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const pending: PendingCookie[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => pending.push(cookie));
      }
    }
  });

  const applyCookies = <T extends NextResponse>(response: T): T => {
    pending.forEach(({ name, options, value }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  };

  return { applyCookies, supabase };
}
