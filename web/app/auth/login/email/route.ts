import { NextRequest, NextResponse } from "next/server";

import {
  clearLegacyPublicAuthCookiesOnResponse,
  createPublicSupabaseServerClient,
  ensurePublicProfile,
  getSafeNextPath
} from "@/lib/public-auth";
import { isTransientAuthError, signInWithPasswordResilient } from "@/lib/sign-in-retry";

function redirectWithError(request: NextRequest, message: string, nextPath: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", nextPath);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/mypage"));

  if (!email || !password) {
    return redirectWithError(request, "Enter your email and password.", nextPath);
  }

  const supabase = await createPublicSupabaseServerClient();

  if (!supabase) {
    return redirectWithError(request, "Supabase Auth is not configured.", nextPath);
  }

  const { data, error } = await signInWithPasswordResilient(supabase, email, password);

  if (error || !data.session || !data.user) {
    if (isTransientAuthError(error)) {
      return redirectWithError(
        request,
        "Sign-in service is temporarily unavailable. Please try again.",
        nextPath
      );
    }

    return redirectWithError(
      request,
      "Could not sign in. Check your email and password.",
      nextPath
    );
  }

  await ensurePublicProfile({
    accessToken: data.session.access_token,
    email: data.user.email ?? null,
    name:
      typeof data.user.user_metadata.display_name === "string"
        ? data.user.user_metadata.display_name
        : typeof data.user.user_metadata.name === "string"
          ? data.user.user_metadata.name
          : null,
    provider:
      typeof data.user.app_metadata.provider === "string"
        ? data.user.app_metadata.provider
        : "email",
    user: data.user,
    userId: data.user.id
  });

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  clearLegacyPublicAuthCookiesOnResponse(response);
  return response;
}
