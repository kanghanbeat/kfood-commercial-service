import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  removeContentImage,
  uploadContentImage,
  type ImageOwnerType
} from "@kfood/data";

import { withReturnQuery } from "@/components/admin/list-controls";
import { requireAdminSession } from "@/lib/admin-auth";

// 콘텐츠 사진 올리기·지우기. 파일을 고르면 Supabase Storage에 저장되고
// 공개 페이지에 그 사진이 나온다(사진이 없으면 기존 색 배경 자리표시).
//
// 사진 업로드는 편집 폼과 별개의 form이다 — 사진만 바꾸고 싶을 때
// 다른 입력값까지 저장되지 않도록 분리했다.

const ownerPath: Record<ImageOwnerType, { admin: string; tab: string; publicPath: string }> = {
  food: { admin: "/admin/manage", tab: "foods", publicPath: "/foods" },
  place: { admin: "/admin/manage", tab: "places", publicPath: "/places" },
  region: { admin: "/admin/manage", tab: "regions", publicPath: "/regions" },
  route: { admin: "/admin/manage", tab: "routes", publicPath: "/routes" }
};

function ownerFromForm(formData: FormData) {
  const ownerType = String(formData.get("owner_type") ?? "") as ImageOwnerType;
  const ownerId = String(formData.get("owner_id") ?? "");
  const route = ownerPath[ownerType] ?? ownerPath.food;
  return { ownerType, ownerId, route };
}

async function uploadImage(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const { ownerType, ownerId, route } = ownerFromForm(formData);
  const base = `${route.admin}?tab=${route.tab}`;

  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    redirect(
      withReturnQuery(base, formData, `error=${encodeURIComponent("사진 파일을 골라주세요.")}`)
    );
  }

  const result = await uploadContentImage(session.accessToken, {
    actorId: session.userId,
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
    redirect(withReturnQuery(base, formData, `error=${encodeURIComponent(result.message)}`));
  }

  revalidatePath(route.publicPath);
  revalidatePath(route.admin);
  redirect(withReturnQuery(base, formData, "image_saved=1"));
}

async function removeImage(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const { ownerType, ownerId, route } = ownerFromForm(formData);
  const base = `${route.admin}?tab=${route.tab}`;

  const result = await removeContentImage(session.accessToken, {
    actorId: session.userId,
    ownerId,
    ownerType
  });

  if (!result.ok) {
    redirect(withReturnQuery(base, formData, `error=${encodeURIComponent(result.message)}`));
  }

  revalidatePath(route.publicPath);
  revalidatePath(route.admin);
  redirect(withReturnQuery(base, formData, "image_removed=1"));
}

export function AdminImageField({
  imageUrl,
  ownerId,
  ownerType,
  returnQuery
}: {
  imageUrl: string | null;
  ownerId: string;
  ownerType: ImageOwnerType;
  returnQuery: string;
}) {
  return (
    <div className="admin-image-field">
      <span className="admin-metric-label">대표 사진</span>

      {imageUrl ? (
        // 저장소 주소가 도메인마다 달라 next/image 최적화를 쓰지 않는다.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="현재 대표 사진" className="admin-image-preview" src={imageUrl} />
      ) : (
        <p className="admin-image-empty">
          아직 사진이 없습니다. 사진을 올리면 공개 페이지 카드와 상세 화면에 나옵니다.
        </p>
      )}

      <form action={uploadImage} className="admin-image-form">
        <input name="owner_type" type="hidden" value={ownerType} />
        <input name="owner_id" type="hidden" value={ownerId} />
        <input name="return_query" type="hidden" value={returnQuery} />
        <input
          accept="image/jpeg,image/png,image/webp,image/avif"
          name="image"
          required
          type="file"
        />
        <button className="admin-btn primary" type="submit">
          {imageUrl ? "사진 교체" : "사진 올리기"}
        </button>
      </form>

      <p className="admin-image-hint">JPG · PNG · WebP · AVIF, 5MB 이하</p>

      {imageUrl ? (
        <form action={removeImage}>
          <input name="owner_type" type="hidden" value={ownerType} />
          <input name="owner_id" type="hidden" value={ownerId} />
          <input name="return_query" type="hidden" value={returnQuery} />
          <button className="admin-btn" type="submit">
            사진 지우기
          </button>
        </form>
      ) : null}
    </div>
  );
}
