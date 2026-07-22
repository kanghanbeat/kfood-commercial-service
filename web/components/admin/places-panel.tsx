import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminPlace,
  getAdminPlaces,
  getAdminRegions,
  updateAdminPlace
} from "@kfood/data";
import type { AdminRegion, PublicationStatus } from "@kfood/data";

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

function redirectWithError(formData: FormData, message: string): never {
  redirect(
    withReturnQuery("/admin/manage?tab=places", formData, `error=${encodeURIComponent(message)}`)
  );
}

async function createPlace(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as PublicationStatus;

  if (!publicationStatuses.includes(status)) {
    redirectWithError(formData, "Unsupported publication status.");
  }

  const result = await createAdminPlace(session.accessToken, {
    actorId: session.userId,
    addressEn: String(formData.get("address_en") ?? ""),
    addressKo: String(formData.get("address_ko") ?? ""),
    businessHoursNote: String(formData.get("business_hours_note") ?? ""),
    businessInfoNote: String(formData.get("business_info_note") ?? ""),
    cautionTags: parseTags(formData.get("caution_tags")),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    googleMapsUrl: String(formData.get("google_maps_url") ?? ""),
    nameEn: String(formData.get("name_en") ?? ""),
    nameKo: String(formData.get("name_ko") ?? ""),
    naverMapsUrl: String(formData.get("naver_maps_url") ?? ""),
    regionId: String(formData.get("region_id") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    status,
    trustTags: parseTags(formData.get("trust_tags"))
  });

  if (!result.ok) {
    redirectWithError(formData, result.message);
  }

  revalidatePath("/places");
  revalidatePath("/admin/manage");
  redirect(withReturnQuery("/admin/manage?tab=places", formData, "created=1"));
}

async function updatePlace(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as PublicationStatus;

  if (!publicationStatuses.includes(status)) {
    redirectWithError(formData, "Unsupported publication status.");
  }

  const result = await updateAdminPlace(session.accessToken, {
    actorId: session.userId,
    businessHoursNote: String(formData.get("business_hours_note") ?? ""),
    businessInfoNote: String(formData.get("business_info_note") ?? ""),
    cautionTags: parseTags(formData.get("caution_tags")),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    googleMapsUrl: String(formData.get("google_maps_url") ?? ""),
    markVerifiedToday: formData.get("mark_verified_today") === "on",
    naverMapsUrl: String(formData.get("naver_maps_url") ?? ""),
    placeId: String(formData.get("place_id") ?? ""),
    status,
    trustTags: parseTags(formData.get("trust_tags"))
  });

  if (!result.ok) {
    redirectWithError(formData, result.message);
  }

  revalidatePath("/places");
  revalidatePath("/admin/manage");
  redirect(withReturnQuery("/admin/manage?tab=places", formData, "updated=1"));
}

// 새 장소 추가 폼. 수정 폼과 달리 지역·slug·영문 이름이 필수다.
function NewPlaceFields({ regions }: { regions: AdminRegion[] }) {
  return (
    <>
      <label>
        Slug (URL용, 영문·하이픈)
        <input name="slug" placeholder="myeongdong-kalguksu" required />
      </label>
      <label>
        지역
        <select defaultValue="" name="region_id" required>
          <option disabled value="">
            지역 선택
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.nameEn} ({region.nameKo})
            </option>
          ))}
        </select>
      </label>
      <label>
        영문 이름
        <input name="name_en" placeholder="Myeongdong Kalguksu" required />
      </label>
      <label>
        한글 이름
        <input name="name_ko" placeholder="명동 칼국수" />
      </label>
      <label>
        에디토리얼 노트
        <textarea maxLength={2000} name="editorial_note" required />
      </label>
      <label>
        영문 주소
        <input name="address_en" placeholder="29 Myeongdong 10-gil, Jung-gu, Seoul" />
      </label>
      <label>
        한글 주소
        <input name="address_ko" placeholder="서울 중구 명동10길 29" />
      </label>
      <label>
        Google Maps URL
        <input name="google_maps_url" type="url" />
      </label>
      <label>
        Naver Map URL
        <input name="naver_maps_url" type="url" />
      </label>
      <label>
        영업시간 노트
        <textarea maxLength={1200} name="business_hours_note" />
      </label>
      <label>
        영업정보 노트
        <textarea maxLength={1200} name="business_info_note" />
      </label>
      <label>
        신뢰 태그 (쉼표 구분)
        <input name="trust_tags" placeholder="local favorite, cash only" />
      </label>
      <label>
        주의 태그 (쉼표 구분)
        <input name="caution_tags" placeholder="long queue, no english menu" />
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
    </>
  );
}

export async function PlacesPanel({
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
  const [places, regions] = await Promise.all([
    getAdminPlaces(accessToken),
    getAdminRegions(accessToken)
  ]);
  const list = applyListParams(places, params, {
    search: (place) =>
      `${place.nameEn} ${place.nameKo ?? ""} ${place.slug} ${place.regionSlug ?? ""}`,
    status: (place) => place.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>장소 콘텐츠</h2>
        <p>지도 링크·신뢰 라벨·발행 상태를 관리합니다. 저장 시 감사 로그가 기록됩니다.</p>
      </div>
      {message?.created ? (
        <p className="status-message success">장소가 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">장소가 수정되고 감사 로그가 기록되었습니다.</p>
      ) : null}
      {message?.archived ? (
        <p className="status-message success">장소을(를) 보관했습니다. 공개 사이트에서 빠집니다.</p>
      ) : null}
      {message?.deleted ? (
        <p className="status-message success">장소을(를) 완전히 삭제했습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 장소 추가</summary>
        {regions.length === 0 ? (
          <p className="admin-metric-sub" style={{ marginTop: 8 }}>
            장소는 지역에 연결됩니다. 먼저 지역을 추가하거나 Supabase 연결이 필요합니다.
          </p>
        ) : (
          <form action={createPlace} className="admin-form-list" style={{ marginTop: 12 }}>
            <input name="return_query" type="hidden" value={ret} />
            <NewPlaceFields regions={regions} />
            <button className="admin-btn primary" type="submit">
              장소 생성
            </button>
          </form>
        )}
      </details>

      {places.length === 0 ? (
        <div className="admin-empty">
          아직 장소가 없거나 Supabase 연결 전입니다. 위에서 새 장소를 추가하세요.
        </div>
      ) : (
        <AdminListToolbar
          basePath="/admin/manage"
          matched={list.matched}
          params={params}
          searchHint="장소 이름·slug·지역 검색"
          statuses={statusFilterOptions}
          tab="places"
          total={list.total}
        />
      )}

      {places.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 장소가 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}

      <div className="admin-form-list">
        {list.rows.map((place) => (
          <AdminItem
            key={place.id}
            meta={
              <>
                <span className="admin-badge brand">{publicationStatusLabels[place.status]}</span>{" "}
                {place.regionSlug} · verified {place.lastVerifiedAt ?? "pending"}
              </>
            }
            previewHref={`/places/${place.slug}`}
            title={place.nameEn}
          >
          <form action={updatePlace} className="form-panel">
            <input name="place_id" type="hidden" value={place.id} />
            <input name="return_query" type="hidden" value={ret} />
            <label>
              발행 상태
              <select defaultValue={place.status} name="status">
                {publicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {publicationStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              에디토리얼 노트
              <textarea
                defaultValue={place.editorialNote}
                maxLength={2000}
                name="editorial_note"
                required
              />
            </label>
            <label>
              Google Maps URL
              <input
                defaultValue={place.googleMapsUrl ?? ""}
                name="google_maps_url"
                type="url"
              />
            </label>
            <label>
              Naver Map URL
              <input
                defaultValue={place.naverMapsUrl ?? ""}
                name="naver_maps_url"
                type="url"
              />
            </label>
            <label>
              영업시간 노트
              <textarea
                defaultValue={place.businessHoursNote ?? ""}
                maxLength={1200}
                name="business_hours_note"
              />
            </label>
            <label>
              영업정보 노트
              <textarea
                defaultValue={place.businessInfoNote ?? ""}
                maxLength={1200}
                name="business_info_note"
              />
            </label>
            <label>
              신뢰 태그 (쉼표 구분)
              <input defaultValue={place.trustTags.join(", ")} name="trust_tags" />
            </label>
            <label>
              주의 태그 (쉼표 구분)
              <input
                defaultValue={place.cautionTags.join(", ")}
                name="caution_tags"
              />
            </label>
            <label className="checkbox-label">
              <input name="mark_verified_today" type="checkbox" />
              오늘 검증 완료로 표시
            </label>
            <button className="admin-btn primary" type="submit">
              장소 저장
            </button>
          </form>
          <AdminEntityActions
            entity="place"
            id={place.id}
            isArchived={place.status === "archived"}
            name={place.nameEn}
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
        tab="places"
      />
    </div>
  );
}
