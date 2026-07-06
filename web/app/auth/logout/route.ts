import { NextRequest, NextResponse } from "next/server";

import { clearPublicAuthCookiesOnResponse } from "@/lib/public-auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearPublicAuthCookiesOnResponse(response);
  return response;
}
