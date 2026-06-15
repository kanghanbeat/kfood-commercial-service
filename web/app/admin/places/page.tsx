import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getAdminPlaces,
  updateAdminPlace
} from "@kfood/data";
import type { PublicationStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Places"
};

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
  redirect(`/admin/places?error=${encodeURIComponent(message)}`);
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
  revalidatePath("/admin/places");
  redirect("/admin/places?updated=1");
}

export default async function AdminPlacesPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const places = await getAdminPlaces(session.accessToken);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Places</h1>
        <p className="detail-intro">
          Correct map links, business notes, trust labels, and publication
          status. Every successful save writes an audit log.
        </p>
      </header>
      {params?.updated ? (
        <p className="status-message success">Place updated and audit logged.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <ul className="content-list">
        {places.map((place) => (
          <li key={place.id}>
            <div className="list-item-body">
              <span className="meta-label">
                {place.status} · {place.regionSlug} · verified{" "}
                {place.lastVerifiedAt ?? "pending"}
              </span>
              <strong>{place.nameEn}</strong>
              <p>{place.nameKo ?? place.slug}</p>
              <form action={updatePlace} className="form-panel">
                <input name="place_id" type="hidden" value={place.id} />
                <label>
                  Publication status
                  <select defaultValue={place.status} name="status">
                    {publicationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Editorial note
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
                  Business hours note
                  <textarea
                    defaultValue={place.businessHoursNote ?? ""}
                    maxLength={1200}
                    name="business_hours_note"
                  />
                </label>
                <label>
                  Business info note
                  <textarea
                    defaultValue={place.businessInfoNote ?? ""}
                    maxLength={1200}
                    name="business_info_note"
                  />
                </label>
                <label>
                  Trust tags, comma separated
                  <input
                    defaultValue={place.trustTags.join(", ")}
                    name="trust_tags"
                  />
                </label>
                <label>
                  Caution tags, comma separated
                  <input
                    defaultValue={place.cautionTags.join(", ")}
                    name="caution_tags"
                  />
                </label>
                <label className="checkbox-label">
                  <input name="mark_verified_today" type="checkbox" />
                  Mark verified today
                </label>
                <button className="button primary" type="submit">
                  Save place
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
