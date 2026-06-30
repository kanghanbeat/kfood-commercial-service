import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getMyProfile,
  updateMyProfile,
  type SupportedLanguage
} from "@kfood/data";

import { ensurePublicProfile, requirePublicSession } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Mypage"
};

const languageOptions: Array<{ label: string; value: SupportedLanguage }> = [
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
  { label: "日本語", value: "ja" },
  { label: "中文", value: "zh" }
];

const supportedLanguageValues = languageOptions.map((option) => option.value);

function redirectWithError(message: string): never {
  redirect(`/mypage?error=${encodeURIComponent(message)}`);
}

async function updateProfile(formData: FormData) {
  "use server";

  const session = await requirePublicSession();
  const preferredLanguage = String(
    formData.get("preferred_language") ?? "en"
  ) as SupportedLanguage;

  if (!supportedLanguageValues.includes(preferredLanguage)) {
    redirectWithError("Choose a supported language.");
  }

  const result = await updateMyProfile(session.accessToken, {
    bio: String(formData.get("bio") ?? ""),
    displayName: String(formData.get("display_name") ?? ""),
    preferredLanguage
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/mypage");
  redirect("/mypage?updated=1");
}

export default async function MypagePage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requirePublicSession(),
    searchParams
  ]);

  await ensurePublicProfile(session);
  const profile = await getMyProfile(session.accessToken, session.userId);
  const displayName = profile?.displayName ?? session.name ?? "";
  const bio = profile?.bio ?? "";
  const preferredLanguage = profile?.preferredLanguage ?? "en";

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Mypage</p>
        <h1>Your K-food activity hub.</h1>
        <p className="detail-intro">
          Mypage will manage your profile, records, likes, follows, and language
          settings. The first version keeps account identity visible while the
          community data model is prepared.
        </p>
      </header>
      {params?.updated ? (
        <p className="status-message success">Profile updated.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <section className="form-panel">
        <h2>Account details</h2>
        <dl className="definition-list">
          <div>
            <dt>Email</dt>
            <dd>{session.email ?? "No public email from provider"}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{session.provider ?? "OAuth"}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{session.userId}</dd>
          </div>
        </dl>
        <div className="action-row">
          <Link className="button secondary" href="/feed">
            Open feed
          </Link>
          <Link className="button secondary" href="/auth/logout">
            Sign out
          </Link>
        </div>
      </section>
      <section className="form-panel">
        <h2>Public profile basics</h2>
        <form action={updateProfile} className="profile-form">
          <label>
            Display name
            <input
              defaultValue={displayName}
              maxLength={80}
              name="display_name"
              placeholder="K-food member"
            />
          </label>
          <label>
            Bio
            <textarea
              defaultValue={bio}
              maxLength={240}
              name="bio"
              placeholder="Short note for future records and comments."
            />
          </label>
          <label>
            Preferred language
            <select defaultValue={preferredLanguage} name="preferred_language">
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button primary" type="submit">
            Save profile
          </button>
        </form>
      </section>
      <section className="section-block" aria-labelledby="mypage-next">
        <div className="section-heading">
          <p className="eyebrow">UGC foundation</p>
          <h2 id="mypage-next">Records and comments are being prepared</h2>
          <p>
            Profile fields now support future records and comments. The next
            implementation slice will connect Feed to published user posts, then
            add post detail and comment forms.
          </p>
        </div>
      </section>
    </main>
  );
}
