import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  archiveAdminEntity,
  deleteAdminEntity,
  type AdminDeletableEntity
} from "@kfood/data";

import { withReturnQuery } from "@/components/admin/list-controls";
import { requireAdminSession } from "@/lib/admin-auth";

// 콘텐츠 관리 항목의 보관·삭제 버튼.
// 보관은 한 번에 되고, 삭제는 접힌 영역을 펼쳐야 버튼이 나오는 2단계다
// (실수로 누르는 것을 막기 위함 — 자바스크립트 없이 details로 처리).

// 삭제 후 공개 사이트에서도 사라져야 하므로 해당 목록 페이지를 다시 그리게 한다.
const publicPathByEntity: Record<AdminDeletableEntity, string | null> = {
  region: "/regions",
  food: "/foods",
  place: "/places",
  route: "/routes",
  production: null
};

const tabByEntity: Record<AdminDeletableEntity, string> = {
  region: "regions",
  food: "foods",
  place: "places",
  route: "routes",
  production: "productions"
};

// 제작 콘텐츠(productions)는 콘텐츠 제작 메뉴에, 나머지는 콘텐츠 관리 메뉴에 있다.
const adminPathByEntity: Record<AdminDeletableEntity, string> = {
  region: "/admin/manage",
  food: "/admin/manage",
  place: "/admin/manage",
  route: "/admin/manage",
  production: "/admin/content"
};

function entityFromForm(formData: FormData) {
  const entity = String(formData.get("entity") ?? "") as AdminDeletableEntity;
  const id = String(formData.get("entity_id") ?? "");
  const adminPath = adminPathByEntity[entity] ?? "/admin/manage";
  return { entity, id, tab: tabByEntity[entity] ?? "regions", adminPath };
}

async function archiveEntity(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const { entity, id, tab, adminPath } = entityFromForm(formData);

  const result = await archiveAdminEntity(session.accessToken, {
    actorId: session.userId,
    entity,
    id
  });

  const base = `${adminPath}?tab=${tab}`;

  if (!result.ok) {
    redirect(withReturnQuery(base, formData, `error=${encodeURIComponent(result.message)}`));
  }

  const publicPath = publicPathByEntity[entity];
  if (publicPath) revalidatePath(publicPath);
  revalidatePath(adminPath);
  redirect(withReturnQuery(base, formData, "archived=1"));
}

async function deleteEntity(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const { entity, id, tab, adminPath } = entityFromForm(formData);

  const result = await deleteAdminEntity(session.accessToken, {
    actorId: session.userId,
    entity,
    id
  });

  const base = `${adminPath}?tab=${tab}`;

  if (!result.ok) {
    redirect(withReturnQuery(base, formData, `error=${encodeURIComponent(result.message)}`));
  }

  const publicPath = publicPathByEntity[entity];
  if (publicPath) revalidatePath(publicPath);
  revalidatePath(adminPath);
  redirect(withReturnQuery(base, formData, "deleted=1"));
}

export function AdminEntityActions({
  entity,
  id,
  name,
  isArchived,
  returnQuery
}: {
  entity: AdminDeletableEntity;
  id: string;
  name: string;
  isArchived: boolean;
  returnQuery: string;
}) {
  return (
    <div className="admin-entity-actions">
      {isArchived ? null : (
        <form action={archiveEntity}>
          <input name="entity" type="hidden" value={entity} />
          <input name="entity_id" type="hidden" value={id} />
          <input name="return_query" type="hidden" value={returnQuery} />
          <button className="admin-btn" type="submit">
            보관
          </button>
        </form>
      )}

      <details className="admin-danger-zone">
        <summary className="admin-danger-summary">완전 삭제</summary>
        <p className="admin-danger-text">
          <strong>{name}</strong>을(를) 데이터베이스에서 지웁니다. 되돌릴 수 없습니다.
          공개 사이트에서만 감추려면 &ldquo;보관&rdquo;을 쓰세요. (삭제 직전 내용은 감사
          로그에 남습니다)
        </p>
        <form action={deleteEntity}>
          <input name="entity" type="hidden" value={entity} />
          <input name="entity_id" type="hidden" value={id} />
          <input name="return_query" type="hidden" value={returnQuery} />
          <button className="admin-btn admin-btn-danger" type="submit">
            정말 삭제합니다
          </button>
        </form>
      </details>
    </div>
  );
}
