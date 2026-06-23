import { NextRequest, NextResponse } from "next/server";

import {
  createPublicSupabaseAuthClient,
  ensurePublicProfile,
  getSafeNextPath,
  setPublicAuthCookies
} from "@/lib/public-auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (error) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set("error", error);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set("error", "Missing authentication code.");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createPublicSupabaseAuthClient();

  if (!supabase) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set("error", "Supabase Auth is not configured.");
    return NextResponse.redirect(loginUrl);
  }

  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.session || !data.user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    loginUrl.searchParams.set(
      "error",
      "Could not complete sign-in. Check OAuth provider redirect settings."
    );
    return NextResponse.redirect(loginUrl);
  }

  await setPublicAuthCookies(
    data.session.access_token,
    data.session.refresh_token
  );

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name:
      typeof data.user.user_metadata.name === "string"
        ? data.user.user_metadata.name
        : null,
    provider:
      typeof data.user.app_metadata.provider === "string"
        ? data.user.app_metadata.provider
        : null,
    user: data.user,
    userId: data.user.id
  });

  return NextResponse.redirect(new URL(nextPath, request.url));
}
