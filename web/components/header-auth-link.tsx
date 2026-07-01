"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function isAdminPath() {
  return window.location.pathname.startsWith("/admin");
}

function hasSignedInHint() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("kfood_public_signed_in=1"));
}

export function HeaderAuthLink() {
  const onAdminPath = useSyncExternalStore(
    (callback) => {
      window.addEventListener("popstate", callback);
      return () => window.removeEventListener("popstate", callback);
    },
    () => (isAdminPath() ? "1" : "0"),
    () => "0"
  ) === "1";
  const signedIn =
    useSyncExternalStore(
      (callback) => {
        window.addEventListener("focus", callback);
        return () => window.removeEventListener("focus", callback);
      },
      () => (hasSignedInHint() ? "1" : "0"),
      () => "0"
    ) === "1";

  if (onAdminPath) {
    return (
      <Link className="auth-link" href="/admin">
        Admin
      </Link>
    );
  }

  return signedIn ? (
    <Link className="auth-link" href="/mypage">
      Mypage
    </Link>
  ) : (
    <Link className="auth-link" href="/auth/login">
      Log in
    </Link>
  );
}
