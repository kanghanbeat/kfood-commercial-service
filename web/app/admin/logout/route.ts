import { NextRequest, NextResponse } from "next/server";

import { clearAdminAuthCookiesOnResponse } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminAuthCookiesOnResponse(response);
  return response;
}
