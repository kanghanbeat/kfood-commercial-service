import { getContentImages, type ImageOwnerType } from "@kfood/data";

import { AdminGallery } from "@/components/admin/admin-gallery";

// 사진 갤러리(서버 쪽). 현재 사진 목록만 읽어 클라이언트 갤러리에 넘긴다.
// 실제 올리기·순서변경·삭제는 admin-gallery + image-gallery-actions가 페이지 이동 없이 처리한다.
//
// returnQuery는 더 이상 쓰지 않지만, 여러 패널이 넘겨주므로 시그니처는 유지한다(무시).
export async function AdminImageField({
  ownerId,
  ownerType
}: {
  ownerId: string;
  ownerType: ImageOwnerType;
  returnQuery?: string;
}) {
  const images = await getContentImages(ownerType, ownerId);

  return (
    <AdminGallery images={images} ownerId={ownerId} ownerType={ownerType} />
  );
}
