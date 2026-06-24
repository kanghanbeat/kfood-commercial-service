"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";

type Status = {
  kind: "error" | "info" | "success";
  message: string;
};

function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      detectSessionInUrl: true,
      persistSession: false
    }
  });
}

function getHashSession(): Pick<Session, "access_token" | "refresh_token"> | null {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  };
}

export function UpdatePasswordForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<Status>({
    kind: "info",
    message: "Checking the secure invitation link."
  });

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      if (!supabase) {
        setStatus({
          kind: "error",
          message: "Supabase Auth is not configured for this deployment."
        });
        return;
      }

      const hashSession = getHashSession();

      if (!hashSession) {
        setStatus({
          kind: "error",
          message:
            "This password setup link is missing its secure token. Ask for a new invitation or password recovery email."
        });
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: hashSession.access_token,
        refresh_token: hashSession.refresh_token
      });

      if (!isMounted) {
        return;
      }

      if (error) {
        setStatus({
          kind: "error",
          message:
            "This password setup link is expired or already used. Ask for a new invitation or password recovery email."
        });
        return;
      }

      setIsReady(true);
      setStatus({
        kind: "info",
        message: "Set a password for this K-food Service account."
      });
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isReady || isSaving) {
      return;
    }

    if (password.length < 10) {
      setStatus({
        kind: "error",
        message: "Use at least 10 characters for the password."
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        kind: "error",
        message: "The two password fields do not match."
      });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSaving(false);

    if (error) {
      setStatus({
        kind: "error",
        message: error.message
      });
      return;
    }

    setStatus({
      kind: "success",
      message: "Password updated. Redirecting to admin login."
    });

    window.location.replace(
      "/admin/login?notice=Password%20updated.%20Sign%20in%20with%20the%20new%20password."
    );
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <p className={`status-message ${status.kind}`}>{status.message}</p>
      <label>
        New password
        <input
          autoComplete="new-password"
          disabled={!isReady || isSaving}
          minLength={10}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 10 characters"
          required
          type="password"
          value={password}
        />
      </label>
      <label>
        Confirm password
        <input
          autoComplete="new-password"
          disabled={!isReady || isSaving}
          minLength={10}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat the new password"
          required
          type="password"
          value={confirmPassword}
        />
      </label>
      <button className="button primary" disabled={!isReady || isSaving} type="submit">
        {isSaving ? "Saving..." : "Set password"}
      </button>
    </form>
  );
}
