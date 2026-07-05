import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminRegion,
  getAdminRegions,
  updateAdminRegion
} from "@kfood/data";
import type { PublicationStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const publicationStatuses: PublicationStatus[] = [
  "draft",
  "published",
  "hidden",
  "archived"
];

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function redirectWith(query: string): never {
  redirect(`/admin/manage?tab=regions&${query}`);
}

async function createRegion(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminRegion(session.accessToken, {
    actorId: session.userId,
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("name_en") ?? ""),
    nameKo: String(formData.get("name_ko") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    bestForTags: parseTags(formData.get("best_for_tags")),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    status: String(formData.get("status") ?? "draft") as PublicationStatus
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/regions");
  redirectWith("created=1");
}

async function updateRegion(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminRegion(session.accessToken, {
    actorId: session.userId,
    regionId: String(formData.get("region_id") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("name_en") ?? ""),
    nameKo: String(formData.get("name_ko") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    bestForTags: parseTags(formData.get("best_for_tags")),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    status: String(formData.get("status") ?? "draft") as PublicationStatus
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/regions");
  redirectWith("updated=1");
}

const statusBadge: Record<PublicationStatus, string> = {
  published: "success",
  draft: "warning",
  hidden: "brand",
  archived: "danger"
};

export async function RegionsPanel({
  accessToken,
  add,
  message
}: {
  accessToken: string;
  add?: boolean;
  message?: { error?: string; updated?: string; created?: string };
}) {
  const regions = await getAdminRegions(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>지역 콘텐츠</h2>
        <p>공개 웹에 노출되는 지역 단위 콘텐츠의 발행 상태와 소개를 관리합니다. 저장 시 감사 로그가 기록됩니다.</p>
      </div>
      {message?.created ? (
        <p className="status-message success">지역이 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">지역이 수정되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 지역 추가</summary>
        <form action={createRegion} className="admin-form-list" style={{ marginTop: 12 }}>
          <label>
            Slug (URL용, 영문·하이픈)
            <input name="slug" placeholder="myeongdong" required />
          </label>
          <label>
            영문 이름
            <input name="name_en" placeholder="Myeongdong" required />
          </label>
          <label>
            한글 이름
            <input name="name_ko" placeholder="명동" required />
          </label>
          <label>
            소개
            <textarea name="intro" maxLength={2000} required />
          </label>
          <label>
            태그 (쉼표 구분)
            <input name="best_for_tags" placeholder="first visit, street snacks" />
          </label>
          <label>
            에디토리얼 노트
            <textarea name="editorial_note" maxLength={2000} />
          </label>
          <label>
            발행 상태
            <select defaultValue="draft" name="status">
              {publicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <button className="admin-btn primary" type="submit">지역 생성</button>
        </form>
      </details>

      {regions.length === 0 ? (
        <div className="admin-empty">
          아직 지역이 없거나 Supabase 연결 전입니다. 위에서 새 지역을 추가하세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {regions.map((region) => (
          <form action={updateRegion} className="form-panel" key={region.id}>
            <input name="region_id" type="hidden" value={region.id} />
            <div className="admin-panel-head">
              <strong>{region.nameEn}</strong>
              <p>
                <span className={`admin-badge ${statusBadge[region.status]}`}>
                  {region.status}
                </span>{" "}
                /{region.slug}
              </p>
            </div>
            <label>
              Slug
              <input defaultValue={region.slug} name="slug" required />
            </label>
            <label>
              영문 이름
              <input defaultValue={region.nameEn} name="name_en" required />
            </label>
            <label>
              한글 이름
              <input defaultValue={region.nameKo} name="name_ko" required />
            </label>
            <label>
              소개
              <textarea defaultValue={region.intro} maxLength={2000} name="intro" required />
            </label>
            <label>
              태그 (쉼표 구분)
              <input defaultValue={region.bestForTags.join(", ")} name="best_for_tags" />
            </label>
            <label>
              에디토리얼 노트
              <textarea
                defaultValue={region.editorialNote ?? ""}
                maxLength={2000}
                name="editorial_note"
              />
            </label>
            <label>
              발행 상태
              <select defaultValue={region.status} name="status">
                {publicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <button className="admin-btn primary" type="submit">지역 저장</button>
          </form>
        ))}
      </div>
    </div>
  );
}
