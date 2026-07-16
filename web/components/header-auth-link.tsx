import Link from "next/link";

import { getPublicSession } from "@/lib/public-auth";
import { getDict } from "@/lib/i18n";

export async function HeaderAuthLink() {
  const [session, dict] = await Promise.all([getPublicSession(), getDict()]);

  return session ? (
    <Link className="auth-link" href="/mypage">
      {dict.nav.mypage}
    </Link>
  ) : (
    <Link className="auth-link" href="/auth/login">
      {dict.nav.login}
    </Link>
  );
}
