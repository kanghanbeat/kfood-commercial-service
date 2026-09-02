import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminShootLog,
  createAdminShootLogStop,
  createAdminShootLogStops,
  deleteAdminShootLog,
  deleteAdminShootLogStop,
  getAdminProductions,
  getAdminShootLogs,
  updateAdminShootLog,
  updateAdminShootLogStop,
  type AdminProduction,
  type AdminShootLog,
  type AdminShootLogStop,
  type ShootLogStatus,
  type ShootStopCategory
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
import { parseShootMemo } from "@/lib/shoot-log-parse";
import { requireAdminSession } from "@/lib/admin-auth";

// 촬영 일지 패널. 촬영을 다녀온 회차 하나에 그날 들른 곳을 붙여 기록한다.
// 기획(무엇을 만들까) → 촬영 일지(어디에 다녀와 무엇을 찍었나) → 제작(무엇을 올렸나).

const statuses: ShootLogStatus[] = ["planned", "in_progress", "done"];

export const shootLogStatusLabels: Record<ShootLogStatus, string> = {
  planned: "예정",
  in_progress: "촬영 중",
  done: "다녀옴"
};

const statusBadge: Record<ShootLogStatus, string> = {
  planned: "warning",
  in_progress: "brand",
  done: "success"
};

const categories: ShootStopCategory[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "meal",
  "cafe",
  "takeout",
  "stay",
  "sight",
  "event",
  "etc"
];

export const stopCategoryLabels: Record<ShootStopCategory, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식·야식",
  meal: "식사 (시간 미정)",
  cafe: "카페·디저트",
  takeout: "포장",
  stay: "숙소",
  sight: "관광·명소",
  event: "축제·행사",
  etc: "기타"
};

const statusFilterOptions = statuses.map((status) => ({
  value: status,
  label: shootLogStatusLabels[status]
}));

function redirectWith(formData: FormData, query: string): never {
  redirect(withReturnQuery("/admin/content?tab=shoot", formData, query));
}

/** 시작일이 있으면 "N일차"의 실제 날짜를 계산해 보여준다. */
function dayLabel(startDate: string | null, dayNumber: number) {
  if (!startDate) {
    return `${dayNumber}일차`;
  }

  const date = new Date(`${startDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return `${dayNumber}일차`;
  }

  date.setDate(date.getDate() + dayNumber - 1);

  // toISOString()은 UTC로 바꿔서 한국 시간 기준 하루 전으로 밀린다. 직접 조립한다.
  const iso = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

  return `${dayNumber}일차 · ${formatPlanDate(iso)}`;
}

function shootLogInputFromForm(formData: FormData) {
  return {
    endDate: String(formData.get("end_date") ?? ""),
    lesson: String(formData.get("lesson") ?? ""),
    productionId: String(formData.get("production_id") ?? ""),
    regionName: String(formData.get("region_name") ?? ""),
    roundNo: String(formData.get("round_no") ?? ""),
    startDate: String(formData.get("start_date") ?? ""),
    status: String(formData.get("status") ?? "done") as ShootLogStatus,
    summary: String(formData.get("summary") ?? ""),
    title: String(formData.get("title") ?? "")
  };
}

function stopInputFromForm(formData: FormData) {
  return {
    category: String(formData.get("category") ?? "meal") as ShootStopCategory,
    dayNumber: String(formData.get("day_number") ?? "1"),
    googleUrl: String(formData.get("google_url") ?? ""),
    menu: String(formData.get("menu") ?? ""),
    name: String(formData.get("name") ?? ""),
    naverUrl: String(formData.get("naver_url") ?? ""),
    note: String(formData.get("note") ?? ""),
    rating: String(formData.get("rating") ?? ""),
    shot: formData.get("shot") === "on",
    sortOrder: String(formData.get("sort_order") ?? "")
  };
}

async function createShootLog(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminShootLog(session.accessToken, {
    actorId: session.userId,
    ...shootLogInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "created=1");
}

async function updateShootLog(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminShootLog(session.accessToken, {
    actorId: session.userId,
    shootLogId: String(formData.get("shoot_log_id") ?? ""),
    ...shootLogInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "updated=1");
}

async function deleteShootLog(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await deleteAdminShootLog(session.accessToken, {
    actorId: session.userId,
    shootLogId: String(formData.get("shoot_log_id") ?? "")
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "deleted=1");
}

async function addStop(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await createAdminShootLogStop(session.accessToken, {
    actorId: session.userId,
    shootLogId: String(formData.get("shoot_log_id") ?? ""),
    ...stopInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "stopAdded=1");
}

async function updateStop(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await updateAdminShootLogStop(session.accessToken, {
    actorId: session.userId,
    stopId: String(formData.get("stop_id") ?? ""),
    ...stopInputFromForm(formData)
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "stopUpdated=1");
}

async function deleteStop(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const result = await deleteAdminShootLogStop(session.accessToken, {
    actorId: session.userId,
    stopId: String(formData.get("stop_id") ?? "")
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, "stopDeleted=1");
}

/** 촬영 중에 적어둔 메모를 붙여넣어 다녀온 곳을 한 번에 등록한다. */
async function importMemo(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const stops = parseShootMemo(String(formData.get("memo") ?? ""));

  if (stops.length === 0) {
    redirectWith(
      formData,
      `error=${encodeURIComponent("메모에서 장소를 찾지 못했습니다. 한 줄에 한 곳씩 적어주세요.")}`
    );
  }

  const result = await createAdminShootLogStops(session.accessToken, {
    actorId: session.userId,
    shootLogId: String(formData.get("shoot_log_id") ?? ""),
    stops
  });

  if (!result.ok) {
    redirectWith(formData, `error=${encodeURIComponent(result.message)}`);
  }

  revalidatePath("/admin/content");
  redirectWith(formData, `imported=${stops.length}`);
}

function ShootLogFields({
  log,
  productions
}: {
  log?: AdminShootLog;
  productions: AdminProduction[];
}) {
  return (
    <>
      <label>
        회차 (1차·2차 … 숫자만)
        <input
          defaultValue={log?.roundNo ?? ""}
          inputMode="numeric"
          name="round_no"
          placeholder="2"
        />
      </label>
      <label>
        촬영 제목
        <input
          defaultValue={log?.title}
          name="title"
          placeholder="여수 2차 촬영"
          required
        />
      </label>
      <label>
        지역
        <input
          defaultValue={log?.regionName ?? ""}
          name="region_name"
          placeholder="여수 (오는 길에 군산)"
        />
      </label>
      <label>
        시작일 (1일차 날짜)
        <input defaultValue={log?.startDate ?? ""} name="start_date" type="date" />
      </label>
      <label>
        종료일
        <input defaultValue={log?.endDate ?? ""} name="end_date" type="date" />
      </label>
      <label>
        상태
        <select defaultValue={log?.status ?? "done"} name="status">
          {statuses.map((status) => (
            <option key={status} value={status}>
              {shootLogStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
      <label>
        촬영 메모 (이번 촬영에서 건진 것)
        <textarea
          defaultValue={log?.summary ?? ""}
          maxLength={2000}
          name="summary"
          placeholder="게장·장어 위주. 밤바다 야경 컷 확보"
        />
      </label>
      <label>
        다음 촬영에 참고 (동선·시간대·웨이팅·조명)
        <textarea
          defaultValue={log?.lesson ?? ""}
          maxLength={2000}
          name="lesson"
          placeholder="점심 웨이팅 길어서 11시 전 도착 필요. 실내 어두워 조명 필수"
        />
      </label>
      <label>
        연결할 제작 콘텐츠 (선택)
        <select defaultValue={log?.productionId ?? ""} name="production_id">
          <option value="">연결 안 함</option>
          {productions.map((production) => (
            <option key={production.id} value={production.id}>
              {production.title}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

function StopFields({ stop }: { stop?: AdminShootLogStop }) {
  return (
    <>
      <label>
        며칠차
        <input
          defaultValue={stop?.dayNumber ?? 1}
          inputMode="numeric"
          name="day_number"
          placeholder="1"
        />
      </label>
      <label>
        상호명
        <input
          defaultValue={stop?.name}
          name="name"
          placeholder="꽃돌게장 1번가"
          required
        />
      </label>
      <label>
        구분
        <select defaultValue={stop?.category ?? "meal"} name="category">
          {categories.map((category) => (
            <option key={category} value={category}>
              {stopCategoryLabels[category]}
            </option>
          ))}
        </select>
      </label>
      <label>
        메뉴·찍은 것
        <input defaultValue={stop?.menu ?? ""} name="menu" placeholder="게장, 장어구이" />
      </label>
      <label>
        네이버 지도 링크
        <input
          defaultValue={stop?.naverUrl ?? ""}
          name="naver_url"
          placeholder="https://naver.me/..."
          type="url"
        />
      </label>
      <label>
        구글 지도 링크
        <input
          defaultValue={stop?.googleUrl ?? ""}
          name="google_url"
          placeholder="https://maps.app.goo.gl/..."
          type="url"
        />
      </label>
      <label>
        평가 (1~5, 콘텐츠로 쓸 만한지)
        <input
          defaultValue={stop?.rating ?? ""}
          inputMode="numeric"
          max={5}
          min={1}
          name="rating"
          type="number"
        />
      </label>
      <label>
        메모 (맛·분위기·촬영 조건)
        <textarea
          defaultValue={stop?.note ?? ""}
          maxLength={2000}
          name="note"
          placeholder="웨이팅 30분. 내부 어두워 조명 필요"
        />
      </label>
      <label className="admin-tag-option">
        <input defaultChecked={stop?.shot ?? false} name="shot" type="checkbox" />
        여기서 촬영함 (들르기만 한 곳은 체크 안 함)
      </label>
      <input name="sort_order" type="hidden" value={stop?.sortOrder ?? ""} />
    </>
  );
}

/** 한 회차의 다녀온 곳을 며칠차별로 묶어 보여준다. */
function StopList({ log, ret }: { log: AdminShootLog; ret: string }) {
  const days = [...new Set(log.stops.map((stop) => stop.dayNumber))].sort(
    (a, b) => a - b
  );

  if (days.length === 0) {
    return (
      <div className="admin-empty">
        아직 다녀온 곳이 없습니다. 아래에서 한 곳씩 추가하거나, 촬영 중에 적어둔
        메모를 붙여넣어 한 번에 등록하세요.
      </div>
    );
  }

  return (
    <>
      {days.map((day) => (
        <div key={day} style={{ marginTop: 12 }}>
          <span className="admin-metric-label">{dayLabel(log.startDate, day)}</span>
          <div className="admin-form-list">
            {log.stops
              .filter((stop) => stop.dayNumber === day)
              .map((stop) => (
                <AdminItem
                  key={stop.id}
                  meta={
                    <>
                      <span className="admin-badge">
                        {stopCategoryLabels[stop.category]}
                      </span>{" "}
                      {stop.shot ? "촬영함" : "방문만"}
                      {stop.menu ? ` · ${stop.menu}` : ""}
                      {stop.rating ? ` · ${stop.rating}점` : ""}
                    </>
                  }
                  previewHref={stop.naverUrl ?? stop.googleUrl ?? undefined}
                  title={stop.name}
                >
                  <form action={updateStop} className="form-panel">
                    <input name="stop_id" type="hidden" value={stop.id} />
                    <input name="return_query" type="hidden" value={ret} />
                    <StopFields stop={stop} />
                    <button className="admin-btn primary" type="submit">
                      저장
                    </button>
                  </form>

                  {stop.googleUrl && stop.naverUrl ? (
                    <p className="admin-metric-sub">
                      <a href={stop.googleUrl} rel="noreferrer" target="_blank">
                        구글 지도 열기 ↗
                      </a>
                    </p>
                  ) : null}

                  <details className="admin-danger-zone">
                    <summary className="admin-danger-summary">이 장소 삭제</summary>
                    <p className="admin-danger-text">
                      <strong>{stop.name}</strong>을(를) 이 촬영 일지에서 지웁니다.
                    </p>
                    <form action={deleteStop}>
                      <input name="stop_id" type="hidden" value={stop.id} />
                      <input name="return_query" type="hidden" value={ret} />
                      <button className="admin-btn admin-btn-danger" type="submit">
                        정말 삭제합니다
                      </button>
                    </form>
                  </details>
                </AdminItem>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export async function ShootLogsPanel({
  accessToken,
  message,
  params
}: {
  accessToken: string;
  message?: {
    created?: string;
    deleted?: string;
    error?: string;
    imported?: string;
    stopAdded?: string;
    stopDeleted?: string;
    stopUpdated?: string;
    updated?: string;
  };
  params?: ListParams;
}) {
  const [logs, productions] = await Promise.all([
    getAdminShootLogs(accessToken),
    getAdminProductions(accessToken)
  ]);

  const list = applyListParams(logs, params, {
    search: (log) =>
      `${log.title} ${log.regionName ?? ""} ${log.startDate ?? ""} ${log.stops
        .map((stop) => `${stop.name} ${stop.menu ?? ""}`)
        .join(" ")}`,
    status: (log) => log.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>촬영 일지</h2>
        <p>
          촬영 다녀온 기록입니다. 회차 하나(예: &ldquo;여수 2차 촬영&rdquo;)를 만들고
          그 안에 며칠차에 어디를 들렀는지 붙입니다. 네이버·구글 지도 링크를 같이
          남겨두면 나중에 장소 콘텐츠로 옮길 때 그대로 씁니다.
        </p>
      </div>

      {message?.created ? (
        <p className="status-message success">촬영 일지를 만들었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">촬영 일지를 수정했습니다.</p>
      ) : null}
      {message?.deleted ? (
        <p className="status-message success">촬영 일지를 삭제했습니다.</p>
      ) : null}
      {message?.stopAdded ? (
        <p className="status-message success">다녀온 곳을 추가했습니다.</p>
      ) : null}
      {message?.stopUpdated ? (
        <p className="status-message success">다녀온 곳을 수정했습니다.</p>
      ) : null}
      {message?.stopDeleted ? (
        <p className="status-message success">다녀온 곳을 삭제했습니다.</p>
      ) : null}
      {message?.imported ? (
        <p className="status-message success">
          메모에서 {message.imported}곳을 등록했습니다. 잘못 나뉜 곳은 열어서 고치세요.
        </p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}

      <div className="form-panel">
        <h3 style={{ margin: 0 }}>새 촬영 일지</h3>
        <form action={createShootLog} className="admin-form-list" style={{ marginTop: 12 }}>
          <input name="return_query" type="hidden" value={ret} />
          <ShootLogFields productions={productions} />
          <button className="admin-btn primary" type="submit">
            촬영 일지 만들기
          </button>
        </form>
      </div>

      <div className="admin-panel-head" style={{ marginTop: 24 }}>
        <h3>촬영 일지 목록</h3>
        <p>회차를 펼치면 그 안에 다녀온 곳을 추가하고, 지도 링크·메모를 남깁니다.</p>
      </div>

      {logs.length === 0 ? (
        <div className="admin-empty">
          아직 촬영 일지가 없습니다. 위 &ldquo;새 촬영 일지&rdquo;에서 첫 회차를
          만들어보세요.
        </div>
      ) : (
        <AdminListToolbar
          basePath="/admin/content"
          matched={list.matched}
          params={params}
          searchHint="제목·지역·상호 검색"
          statuses={statusFilterOptions}
          tab="shoot"
          total={list.total}
        />
      )}

      {logs.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">
          조건에 맞는 촬영 일지가 없습니다. 검색어나 상태 필터를 바꿔보세요.
        </div>
      ) : null}

      <div className="admin-form-list">
        {list.rows.map((log) => {
          const shotCount = log.stops.filter((stop) => stop.shot).length;

          return (
            <AdminItem
              key={log.id}
              meta={
                <>
                  <span className={`admin-badge ${statusBadge[log.status]}`}>
                    {shootLogStatusLabels[log.status]}
                  </span>{" "}
                  {log.roundNo ? `${log.roundNo}차 · ` : ""}
                  {log.regionName ?? "지역 미정"} ·{" "}
                  {log.startDate ? formatPlanDate(log.startDate) : "날짜 미정"} · 장소{" "}
                  {log.stops.length}곳 (촬영 {shotCount}곳)
                  {log.productionTitle ? ` · 제작: ${log.productionTitle}` : ""}
                </>
              }
              title={log.title}
            >
              <form action={updateShootLog} className="form-panel">
                <input name="shoot_log_id" type="hidden" value={log.id} />
                <input name="return_query" type="hidden" value={ret} />
                <ShootLogFields log={log} productions={productions} />
                <button className="admin-btn primary" type="submit">
                  촬영 정보 저장
                </button>
              </form>

              <div className="admin-panel-head" style={{ marginTop: 16 }}>
                <h3>다녀온 곳</h3>
              </div>

              <StopList log={log} ret={ret} />

              <details className="form-panel" style={{ marginTop: 12 }}>
                <summary style={{ fontWeight: 600, cursor: "pointer" }}>
                  + 다녀온 곳 하나 추가
                </summary>
                <form action={addStop} className="admin-form-list" style={{ marginTop: 12 }}>
                  <input name="shoot_log_id" type="hidden" value={log.id} />
                  <input name="return_query" type="hidden" value={ret} />
                  <StopFields />
                  <button className="admin-btn primary" type="submit">
                    장소 추가
                  </button>
                </form>
              </details>

              <details className="form-panel" style={{ marginTop: 12 }}>
                <summary style={{ fontWeight: 600, cursor: "pointer" }}>
                  메모 붙여넣기로 한 번에 등록
                </summary>
                <form action={importMemo} className="admin-form-list" style={{ marginTop: 12 }}>
                  <input name="shoot_log_id" type="hidden" value={log.id} />
                  <input name="return_query" type="hidden" value={ret} />
                  <label>
                    촬영 메모
                    <textarea
                      name="memo"
                      placeholder={`1일차\n* 꽃돌게장 1번가 - 게장\nhttps://naver.me/5eUcAaf8\n* 숙소 - 디아크리조트\n\n2일차\n* 카페 여수에서\nhttps://naver.me/G8s9ENYL`}
                      rows={10}
                    />
                  </label>
                  <p className="admin-metric-sub">
                    &ldquo;1일차&rdquo;로 날짜가 나뉘고, &ldquo;상호 - 메뉴&rdquo;와
                    &ldquo;저녁 : 상호&rdquo; 둘 다 알아듣습니다. 링크만 있는 줄은 바로 위
                    장소에 붙습니다. 잘못 나뉜 건 등록 후 고치면 됩니다.
                  </p>
                  <button className="admin-btn primary" type="submit">
                    메모에서 장소 등록
                  </button>
                </form>
              </details>

              <details className="admin-danger-zone" style={{ marginTop: 12 }}>
                <summary className="admin-danger-summary">촬영 일지 삭제</summary>
                <p className="admin-danger-text">
                  <strong>{log.title}</strong>과(와) 여기에 적은 장소 {log.stops.length}곳을
                  모두 지웁니다. 되돌릴 수 없습니다.
                </p>
                <form action={deleteShootLog}>
                  <input name="shoot_log_id" type="hidden" value={log.id} />
                  <input name="return_query" type="hidden" value={ret} />
                  <button className="admin-btn admin-btn-danger" type="submit">
                    정말 삭제합니다
                  </button>
                </form>
              </details>
            </AdminItem>
          );
        })}
      </div>

      <AdminPager
        basePath="/admin/content"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="shoot"
      />
    </div>
  );
}
