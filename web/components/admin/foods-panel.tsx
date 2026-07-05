import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminFood, getAdminFoods, updateAdminFood } from "@kfood/data";
import type { PublicationStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const publicationStatuses: PublicationStatus[] = [
  "draft",
  "published",
  "hidden",
  "archived"
];

const spicyLevels = [0, 1, 2, 3, 4];

function redirectWith(query: string): never {
  redirect(`/admin/manage?tab=foods&${query}`);
}

function foodInputFromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("name_en") ?? ""),
    nameKo: String(formData.get("name_ko") ?? ""),
    romanizedName: String(formData.get("romanized_name") ?? ""),
    description: String(formData.get("description") ?? ""),
    tasteProfile: String(formData.get("taste_profile") ?? ""),
    spicyLevel: Number(formData.get("spicy_level") ?? 0),
    beginnerNote: String(formData.get("beginner_note") ?? ""),
    eatingGuide: String(formData.get("eating_guide") ?? ""),
    cautionNote: String(formData.get("caution_note") ?? ""),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    status: String(formData.get("status") ?? "draft") as PublicationStatus
  };
}

async function createFood(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminFood(session.accessToken, {
    actorId: session.userId,
    ...foodInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/foods");
  redirectWith("created=1");
}

async function updateFood(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminFood(session.accessToken, {
    actorId: session.userId,
    foodId: String(formData.get("food_id") ?? ""),
    ...foodInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  revalidatePath("/foods");
  redirectWith("updated=1");
}

const statusBadge: Record<PublicationStatus, string> = {
  published: "success",
  draft: "warning",
  hidden: "brand",
  archived: "danger"
};

function FoodFields({
  defaults
}: {
  defaults?: {
    slug: string;
    nameEn: string;
    nameKo: string;
    romanizedName: string | null;
    description: string;
    tasteProfile: string | null;
    spicyLevel: number;
    beginnerNote: string | null;
    eatingGuide: string | null;
    cautionNote: string | null;
    editorialNote: string | null;
    status: PublicationStatus;
  };
}) {
  return (
    <>
      <label>
        Slug (URL용, 영문·하이픈)
        <input defaultValue={defaults?.slug} name="slug" placeholder="tteokbokki" required />
      </label>
      <label>
        영문 이름
        <input defaultValue={defaults?.nameEn} name="name_en" placeholder="Tteokbokki" required />
      </label>
      <label>
        한글 이름
        <input defaultValue={defaults?.nameKo} name="name_ko" placeholder="떡볶이" required />
      </label>
      <label>
        발음 (로마자)
        <input
          defaultValue={defaults?.romanizedName ?? ""}
          name="romanized_name"
          placeholder="Tteok-bokki"
        />
      </label>
      <label>
        설명
        <textarea defaultValue={defaults?.description} maxLength={2000} name="description" required />
      </label>
      <label>
        맛 프로필 (쉼표 구분)
        <input
          defaultValue={defaults?.tasteProfile ?? ""}
          name="taste_profile"
          placeholder="sweet, spicy, chewy"
        />
      </label>
      <label>
        매운맛 (0~4)
        <select defaultValue={String(defaults?.spicyLevel ?? 0)} name="spicy_level">
          {spicyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label>
        초보자 노트
        <textarea
          defaultValue={defaults?.beginnerNote ?? ""}
          maxLength={1200}
          name="beginner_note"
        />
      </label>
      <label>
        먹는 방법
        <textarea
          defaultValue={defaults?.eatingGuide ?? ""}
          maxLength={1200}
          name="eating_guide"
        />
      </label>
      <label>
        주의 사항
        <textarea
          defaultValue={defaults?.cautionNote ?? ""}
          maxLength={1200}
          name="caution_note"
        />
      </label>
      <label>
        에디토리얼 노트
        <textarea
          defaultValue={defaults?.editorialNote ?? ""}
          maxLength={2000}
          name="editorial_note"
        />
      </label>
      <label>
        발행 상태
        <select defaultValue={defaults?.status ?? "draft"} name="status">
          {publicationStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export async function FoodsPanel({
  accessToken,
  message
}: {
  accessToken: string;
  message?: { error?: string; updated?: string; created?: string };
}) {
  const foods = await getAdminFoods(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>음식 콘텐츠</h2>
        <p>음식별 설명·매운맛·먹는 방법·발행 상태를 관리합니다. 저장 시 감사 로그가 기록됩니다.</p>
      </div>
      {message?.created ? (
        <p className="status-message success">음식이 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">음식이 수정되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel">
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 음식 추가</summary>
        <form action={createFood} className="admin-form-list" style={{ marginTop: 12 }}>
          <FoodFields />
          <button className="admin-btn primary" type="submit">음식 생성</button>
        </form>
      </details>

      {foods.length === 0 ? (
        <div className="admin-empty">
          아직 음식이 없거나 Supabase 연결 전입니다. 위에서 새 음식을 추가하세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {foods.map((food) => (
          <form action={updateFood} className="form-panel" key={food.id}>
            <input name="food_id" type="hidden" value={food.id} />
            <div className="admin-panel-head">
              <strong>{food.nameEn}</strong>
              <p>
                <span className={`admin-badge ${statusBadge[food.status]}`}>
                  {food.status}
                </span>{" "}
                매운맛 {food.spicyLevel}/4 · /{food.slug}
              </p>
            </div>
            <FoodFields defaults={food} />
            <button className="admin-btn primary" type="submit">음식 저장</button>
          </form>
        ))}
      </div>
    </div>
  );
}
