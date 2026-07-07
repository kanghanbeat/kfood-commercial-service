import { NextRequest, NextResponse } from "next/server";

import {
  createSupabaseAuthClient,
  createSupabaseUserClient,
  setAdminAuthCookiesOnResponse
} from "@/lib/admin-auth";
import { isTransientAuthError, signInWithPasswordResilient } from "@/lib/sign-in-retry";

function redirectWithError(request: NextRequest, message: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rawNextPath = String(formData.get("next") ?? "/admin");
  const nextPath = rawNextPath.startsWith("/admin") ? rawNextPath : "/admin";
  const supabase = createSupabaseAuthClient();

  if (!supabase) {
    return redirectWithError(request, "Supabase Auth is not configured.");
  }

  const { data, error } = await signInWithPasswordResilient(supabase, email, password);

  if (error || !data.session || !data.user) {
    if (isTransientAuthError(error)) {
      return redirectWithError(
        request,
        "Sign-in service is temporarily unavailable. Please try again."
      );
    }

    return redirectWithError(
      request,
      "Invalid admin credentials. Newly invited accounts must set a password first."
    );
  }

  const userClient = createSupabaseUserClient(data.session.access_token);

  if (!userClient) {
    return redirectWithError(request, "Supabase Auth is not configured.");
  }

  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle<{ role: "user" | "editor" | "admin"; is_active: boolean }>();

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !["admin", "editor"].includes(profile.role)
  ) {
    return redirectWithError(request, "This account is not allowed to access admin.");
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  setAdminAuthCookiesOnResponse(
    response,
    data.session.access_token,
    data.session.refresh_token
  );
  return response;
}
