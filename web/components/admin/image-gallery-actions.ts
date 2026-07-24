"use server";

import { revalidatePath } from "next/cache";

import {
  addContentImage,
  deleteContentImage,
  moveContentImage,
  reorderContentImages,
  setPrimaryContentImage,
  type ImageOwnerType
} from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

// 사진 갤러리 서버 액션. 예전에는 저장 후 redirect로 페이지를 통째로 다시 열어서
// 편집창이 닫히고 느렸다. 이제는 결과만 돌려주고, 화면 갱신은 클라이언트가
// router.refresh()로 그 자리에서 처리한다(편집창 유지 + 빠름).

type GalleryResult = { ok: boolean; message?: string; added?: number };

const publicPathByOwner: Record<ImageOwnerType, string> = {
  food: "/foods",
  place: "/places",
  region: "/regions",
  route: "/routes"
};

function revalidateFor(ownerType: ImageOwnerType) {
  revalidatePath(publicPathByOwner[ownerType] ?? "/foods");
  revalidatePath("/admin/manage");
}

/** 여러 장을 한 번에 올린다. 하나라도 실패하면 그때까지 올린 수와 함께 멈춘다. */
export async function uploadGalleryImages(formData: FormData): Promise<GalleryResult> {
  const session = await requireAdminSession();
  const ownerType = String(formData.get("owner_type") ?? "") as ImageOwnerType;
  const ownerId = String(formData.get("owner_id") ?? "");
  const altText = String(formData.get("alt_text") ?? "");

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return { ok: false, message: "사진 파일을 골라주세요." };
  }

  let added = 0;
  for (const file of files) {
    const result = await addContentImage(session.accessToken, {
      actorId: session.userId,
      altText,
      file: {
        bytes: await file.arrayBuffer(),
        name: file.name,
        size: file.size,
        type: file.type
      },
      ownerId,
      ownerType
    });

    if (!result.ok) {
      if (added > 0) {
        revalidateFor(ownerType);
      }
      return { ok: false, message: result.message, added };
    }
    added += 1;
  }

  revalidateFor(ownerType);
  return { ok: true, added };
}

export async function moveGalleryImage(input: {
  imageId: string;
  ownerType: ImageOwnerType;
  direction: "up" | "down";
}): Promise<GalleryResult> {
  const session = await requireAdminSession();

  const result = await moveContentImage(session.accessToken, {
    actorId: session.userId,
    direction: input.direction,
    imageId: input.imageId
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidateFor(input.ownerType);
  return { ok: true };
}

export async function reorderGalleryImages(input: {
  ownerId: string;
  ownerType: ImageOwnerType;
  orderedIds: string[];
}): Promise<GalleryResult> {
  const session = await requireAdminSession();

  const result = await reorderContentImages(session.accessToken, {
    actorId: session.userId,
    orderedIds: input.orderedIds,
    ownerId: input.ownerId,
    ownerType: input.ownerType
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidateFor(input.ownerType);
  return { ok: true };
}

export async function setPrimaryGalleryImage(input: {
  imageId: string;
  ownerType: ImageOwnerType;
}): Promise<GalleryResult> {
  const session = await requireAdminSession();

  const result = await setPrimaryContentImage(session.accessToken, {
    actorId: session.userId,
    imageId: input.imageId
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidateFor(input.ownerType);
  return { ok: true };
}

export async function deleteGalleryImage(input: {
  imageId: string;
  ownerType: ImageOwnerType;
}): Promise<GalleryResult> {
  const session = await requireAdminSession();

  const result = await deleteContentImage(session.accessToken, {
    actorId: session.userId,
    imageId: input.imageId
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidateFor(input.ownerType);
  return { ok: true };
}
