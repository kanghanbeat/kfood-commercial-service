"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";

import type { AdminDeletableEntity, PublicationStatus } from "@kfood/data";

import { bulkApply } from "@/components/admin/bulk-actions";
import type { StatusOption } from "@/components/admin/list-controls";

// 목록 일괄 선택·작업. 체크박스로 여러 개를 고르면 위에 작업바가 뜨고,
// 발행 상태 변경 / 보관 / 삭제를 한 번에 적용한다. 선택 상태는 이 컨텍스트로 공유한다.

type BulkContextValue = {
  selected: Set<string>;
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  setMany: (ids: string[], on: boolean) => void;
  clear: () => void;
};

const BulkContext = createContext<BulkContextValue | null>(null);

export function BulkProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const value = useMemo<BulkContextValue>(
    () => ({
      selected,
      isSelected: (id) => selected.has(id),
      toggle: (id) =>
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        }),
      setMany: (ids, on) =>
        setSelected((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
          return next;
        }),
      clear: () => setSelected(new Set())
    }),
    [selected]
  );

  return <BulkContext.Provider value={value}>{children}</BulkContext.Provider>;
}

function useBulk() {
  const ctx = useContext(BulkContext);
  if (!ctx) {
    throw new Error("BulkProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}

// 항목 체크박스. <summary> 안에 있어도 클릭이 펼침 토글로 새지 않도록 전파를 막는다.
export function BulkCheckbox({ id, label }: { id: string; label: string }) {
  const { isSelected, toggle } = useBulk();
  return (
    <span
      className="admin-bulk-check"
      onClick={(event) => event.stopPropagation()}
    >
      <input
        aria-label={`${label} 선택`}
        checked={isSelected(id)}
        onChange={() => toggle(id)}
        type="checkbox"
      />
    </span>
  );
}

export function BulkBar({
  entity,
  statuses,
  pageIds
}: {
  entity: AdminDeletableEntity;
  statuses: StatusOption[];
  pageIds: string[];
}) {
  const router = useRouter();
  const { selected, setMany, clear } = useBulk();
  const [status, setStatus] = useState<PublicationStatus | "">("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, startRefresh] = useTransition();
  const working = busy || pending;

  const count = selected.size;
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  async function apply(op: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = await bulkApply({ entity, ids: Array.from(selected), op });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "일부 항목을 처리하지 못했습니다.");
    } else {
      setNotice(`${result.done}건 처리했습니다.`);
    }
    setConfirmDelete(false);
    clear();
    startRefresh(() => router.refresh());
  }

  if (count === 0) {
    return (
      <div className="admin-bulk-bar empty">
        <label className="admin-bulk-selectall">
          <input
            checked={allOnPage}
            disabled={pageIds.length === 0}
            onChange={(event) => setMany(pageIds, event.target.checked)}
            type="checkbox"
          />
          이 페이지 전체 선택
        </label>
        <span className="admin-bulk-hint">
          항목을 체크하면 한 번에 상태 변경·보관·삭제할 수 있습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="admin-bulk-bar active">
      <div className="admin-bulk-row">
        <label className="admin-bulk-selectall">
          <input
            checked={allOnPage}
            onChange={(event) => setMany(pageIds, event.target.checked)}
            type="checkbox"
          />
          이 페이지 전체
        </label>
        <strong className="admin-bulk-count">{count}개 선택됨</strong>
        <button
          className="admin-btn"
          disabled={working}
          onClick={() => clear()}
          type="button"
        >
          선택 해제
        </button>
      </div>

      <div className="admin-bulk-row">
        <select
          aria-label="바꿀 발행 상태"
          disabled={working}
          onChange={(event) => setStatus(event.target.value as PublicationStatus | "")}
          value={status}
        >
          <option value="">상태 변경…</option>
          {statuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="admin-btn primary"
          disabled={working || status === ""}
          onClick={() => apply(`status:${status}`)}
          type="button"
        >
          상태 적용
        </button>

        <button
          className="admin-btn"
          disabled={working}
          onClick={() => apply("archive")}
          type="button"
        >
          보관
        </button>

        {confirmDelete ? (
          <>
            <button
              className="admin-btn admin-btn-danger"
              disabled={working}
              onClick={() => apply("delete")}
              type="button"
            >
              정말 {count}개 삭제
            </button>
            <button
              className="admin-btn"
              disabled={working}
              onClick={() => setConfirmDelete(false)}
              type="button"
            >
              취소
            </button>
          </>
        ) : (
          <button
            className="admin-btn"
            disabled={working}
            onClick={() => setConfirmDelete(true)}
            type="button"
          >
            삭제
          </button>
        )}
      </div>

      {error ? <p className="status-message error">{error}</p> : null}
      {notice ? <p className="status-message success">{notice}</p> : null}
    </div>
  );
}
