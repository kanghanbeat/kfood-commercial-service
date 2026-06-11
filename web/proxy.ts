import { NextRequest, NextResponse } from "next/server";

const adminSessionCookie = "kfood_admin_session";

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return hex(signature);
}

async function verifyAdminSession(token: string | undefined, secret: string) {
  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");
  const expiresAtNumber = Number(expiresAt);

  if (!expiresAt || !signature || Number.isNaN(expiresAtNumber)) {
    return false;
  }

  if (Date.now() > expiresAtNumber) {
    return false;
  }

  return signature === (await sign(expiresAt, secret));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")) {
    return NextResponse.next();
  }

  const passwordConfigured = Boolean(process.env.ADMIN_ACCESS_PASSWORD);
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!passwordConfigured || !sessionSecret) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "Admin access is not configured.");
    return NextResponse.redirect(loginUrl);
  }

  const isValidSession = await verifyAdminSession(
    request.cookies.get(adminSessionCookie)?.value,
    sessionSecret
  );

  if (isValidSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
