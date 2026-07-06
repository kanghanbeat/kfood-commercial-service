import { NextRequest, NextResponse } from "next/server";

import {
  clearLegacyPublicAuthCookiesOnResponse,
  createPublicSupabaseServerClient
} from "@/lib/public-auth";

export async function GET(request: NextRequest) {
  const supabase = await createPublicSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  clearLegacyPublicAuthCookiesOnResponse(response);
  return response;
}
