import Link from "next/link";
import type { ReactNode } from "react";

// 어드민 목록 공통 도구: 검색 · 상태 필터 · 페이지 나누기.
// 목록이 길어지면 편집 폼이 전부 펼쳐진 채 쌓여서 못 쓰게 되므로,
// 한 페이지에 PAGE_SIZE 건만 보여주고 각 항목은 접은 상태로 렌더한다.

export const PAGE_SIZE = 20;

export type ListParams = {
  q?: string;
  status?: string;
  page?: string;
};

export type StatusOption = { value: string; label: string };

/**
 * 검색어·상태로 걸러내고 현재 페이지 몫만 잘라 돌려준다.
 * search: 항목에서 검색 대상 문자열을 뽑는 함수
 * status: 항목의 상태 값을 뽑는 함수 (없으면 상태 필터 무시)
 */
export function applyListParams<T>(
  items: T[],
  params: ListParams | undefined,
  options: { search: (item: T) => string; status?: (item: T) => string }
) {
  const q = (params?.q ?? "").trim().toLowerCase();
  const status = params?.status ?? "all";

  const filtered = items.filter((item) => {
    if (status !== "all" && options.status && options.status(item) !== status) {
      return false;
    }
    if (q && !options.search(item).toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requested = Number(params?.page ?? 1);
  const page = Math.min(Math.max(1, Number.isFinite(requested) ? requested : 1), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return {
    rows: filtered.slice(start, start + PAGE_SIZE),
    matched: filtered.length,
    total: items.length,
    page,
    pageCount
  };
}

/** 저장 후 돌아올 때 검색·필터·페이지를 유지하기 위한 쿼리 문자열 */
export function returnQuery(params: ListParams | undefined): string {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status && params.status !== "all") search.set("status", params.status);
  if (params?.page && params.page !== "1") search.set("page", params.page);
  return search.toString();
}

/** 서버 액션에서 저장 후 리다이렉트 주소를 만들 때 사용 */
export function withReturnQuery(basePath: string, formData: FormData, extra: string): string {
  const ret = String(formData.get("return_query") ?? "");
  return `${basePath}${ret ? `&${ret}` : ""}&${extra}`;
}

function pageHref(
  basePath: string,
  tab: string,
  params: ListParams | undefined,
  page: number
) {
  const search = new URLSearchParams({ tab });
  if (params?.q) search.set("q", params.q);
  if (params?.status && params.status !== "all") search.set("status", params.status);
  if (page > 1) search.set("page", String(page));
  return `${basePath}?${search.toString()}`;
}

export function AdminListToolbar({
  basePath,
  tab,
  params,
  statuses,
  matched,
  total,
  searchHint
}: {
  basePath: string;
  tab: string;
  params?: ListParams;
  statuses?: StatusOption[];
  matched: number;
  total: number;
  searchHint: string;
}) {
  const filtered = Boolean(params?.q) || Boolean(params?.status && params.status !== "all");

  return (
    <form action={basePath} className="admin-list-toolbar" method="get">
      <input name="tab" type="hidden" value={tab} />
      <input
        aria-label="목록 검색"
        className="admin-list-search"
        defaultValue={params?.q ?? ""}
        name="q"
        placeholder={searchHint}
        type="search"
      />
      {statuses ? (
        <select aria-label="상태 필터" defaultValue={params?.status ?? "all"} name="status">
          <option value="all">전체 상태</option>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      ) : null}
      <button className="admin-btn" type="submit">
        검색
      </button>
      {filtered ? (
        <Link className="admin-list-reset" href={`${basePath}?tab=${tab}`} prefetch={false}>
          초기화
        </Link>
      ) : null}
      <span className="admin-list-count">
        {matched}건{matched !== total ? ` / 전체 ${total}건` : ""}
      </span>
    </form>
  );
}

export function AdminPager({
  basePath,
  tab,
  params,
  page,
  pageCount
}: {
  basePath: string;
  tab: string;
  params?: ListParams;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="페이지 이동" className="admin-pager">
      {page > 1 ? (
        <Link
          className="admin-btn"
          href={pageHref(basePath, tab, params, page - 1)}
          prefetch={false}
        >
          이전
        </Link>
      ) : (
        <span className="admin-btn admin-pager-disabled">이전</span>
      )}
      <span className="admin-pager-status">
        {page} / {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          className="admin-btn"
          href={pageHref(basePath, tab, params, page + 1)}
          prefetch={false}
        >
          다음
        </Link>
      ) : (
        <span className="admin-btn admin-pager-disabled">다음</span>
      )}
    </nav>
  );
}

/**
 * 목록 항목 하나. 기본은 접힌 상태이고, 제목 줄을 누르면 편집 폼이 열린다.
 * previewHref가 있으면 공개 페이지를 새 탭으로 여는 링크를 제목 줄에 붙인다.
 */
export function AdminItem({
  title,
  meta,
  previewHref,
  selectionSlot,
  children
}: {
  title: string;
  meta: ReactNode;
  previewHref?: string;
  selectionSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="admin-item">
      <summary className="admin-item-summary">
        {selectionSlot ?? null}
        <span className="admin-item-title">{title}</span>
        <span className="admin-item-meta">{meta}</span>
        {previewHref ? (
          <a
            className="admin-item-preview"
            href={previewHref}
            rel="noreferrer"
            target="_blank"
          >
            미리보기 ↗
          </a>
        ) : null}
      </summary>
      {children}
    </details>
  );
}
