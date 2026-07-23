import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminContentPlan,
  deleteAdminContentPlan,
  getAdminContentPlans,
  startProductionFromPlan,
  updateAdminContentPlan,
  type AdminContentPlan,
  type ContentPlanPriority,
  type ContentPlanStatus
} from "@kfood/data";

import {
  AdminItem,
  AdminListToolbar,
  AdminPager,
  applyListParams,
  returnQuery,
  withReturnQuery,
  type ListParams
} from "@/components/admin/list-controls";
import { formatPlanDate } from "@/lib/content-calendar";
import { requireAdminSession } from "@/lib/admin-auth";

// 콘텐츠 기획 패널. 인사이트에서 발견한 주제를 기획으로 적어두고,
// "제작 시작"을 누르면 촬영·제작 콘텐츠(productions)가 만들어져 연결된다.

const priorities: ContentPlanPriority[] = ["high", "medium", "low"];

export const priorityLabels: Record<ContentPlanPriority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음"
};

const priorityBadge: Record<ContentPlanPriority, string> = {
  high: "danger",
  medium: "warning",
  low: "brand"
};

const statuses: ContentPlanStatus[] = [
  "planned",
  "in_progress",
  "published",
  "dropped"
];

export const planStatusLabels: Record<ContentPlanStatus, string> = {
  planned: "대기",
  in_progress: "진행 중",
  published: "발행 완료",
  dropped: "보류"
};

const statusFilterOptions = statuses.map((status) => ({
  value: status,
  label: planStatusLabels[status]
}));

function redirectWith(formData: FormData, query: string): never {
  redirect(withReturnQuery("/admin/content?tab=plans", formData, query));
}

function planInputFromForm(formData: FormData) {
  return {
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? ""),
    insightNote: String(formData.get("insight_note") ?? ""),
    priority: String(formData.get("priority") ?? "medium") as ContentPlanPriority,
    status: String(formData.get("status") ?? "planned") as ContentPlanStatus,
    targetDate: String(formData.get("target_date") ?? ""),
    title: String(formData.get("title") ?? ""),
    titleEn: String(formData.get("title_en") ?? "")
  };
}

async function createPlan(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminContentPlan(session.accessToken, {
    actorId: session.userId,
    ...planInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "created=1");
}

async function updatePlan(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminContentPlan(session.accessToken, {
    actorId: session.userId,
    planId: String(formData.get("plan_id") ?? ""),
    ...planInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "updated=1");
}

async function deletePlan(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await deleteAdminContentPlan(session.accessToken, {
    actorId: session.userId,
    planId: String(formData.get("plan_id") ?? "")
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "deleted=1");
}

async function startProduction(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await startProductionFromPlan(session.accessToken, {
    actorId: session.userId,
    planId: String(formData.get("plan_id") ?? ""),
    slug: String(formData.get("production_slug") ?? "")
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  revalidatePath("/admin/manage");
  redirectWith(formData, "started=1");
}

function PlanFields({ plan }: { plan?: AdminContentPlan }) {
  return (
    <>
      <label>
        주제 (한글)
        <input
          defaultValue={plan?.title}
          name="title"
          placeholder="외국인이 떡볶이에 중독되는 이유"
          required
        />
      </label>
      <label>
        주제 (영문)
        <input
          defaultValue={plan?.titleEn ?? ""}
          name="title_en"
          placeholder="Why Foreigners Can't Stop Eating Tteokbokki"
        />
      </label>
      <label>
        카테고리
        <input
          defaultValue={plan?.category ?? ""}
          name="category"
          placeholder="음식 문화 / 음식 비교 / 계절 트렌드"
        />
      </label>
      <label>
        우선순위
        <select defaultValue={plan?.priority ?? "medium"} name="priority">
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </label>
      <label>
        근거 인사이트
        <input
          defaultValue={plan?.insightNote ?? ""}
          name="insight_note"
          placeholder="TikTok 1위 · 이번 주 조회수 12.4M"
        />
      </label>
      <label>
        일정 (이 날짜가 기획 캘린더에 표시됩니다)
        <input defaultValue={plan?.targetDate ?? ""} name="target_date" type="date" />
      </label>
      <label>
        기획 메모 (콘셉트·구성·촬영 준비물)
        <textarea defaultValue={plan?.body ?? ""} maxLength={4000} name="body" />
      </label>
      <label>
        진행 상태
        <select defaultValue={plan?.status ?? "planned"} name="status">
          {statuses.map((status) => (
            <option key={status} value={status}>
              {planStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export async function PlansPanel({
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
    deleted?: string;
    started?: string;
  };
  params?: ListParams;
}) {
  const plans = await getAdminContentPlans(accessToken);
  const list = applyListParams(plans, params, {
    search: (plan) =>
      `${plan.title} ${plan.titleEn ?? ""} ${plan.category ?? ""} ${plan.targetDate ?? ""}`,
    status: (plan) => plan.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>기획 목록</h2>
        <p>
          무엇을 만들지 적어두는 곳입니다. 기획을 펼치면 &ldquo;제작 시작&rdquo;이
          있고, 누르면 제목·메모가 그대로 옮겨진 제작 콘텐츠가 &ldquo;제작 목록&rdquo;
          탭에 만들어집니다.
        </p>
      </div>

      {message?.created ? (
        <p className="status-message success">기획이 추가되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">기획이 수정되었습니다.</p>
      ) : null}
      {message?.deleted ? (
        <p className="status-message success">기획을 삭제했습니다.</p>
      ) : null}
      {message?.started ? (
        <p className="status-message success">
          제작 콘텐츠를 만들었습니다. 위 &ldquo;제작 목록&rdquo; 탭에서 내용을 채우세요.
        </p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <details className="form-panel" open={add}>
        <summary style={{ fontWeight: 600, cursor: "pointer" }}>+ 새 기획 추가</summary>
        <form action={createPlan} className="admin-form-list" style={{ marginTop: 12 }}>
          <input name="return_query" type="hidden" value={ret} />
          <PlanFields />
          <button className="admin-btn primary" type="submit">
            기획 추가
          </button>
        </form>
      </details>

      {plans.length === 0 ? (
        <div className="admin-empty">
          아직 기획이 없습니다. 위 &ldquo;+ 새 기획 추가&rdquo;로 첫 기획을 적어보세요.
        </div>
      ) : (
        <AdminListToolbar
          basePath="/admin/content"
          matched={list.matched}
          params={params}
          searchHint="주제·카테고리·날짜 검색"
          statuses={statusFilterOptions}
          tab="plans"
          total={list.total}
        />
      )}

      {plans.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">
          조건에 맞는 기획이 없습니다. 검색어나 상태 필터를 바꿔보세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {list.rows.map((plan) => (
          <AdminItem
            key={plan.id}
            meta={
              <>
                <span className={`admin-badge ${priorityBadge[plan.priority]}`}>
                  {priorityLabels[plan.priority]}
                </span>{" "}
                <span className="admin-badge">{planStatusLabels[plan.status]}</span>{" "}
                {plan.category ?? "카테고리 없음"} ·{" "}
                {plan.targetDate ? formatPlanDate(plan.targetDate) : "일정 미정"}
                {plan.productionTitle ? ` · 제작: ${plan.productionTitle}` : ""}
              </>
            }
            title={plan.title}
          >
            <form action={updatePlan} className="form-panel">
              <input name="plan_id" type="hidden" value={plan.id} />
              <input name="return_query" type="hidden" value={ret} />
              <PlanFields plan={plan} />
              <button className="admin-btn primary" type="submit">
                기획 저장
              </button>
            </form>

            <div className="admin-entity-actions">
              {plan.productionId ? (
                <p className="admin-danger-text">
                  제작 콘텐츠 <strong>{plan.productionTitle}</strong>에 연결되어
                  있습니다. 내용은 &ldquo;제작 목록&rdquo; 탭에서 편집하세요.
                </p>
              ) : (
                <details className="admin-danger-zone">
                  <summary className="admin-danger-summary">제작 시작</summary>
                  <p className="admin-danger-text">
                    이 기획으로 제작 콘텐츠를 만들어 &ldquo;제작 목록&rdquo; 탭에
                    추가합니다. 주소에 쓸 Slug만 정하면 제목·메모가 그대로 옮겨지고,
                    기획 상태가 &ldquo;진행 중&rdquo;으로 바뀝니다. 다시 적을 필요가 없습니다.
                  </p>
                  <form action={startProduction}>
                    <input name="plan_id" type="hidden" value={plan.id} />
                    <input name="return_query" type="hidden" value={ret} />
                    <label>
                      제작 콘텐츠 Slug (영문·하이픈)
                      <input
                        name="production_slug"
                        placeholder="tteokbokki-addiction-video"
                        required
                      />
                    </label>
                    <button className="admin-btn primary" type="submit">
                      제작 콘텐츠 만들기
                    </button>
                  </form>
                </details>
              )}

              <details className="admin-danger-zone">
                <summary className="admin-danger-summary">기획 삭제</summary>
                <p className="admin-danger-text">
                  <strong>{plan.title}</strong> 기획을 지웁니다. 되돌릴 수 없습니다.
                  (연결된 제작 콘텐츠는 지워지지 않습니다)
                </p>
                <form action={deletePlan}>
                  <input name="plan_id" type="hidden" value={plan.id} />
                  <input name="return_query" type="hidden" value={ret} />
                  <button className="admin-btn admin-btn-danger" type="submit">
                    정말 삭제합니다
                  </button>
                </form>
              </details>
            </div>
          </AdminItem>
        ))}
      </div>

      <AdminPager
        basePath="/admin/content"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="plans"
      />
    </div>
  );
}
