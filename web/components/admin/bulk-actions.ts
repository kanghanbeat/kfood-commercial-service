"use server";

import { revalidatePath } from "next/cache";

import {
  archiveAdminEntity,
  deleteAdminEntity,
  setAdminEntityStatus,
  type AdminDeletableEntity,
  type PublicationStatus
} from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

// 목록 일괄 작업. 체크한 여러 항목에 같은 작업을 반복 적용한다.
// op 형식: "status:published" | "status:hidden" | "archive" | "delete"

type BulkResult = { ok: boolean; message?: string; done: number; failed: number };

const publicPathByEntity: Record<AdminDeletableEntity, string | null> = {
  region: "/regions",
  food: "/foods",
  place: "/places",
  route: "/routes",
  production: null
};

const adminPathByEntity: Record<AdminDeletableEntity, string> = {
  region: "/admin/manage",
  food: "/admin/manage",
  place: "/admin/manage",
  route: "/admin/manage",
  production: "/admin/content"
};

const statusValues: PublicationStatus[] = ["draft", "published", "hidden", "archived"];

export async function bulkApply(input: {
  entity: AdminDeletableEntity;
  ids: string[];
  op: string;
}): Promise<BulkResult> {
  const session = await requireAdminSession();
  const ids = Array.from(new Set(input.ids.filter(Boolean)));

  if (ids.length === 0) {
    return { ok: false, message: "선택된 항목이 없습니다.", done: 0, failed: 0 };
  }

  let done = 0;
  let failed = 0;
  let lastMessage: string | undefined;

  for (const id of ids) {
    let result;
    if (input.op === "delete") {
      result = await deleteAdminEntity(session.accessToken, {
        actorId: session.userId,
        entity: input.entity,
        id
      });
    } else if (input.op === "archive") {
      result = await archiveAdminEntity(session.accessToken, {
        actorId: session.userId,
        entity: input.entity,
        id
      });
    } else if (input.op.startsWith("status:")) {
      const status = input.op.slice("status:".length) as PublicationStatus;
      if (!statusValues.includes(status)) {
        return { ok: false, message: "지원하지 않는 상태입니다.", done, failed };
      }
      result = await setAdminEntityStatus(session.accessToken, {
        actorId: session.userId,
        entity: input.entity,
        id,
        status
      });
    } else {
      return { ok: false, message: "지원하지 않는 작업입니다.", done, failed };
    }

    if (result.ok) {
      done += 1;
    } else {
      failed += 1;
      lastMessage = result.message;
    }
  }

  const publicPath = publicPathByEntity[input.entity];
  if (publicPath) revalidatePath(publicPath);
  revalidatePath(adminPathByEntity[input.entity] ?? "/admin/manage");

  return {
    ok: failed === 0,
    message:
      failed > 0
        ? `${done}건 처리, ${failed}건 실패${lastMessage ? ` — ${lastMessage}` : ""}`
        : undefined,
    done,
    failed
  };
}
