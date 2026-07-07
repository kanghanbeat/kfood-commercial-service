import Link from "next/link";

import { getPublicSession } from "@/lib/public-auth";

export async function HeaderAuthLink() {
  const session = await getPublicSession();

  return session ? (
    <Link className="auth-link" href="/mypage">
      Mypage
    </Link>
  ) : (
    <Link className="auth-link" href="/auth/login">
      Log in
    </Link>
  );
}
