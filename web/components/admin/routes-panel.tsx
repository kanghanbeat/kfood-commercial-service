import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminRoute,
  getAdminRegions,
  getAdminRoutes,
  updateAdminRoute
} from "@kfood/data";
import type { AdminRegion, AdminRoute, PublicationStatus } from "@kfood/data";

import { publicationStatusLabels } from "@/components/admin-shell";
import { BulkBar, BulkCheckbox, BulkProvider } from "@/components/admin/bulk";
import { AdminEntityActions } from "@/components/admin/entity-actions";
import { AdminImageField } from "@/components/admin/image-field";
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
  redirect(withReturnQuery("/admin/manage?tab=routes", formData, query));
}

function routeInputFromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    regionId: String(formData.get("region_id") ?? ""),
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    estimatedDuration: String(formData.get("estimated_duration") ?? ""),
    transportMode: String(formData.get("transport_mode") ?? ""),
    recommendedForTags: parseTags(formData.get("recommended_for_tags")),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    status: String(formData.get("status") ?? "draft") as PublicationStatus
  };
}

async function createRoute(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminRoute(session.accessToken, {
    actorId: session.userId,
    ...routeInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/routes");
  redirectWith(formData, "created=1");
}

async function updateRoute(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminRoute(session.accessToken, {
    actorId: session.userId,
    routeId: String(formData.get("route_id") ?? ""),
    ...routeInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/routes");
  redirectWith(formData, "updated=1");
}

const statusBadge: Record<PublicationStatus, string> = {
  published: "success",
  draft: "warning",
  hidden: "brand",
  archived: "danger"
};

function RouteFields({
  regions,
  route
}: {
  regions: AdminRegion[];
  route?: AdminRoute;
}) {
  return (
    <>
      <label>
        Slug (URL용, 영문·하이픈)
        <input defaultValue={route?.slug} name="slug" placeholder="myeongdong-first-night" required />
      </label>
      <label>
        지역
        <select defaultValue={route?.regionId ?? ""} name="region_id" required>
          <option value="" disabled>
            지역 선택
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.nameEn}
            </option>
          ))}
        </select>
      </label>
      <label>
        제목
        <input defaultValue={route?.title} name="title" placeholder="Myeongdong First Night" required />
      </label>
      <label>
        요약
        <textarea defaultValue={route?.summary} maxLength={2000} name="summary" required />
      </label>
      <label>
        소요 시간
        <input
          defaultValue={route?.estimatedDuration ?? ""}
          name="estimated_duration"
          placeholder="90 minutes"
        />
      </label>
      <label>
        이동 수단
        <input
          defaultValue={route?.transportMode ?? ""}
          name="transport_mode"
          placeholder="walk, subway"
        />
      </label>
      <label>
        추천 태그 (쉼표 구분)
        <input
          defaultValue={route?.recommendedForTags.join(", ") ?? ""}
          name="recommended_for_tags"
          placeholder="first visit, night"
        />
      </label>
      <label>
        에디토리얼 노트
        <textarea
          defaultValue={route?.editorialNote ?? ""}
          maxLength={2000}
          name="editorial_note"
        />
      </label>
      <label>
        발행 상태
        <select defaultValue={route?.status ?? "draft"} name="status">
          {publicationStatuses.map((status) => (
            <option key={status} value={status}>
              {publicationStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export async function RoutesPanel({
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
    imageSaved?: string;
    imageRemoved?: string;
  };
  params?: ListParams;
}) {
  const [routes, regions] = await Promise.all([
    getAdminRoutes(accessToken),
    getAdminRegions(accessToken)
  ]);
  const list = applyListParams(routes, params, {
    search: (route) => `${route.title} ${route.slug} ${route.summary ?? ""}`,
    status: (route) => route.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>루트 콘텐츠</h2>
        <p>루트 요약·지역·소요 시간·발행 상태를 관리합니다. 저장 시 감사 로그가 기록됩니다.</p>
      </div>
      {message?.created ? (
        <p className="status-message success">루트가 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">루트가 수정되었습니다.</p>
      ) : null}
      {message?.archived ? (
        <p className="status-message success">루트을(를) 보관했습니다. 공개 사이트에서 빠집니다.</p>
      ) : null}
      {message?.deleted ? (
        <p className="status-message success">루트을(를) 완전히 삭제했습니다.</p>
      ) : null}
      {message?.imageSaved ? (
        <p className="status-message success">사진을 저장했습니다. 공개 페이지에 반영됩니다.</p>
      ) : null}
      {message?.imageRemoved ? (
        <p className="status-message success">사진을 지웠습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 루트 추가</summary>
        {regions.length === 0 ? (
          <p className="admin-metric-sub" style={{ marginTop: 8 }}>
            루트는 지역에 연결됩니다. 먼저 지역을 추가하거나 Supabase 연결이 필요합니다.
          </p>
        ) : (
          <form action={createRoute} className="admin-form-list" style={{ marginTop: 12 }}>
            <input name="return_query" type="hidden" value={ret} />
            <RouteFields regions={regions} />
            <button className="admin-btn primary" type="submit">루트 생성</button>
          </form>
        )}
      </details>

      {routes.length === 0 ? (
        <div className="admin-empty">
          아직 루트가 없거나 Supabase 연결 전입니다. 위에서 새 루트를 추가하세요.
        </div>
      ) : (
        <AdminListToolbar
          basePath="/admin/manage"
          matched={list.matched}
          params={params}
          searchHint="루트 제목·slug 검색"
          statuses={statusFilterOptions}
          tab="routes"
          total={list.total}
        />
      )}

      {routes.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 루트가 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}

      <BulkProvider>
        {list.rows.length > 0 ? (
          <BulkBar
            entity="route"
            pageIds={list.rows.map((route) => route.id)}
            statuses={statusFilterOptions}
          />
        ) : null}
        <div className="admin-form-list">
        {list.rows.map((route) => (
          <AdminItem
            key={route.id}
            selectionSlot={<BulkCheckbox id={route.id} label={route.title} />}
            meta={
              <>
                <span className={`admin-badge ${statusBadge[route.status]}`}>
                  {publicationStatusLabels[route.status]}
                </span>{" "}
                {route.estimatedDuration ?? "—"} · /{route.slug}
              </>
            }
            previewHref={`/routes/${route.slug}`}
            title={route.title}
          >
            <form action={updateRoute} className="form-panel">
              <input name="route_id" type="hidden" value={route.id} />
              <input name="return_query" type="hidden" value={ret} />
              <RouteFields regions={regions} route={route} />
              <button className="admin-btn primary" type="submit">루트 저장</button>
            </form>
            <AdminImageField
              ownerId={route.id}
              ownerType="route"
              returnQuery={ret}
            />
            <AdminEntityActions
              entity="route"
              id={route.id}
              isArchived={route.status === "archived"}
              name={route.title}
              returnQuery={ret}
            />
          </AdminItem>
        ))}
        </div>
      </BulkProvider>

      <AdminPager
        basePath="/admin/manage"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="routes"
      />
    </div>
  );
}
