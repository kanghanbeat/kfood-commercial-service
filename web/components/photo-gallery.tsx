import { getContentImages, type ImageOwnerType } from "@kfood/data";

import { GalleryViewer } from "@/components/gallery-viewer";

// 상세 페이지 사진 갤러리(서버 쪽). 사진을 읽어 클라이언트 뷰어에 넘긴다.
// 사진이 없으면 아무것도 그리지 않는다(기존 자리표시가 그대로 쓰인다).

export async function PhotoGallery({
  ownerId,
  ownerType,
  title
}: {
  ownerId: string;
  ownerType: ImageOwnerType;
  title: string;
}) {
  const images = await getContentImages(ownerType, ownerId);

  if (images.length === 0) {
    return null;
  }

  return <GalleryViewer images={images} title={title} />;
}
