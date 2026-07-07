import type { SupabaseClient } from "@supabase/supabase-js";

type PasswordSignInResult = Awaited<
  ReturnType<SupabaseClient["auth"]["signInWithPassword"]>
>;

const MAX_TRANSIENT_RETRIES = 2;
const MAX_CREDENTIAL_RETRIES = 1;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 5xx / 네트워크 오류: 인증 서버가 잠깐 못 받는 상황. 무조건 재시도 대상.
export function isTransientAuthError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const name = (error as { name?: string }).name;
  const status = (error as { status?: number }).status;

  return name === "AuthRetryableFetchError" || (typeof status === "number" && status >= 500);
}

// Supabase(GoTrue)가 유휴 후 첫 인증 요청에서 종종 비밀번호가 맞아도
// invalid_credentials(400)를 반환한다(프로젝트 wake-up 중 DB 미준비 등).
// 같은 자격증명으로 즉시 재시도하면 성공하므로, 딱 한 번만 재시도한다.
// 재시도해도 또 invalid_credentials면 그때는 진짜 틀린 비밀번호로 본다.
function isSpuriousCredentialError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (error as { code?: string }).code === "invalid_credentials";
}

// 로그인 UX 상 "두 번 눌러야 열리는" 문제를 서버에서 흡수한다.
// 진짜 틀린 비밀번호는 (재시도 후에도 invalid_credentials가 유지되므로) 그대로 실패한다.
export async function signInWithPasswordResilient(
  client: SupabaseClient,
  email: string,
  password: string
): Promise<PasswordSignInResult> {
  let transientRetries = 0;
  let credentialRetries = 0;

  for (;;) {
    const result = await client.auth.signInWithPassword({ email, password });

    if (!result.error) {
      return result;
    }

    if (isTransientAuthError(result.error) && transientRetries < MAX_TRANSIENT_RETRIES) {
      transientRetries += 1;
      await delay(300 * transientRetries);
      continue;
    }

    if (isSpuriousCredentialError(result.error) && credentialRetries < MAX_CREDENTIAL_RETRIES) {
      credentialRetries += 1;
      await delay(400);
      continue;
    }

    return result;
  }
}
