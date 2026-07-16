import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminPlaces, updateAdminPlace } from "@kfood/data";
import type { PublicationStatus } from "@kfood/data";

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

function redirectWithError(message: string): never {
  redirect(`/admin/manage?tab=places&error=${encodeURIComponent(message)}`);
}

async function updatePlace(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as PublicationStatus;

  if (!publicationStatuses.includes(status)) {
    redirectWithError("Unsupported publication status.");
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
    redirectWithError(result.message);
  }

  revalidatePath("/places");
  revalidatePath("/admin/manage");
  redirect("/admin/manage?tab=places&updated=1");
}

export async function PlacesPanel({
  accessToken,
  message
}: {
  accessToken: string;
  message?: { error?: string; updated?: string };
}) {
  const places = await getAdminPlaces(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>장소 콘텐츠</h2>
        <p>지도 링크·신뢰 라벨·발행 상태를 수정합니다. 저장 시 감사 로그가 기록됩니다.</p>
      </div>
      {message?.updated ? (
        <p className="status-message success">장소가 수정되고 감사 로그가 기록되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      <div className="admin-form-list">
        {places.map((place) => (
          <form action={updatePlace} className="form-panel" key={place.id}>
            <input name="place_id" type="hidden" value={place.id} />
            <div className="admin-panel-head">
              <strong>{place.nameEn}</strong>
              <p>
                <span className="admin-badge brand">{publicationStatusLabels[place.status]}</span>{" "}
                {place.regionSlug} · verified {place.lastVerifiedAt ?? "pending"}
              </p>
            </div>
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
        ))}
      </div>
    </div>
  );
}
