import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminProduction,
  getAdminFoods,
  getAdminProductions,
  getAdminRegions,
  getAdminRoutes,
  updateAdminProduction
} from "@kfood/data";
import type {
  AdminProduction,
  ProductionEntityType,
  ProductionTag,
  ProductionType,
  PublicationStatus
} from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const publicationStatuses: PublicationStatus[] = [
  "draft",
  "published",
  "hidden",
  "archived"
];

const productionTypes: ProductionType[] = [
  "video",
  "blog",
  "reels",
  "shorts",
  "photo"
];

type TagOption = { entityType: ProductionEntityType; id: string; label: string };

function redirectWith(query: string): never {
  redirect(`/admin/manage?tab=productions&${query}`);
}

function collectTags(formData: FormData): ProductionTag[] {
  const types: ProductionEntityType[] = ["region", "food", "place", "route"];
  const tags: ProductionTag[] = [];
  for (const entityType of types) {
    for (const value of formData.getAll(`tag_${entityType}`)) {
      tags.push({ entityType, entityId: String(value) });
    }
  }
  return tags;
}

function productionInputFromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    titleKo: String(formData.get("title_ko") ?? ""),
    type: String(formData.get("type") ?? "video") as ProductionType,
    channel: String(formData.get("channel") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    externalUrl: String(formData.get("external_url") ?? ""),
    editorialNote: String(formData.get("editorial_note") ?? ""),
    status: String(formData.get("status") ?? "draft") as PublicationStatus,
    tags: collectTags(formData)
  };
}

async function createProduction(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminProduction(session.accessToken, {
    actorId: session.userId,
    ...productionInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  redirectWith("created=1");
}

async function updateProduction(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminProduction(session.accessToken, {
    actorId: session.userId,
    productionId: String(formData.get("production_id") ?? ""),
    ...productionInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(`error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/manage");
  redirectWith("updated=1");
}

const statusBadge: Record<PublicationStatus, string> = {
  published: "success",
  draft: "warning",
  hidden: "brand",
  archived: "danger"
};

const typeLabels: Record<ProductionEntityType, string> = {
  region: "지역",
  food: "음식",
  place: "장소",
  route: "루트"
};

function TagPicker({
  options,
  selected
}: {
  options: TagOption[];
  selected?: Set<string>;
}) {
  const groups: ProductionEntityType[] = ["region", "food", "place", "route"];
  return (
    <div className="admin-tag-picker">
      <span className="admin-metric-label">연결할 콘텐츠 (태그)</span>
      {groups.map((group) => {
        const groupOptions = options.filter((o) => o.entityType === group);
        if (groupOptions.length === 0) return null;
        return (
          <div className="admin-tag-group" key={group}>
            <span className="admin-tag-group-label">{typeLabels[group]}</span>
            <div className="admin-tag-options">
              {groupOptions.map((option) => (
                <label className="admin-tag-option" key={`${group}:${option.id}`}>
                  <input
                    defaultChecked={selected?.has(`${group}:${option.id}`)}
                    name={`tag_${group}`}
                    type="checkbox"
                    value={option.id}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductionFields({
  options,
  production
}: {
  options: TagOption[];
  production?: AdminProduction;
}) {
  const selected = production
    ? new Set(production.tags.map((t) => `${t.entityType}:${t.entityId}`))
    : undefined;
  return (
    <>
      <label>
        Slug (URL용, 영문·하이픈)
        <input defaultValue={production?.slug} name="slug" placeholder="tteokbokki-myeongdong-shoot" required />
      </label>
      <label>
        제목
        <input defaultValue={production?.title} name="title" placeholder="떡볶이 명동 촬영 영상" required />
      </label>
      <label>
        한글 제목 (선택)
        <input defaultValue={production?.titleKo ?? ""} name="title_ko" />
      </label>
      <label>
        유형
        <select defaultValue={production?.type ?? "video"} name="type">
          {productionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        채널
        <input
          defaultValue={production?.channel ?? ""}
          name="channel"
          placeholder="YouTube, Instagram, Blog"
        />
      </label>
      <label>
        요약
        <textarea defaultValue={production?.summary ?? ""} maxLength={2000} name="summary" />
      </label>
      <label>
        링크 (URL)
        <input
          defaultValue={production?.externalUrl ?? ""}
          name="external_url"
          type="url"
          placeholder="https://youtube.com/..."
        />
      </label>
      <TagPicker options={options} selected={selected} />
      <label>
        에디토리얼 노트
        <textarea
          defaultValue={production?.editorialNote ?? ""}
          maxLength={2000}
          name="editorial_note"
        />
      </label>
      <label>
        발행 상태
        <select defaultValue={production?.status ?? "draft"} name="status">
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

export async function ProductionsPanel({
  accessToken,
  add,
  message
}: {
  accessToken: string;
  add?: boolean;
  message?: { error?: string; updated?: string; created?: string };
}) {
  const [productions, regions, foods, routes] = await Promise.all([
    getAdminProductions(accessToken),
    getAdminRegions(accessToken),
    getAdminFoods(accessToken),
    getAdminRoutes(accessToken)
  ]);

  const options: TagOption[] = [
    ...regions.map((r) => ({ entityType: "region" as const, id: r.id, label: r.nameEn })),
    ...foods.map((f) => ({ entityType: "food" as const, id: f.id, label: f.nameEn })),
    ...routes.map((r) => ({ entityType: "route" as const, id: r.id, label: r.title }))
  ];

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>촬영·제작 콘텐츠</h2>
        <p>우리가 직접 만든 영상·블로그·릴스. 지역·음식·장소·루트를 태그로 연결하면 공개 페이지에 함께 노출됩니다.</p>
      </div>
      {message?.created ? (
        <p className="status-message success">콘텐츠가 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">콘텐츠가 수정되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 촬영 콘텐츠 추가</summary>
        <form action={createProduction} className="admin-form-list" style={{ marginTop: 12 }}>
          <ProductionFields options={options} />
          <button className="admin-btn primary" type="submit">콘텐츠 생성</button>
        </form>
      </details>

      {productions.length === 0 ? (
        <div className="admin-empty">
          아직 촬영 콘텐츠가 없거나 Supabase 연결 전입니다. 위에서 새 콘텐츠를 추가하세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {productions.map((production) => (
          <form action={updateProduction} className="form-panel" key={production.id}>
            <input name="production_id" type="hidden" value={production.id} />
            <div className="admin-panel-head">
              <strong>{production.title}</strong>
              <p>
                <span className={`admin-badge ${statusBadge[production.status]}`}>
                  {production.status}
                </span>{" "}
                {production.type} · {production.channel ?? "—"} · 태그 {production.tags.length}
              </p>
            </div>
            <ProductionFields options={options} production={production} />
            <button className="admin-btn primary" type="submit">콘텐츠 저장</button>
          </form>
        ))}
      </div>
    </div>
  );
}
