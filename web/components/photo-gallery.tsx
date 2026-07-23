import { getContentImages, type ImageOwnerType } from "@kfood/data";

// 상세 페이지 사진 갤러리. 어드민에서 올린 사진을 순서대로 보여준다.
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

  // 첫 장은 히어로(상단 큰 사진)에 이미 쓰이므로 나머지만 보여준다.
  const rest = images.slice(1);

  if (rest.length === 0) {
    return null;
  }

  return (
    <section aria-label={`${title} 사진`} className="photo-gallery">
      <ul className="photo-gallery-list">
        {rest.map((image, index) => (
          <li className="photo-gallery-item" key={image.id}>
            {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={image.altText ?? `${title} 사진 ${index + 2}`}
              className="photo-gallery-img"
              loading="lazy"
              src={image.url}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
