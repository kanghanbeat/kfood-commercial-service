import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminRegion,
  getAdminRegions,
  updateAdminRegion
} from "@kfood/data";
import type { PublicationStatus } from "@kfood/data";

import { publicationStatusLabels } from "@/components/admin-shell";
import { AdminEntityActions } from "@/components/admin/entity-actions";
import {
  AdminItem,
  AdminListToolbar,
  AdminPager,
  applyListParams,
  returnQuery,
  withReturnQuery,
  type ListParams
} from "@/components/admin/list-controls";
import { requireAdminSession } from "@/lib/admin-auth";

const publicationStatuses: PublicationStatus[] = [
  "draft",
  "published",
  "hidden",
  "archived"
];

const statusFilterOptions = publicationStatuses.map((status) => ({
  value: status,
  label: publicationStatusLabels[status]
}));

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function redirectWith(formData: FormData, query: string): never {
  redirect(withReturnQuery("/admin/manage?tab=regions", formData, query));
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
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/regions");
  redirectWith(formData, "created=1");
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
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/regions");
  redirectWith(formData, "updated=1");
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
  message,
  params
}: {
  accessToken: string;
  add?: boolean;
  message?: {
    error?: string;
    updated?: string;
    created?: string;
    archived?: string;
    deleted?: string;
  };
  params?: ListParams;
}) {
  const regions = await getAdminRegions(accessToken);
  const list = applyListParams(regions, params, {
    search: (region) => `${region.nameEn} ${region.nameKo} ${region.slug}`,
    status: (region) => region.status
  });
  const ret = returnQuery(params);

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
      {message?.archived ? (
        <p className="status-message success">지역을(를) 보관했습니다. 공개 사이트에서 빠집니다.</p>
      ) : null}
      {message?.deleted ? (
        <p className="status-message success">지역을(를) 완전히 삭제했습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 지역 추가</summary>
        <form action={createRegion} className="admin-form-list" style={{ marginTop: 12 }}>
          <input name="return_query" type="hidden" value={ret} />
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
                  {publicationStatusLabels[status]}
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
      ) : (
        <AdminListToolbar
          basePath="/admin/manage"
          matched={list.matched}
          params={params}
          searchHint="지역 이름·slug 검색"
          statuses={statusFilterOptions}
          tab="regions"
          total={list.total}
        />
      )}

      {regions.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 지역이 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}

      <div className="admin-form-list">
        {list.rows.map((region) => (
          <AdminItem
            key={region.id}
            meta={
              <>
                <span className={`admin-badge ${statusBadge[region.status]}`}>
                  {publicationStatusLabels[region.status]}
                </span>{" "}
                /{region.slug}
              </>
            }
            previewHref={`/regions/${region.slug}`}
            title={region.nameEn}
          >
          <form action={updateRegion} className="form-panel">
            <input name="region_id" type="hidden" value={region.id} />
            <input name="return_query" type="hidden" value={ret} />
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
                    {publicationStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            <button className="admin-btn primary" type="submit">지역 저장</button>
          </form>
          <AdminEntityActions
            entity="region"
            id={region.id}
            isArchived={region.status === "archived"}
            name={region.nameEn}
            returnQuery={ret}
          />
          </AdminItem>
        ))}
      </div>

      <AdminPager
        basePath="/admin/manage"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="regions"
      />
    </div>
  );
}
