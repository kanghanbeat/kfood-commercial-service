"use client";

import { useEffect } from "react";

const authHashTypes = new Set(["invite", "recovery", "signup"]);

function shouldRedirectAuthHash(hash: string) {
  if (!hash.startsWith("#")) {
    return false;
  }

  const params = new URLSearchParams(hash.slice(1));
  const type = params.get("type");

  return Boolean(params.get("access_token") && type && authHashTypes.has(type));
}

export function AuthHashRedirector() {
  useEffect(() => {
    if (!shouldRedirectAuthHash(window.location.hash)) {
      return;
    }

    const destination = new URL("/auth/update-password", window.location.origin);
    destination.hash = window.location.hash.slice(1);
    window.location.replace(destination.toString());
  }, []);

  return null;
}
