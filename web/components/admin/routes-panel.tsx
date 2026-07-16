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
  redirect(`/admin/manage?tab=routes&${query}`);
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
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/routes");
  redirectWith("created=1");
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
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/routes");
  redirectWith("updated=1");
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
  message
}: {
  accessToken: string;
  add?: boolean;
  message?: { error?: string; updated?: string; created?: string };
}) {
  const [routes, regions] = await Promise.all([
    getAdminRoutes(accessToken),
    getAdminRegions(accessToken)
  ]);

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
            <RouteFields regions={regions} />
            <button className="admin-btn primary" type="submit">루트 생성</button>
          </form>
        )}
      </details>

      {routes.length === 0 ? (
        <div className="admin-empty">
          아직 루트가 없거나 Supabase 연결 전입니다. 위에서 새 루트를 추가하세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {routes.map((route) => (
          <form action={updateRoute} className="form-panel" key={route.id}>
            <input name="route_id" type="hidden" value={route.id} />
            <div className="admin-panel-head">
              <strong>{route.title}</strong>
              <p>
                <span className={`admin-badge ${statusBadge[route.status]}`}>
                  {publicationStatusLabels[route.status]}
                </span>{" "}
                {route.estimatedDuration ?? "—"} · /{route.slug}
              </p>
            </div>
            <RouteFields regions={regions} route={route} />
            <button className="admin-btn primary" type="submit">루트 저장</button>
          </form>
        ))}
      </div>
    </div>
  );
}
