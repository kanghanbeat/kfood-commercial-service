import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getPlatformSettings,
  updatePlatformSetting,
  type PlatformSettingKey
} from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const settingItems: Array<{ key: PlatformSettingKey; label: string; description: string }> = [
  {
    key: "community",
    label: "커뮤니티 (피드·게시물·댓글)",
    description:
      "끄면 공개 사이트에서 Feed 메뉴와 /feed 관련 페이지가 모두 숨겨집니다. 어드민의 게시물·댓글 관리는 계속 사용할 수 있습니다."
  }
];

function redirectWithError(message: string): never {
  redirect(`/admin/operations?tab=settings&error=${encodeURIComponent(message)}`);
}

async function toggleSetting(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const key = String(formData.get("key") ?? "") as PlatformSettingKey;
  const enabled = String(formData.get("enabled") ?? "") === "1";

  const result = await updatePlatformSetting(session.accessToken, key, enabled, session.userId);

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/operations");
  redirect("/admin/operations?tab=settings&updated=1");
}

export async function SettingsPanel({
  message
}: {
  message?: { error?: string; updated?: string };
}) {
  const settings = await getPlatformSettings();

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>사이트 설정</h2>
        <p>공개 사이트에 노출할 카테고리를 켜고 끕니다.</p>
      </div>
      {message?.updated ? (
        <p className="status-message success">설정이 업데이트되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      <div className="admin-form-list">
        {settingItems.map((item) => {
          const enabled = settings[item.key] ?? true;
          return (
            <form action={toggleSetting} className="form-panel" key={item.key}>
              <input name="key" type="hidden" value={item.key} />
              <input name="enabled" type="hidden" value={enabled ? "0" : "1"} />
              <div className="admin-panel-head">
                <strong>{item.label}</strong>
                <span className={enabled ? "admin-badge success" : "admin-badge"}>
                  {enabled ? "공개 중" : "비공개"}
                </span>
              </div>
              <p>{item.description}</p>
              <button className="admin-btn primary" type="submit">
                {enabled ? "비공개로 전환" : "공개로 전환"}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
