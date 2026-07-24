"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ContentImage, ImageOwnerType } from "@kfood/data";

import {
  deleteGalleryImage,
  moveGalleryImage,
  setPrimaryGalleryImage,
  uploadGalleryImages
} from "@/components/admin/image-gallery-actions";

// 사진 갤러리 UI(클라이언트). 사진을 올리거나 순서를 바꿔도 페이지를 새로 열지 않고
// 이 자리에서만 갱신한다. 사진이 많아도 보기 좋게 그리드(가로 여러 칸)로 배열하고,
// 20장 이상일 때 한 칸씩 옮기지 않도록 "대표로"(맨 앞으로) 버튼을 둔다.

export function AdminGallery({
  images,
  ownerId,
  ownerType
}: {
  images: ContentImage[];
  ownerId: string;
  ownerType: ImageOwnerType;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // busy: 서버에 저장 중, pending: 저장 후 화면 갱신 중. 둘 중 하나라도 켜지면 버튼을 잠근다.
  const [busy, setBusy] = useState(false);
  const [pending, startRefresh] = useTransition();
  const working = busy || pending;

  async function run(
    task: () => Promise<{ ok: boolean; message?: string }>,
    fallbackMessage: string
  ) {
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = await task();
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? fallbackMessage);
      return;
    }
    startRefresh(() => router.refresh());
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    setNotice(null);

    const result = await uploadGalleryImages(formData);
    setBusy(false);

    if (!result.ok) {
      setError(
        result.added
          ? `${result.added}장까지 올리고 멈췄습니다. ${result.message ?? ""}`
          : result.message ?? "사진을 올리지 못했습니다."
      );
      startRefresh(() => router.refresh());
      return;
    }

    formRef.current?.reset();
    setNotice(`${result.added}장 추가했습니다.`);
    startRefresh(() => router.refresh());
  }

  return (
    <div className="admin-image-field">
      <div className="admin-image-head">
        <span className="admin-metric-label">사진 ({images.length}장)</span>
        {images.length > 0 ? (
          <span className="admin-image-head-hint">
            맨 앞(1번)이 목록 카드에 쓰이는 대표 사진입니다.
          </span>
        ) : null}
      </div>

      {error ? <p className="status-message error">{error}</p> : null}
      {notice ? <p className="status-message success">{notice}</p> : null}

      {images.length === 0 ? (
        <p className="admin-image-empty">
          아직 사진이 없습니다. 사진을 올리면 공개 페이지에 나옵니다.
        </p>
      ) : (
        <ul className="admin-image-grid">
          {images.map((image, index) => (
            <li className="admin-image-tile" key={image.id}>
              <div className="admin-image-thumb-wrap">
                {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={image.altText ?? `사진 ${index + 1}`}
                  className="admin-image-thumb"
                  src={image.url}
                />
                <span
                  className={
                    index === 0
                      ? "admin-image-order-badge primary"
                      : "admin-image-order-badge"
                  }
                >
                  {index === 0 ? "대표" : index + 1}
                </span>
              </div>

              <div className="admin-image-tile-actions">
                {index > 0 ? (
                  <button
                    className="admin-icon-btn"
                    disabled={working}
                    onClick={() =>
                      run(
                        () => setPrimaryGalleryImage({ imageId: image.id, ownerType }),
                        "대표로 바꾸지 못했습니다."
                      )
                    }
                    title="대표 사진으로 (맨 앞으로)"
                    type="button"
                  >
                    ★ 대표로
                  </button>
                ) : null}
                <div className="admin-icon-btn-row">
                  <button
                    className="admin-icon-btn"
                    disabled={working || index === 0}
                    onClick={() =>
                      run(
                        () => moveGalleryImage({ direction: "up", imageId: image.id, ownerType }),
                        "순서를 바꾸지 못했습니다."
                      )
                    }
                    title="앞으로"
                    type="button"
                  >
                    ←
                  </button>
                  <button
                    className="admin-icon-btn"
                    disabled={working || index === images.length - 1}
                    onClick={() =>
                      run(
                        () => moveGalleryImage({ direction: "down", imageId: image.id, ownerType }),
                        "순서를 바꾸지 못했습니다."
                      )
                    }
                    title="뒤로"
                    type="button"
                  >
                    →
                  </button>
                  <button
                    className="admin-icon-btn danger"
                    disabled={working}
                    onClick={() =>
                      run(
                        () => deleteGalleryImage({ imageId: image.id, ownerType }),
                        "사진을 지우지 못했습니다."
                      )
                    }
                    title="지우기"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="admin-image-form" onSubmit={handleUpload} ref={formRef}>
        <input name="owner_type" type="hidden" value={ownerType} />
        <input name="owner_id" type="hidden" value={ownerId} />
        <input
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          name="images"
          required
          type="file"
        />
        <input
          className="admin-image-alt-input"
          name="alt_text"
          placeholder="사진 설명 (선택 · 여러 장에 같이 붙습니다)"
        />
        <button className="admin-btn primary" disabled={working} type="submit">
          {busy ? "올리는 중…" : "사진 추가"}
        </button>
      </form>

      <p className="admin-image-hint">
        JPG · PNG · WebP · AVIF, 한 장당 5MB 이하. 여러 장 한 번에 선택할 수 있습니다.
      </p>
    </div>
  );
}
