"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function hasSignedInHint() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("kfood_public_signed_in=1"));
}

export function HeaderAuthLink() {
  const signedIn =
    useSyncExternalStore(
      (callback) => {
        window.addEventListener("focus", callback);
        return () => window.removeEventListener("focus", callback);
      },
      () => (hasSignedInHint() ? "1" : "0"),
      () => "0"
    ) === "1";

  return signedIn ? (
    <Link className="auth-link" href="/profile">
      Profile
    </Link>
  ) : (
    <Link className="auth-link" href="/auth/login">
      Sign in
    </Link>
  );
}
