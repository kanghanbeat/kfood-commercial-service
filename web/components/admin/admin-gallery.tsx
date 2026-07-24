"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ContentImage, ImageOwnerType } from "@kfood/data";

import {
  deleteGalleryImage,
  moveGalleryImage,
  reorderGalleryImages,
  setPrimaryGalleryImage,
  uploadGalleryImages
} from "@/components/admin/image-gallery-actions";

// 사진 갤러리 UI(클라이언트). 그리드로 배열하고, 썸네일을 끌어(드래그) 순서를 바꾼다.
// 드래그는 라이브러리 없이 브라우저 기본 기능(HTML5 Drag&Drop)만 쓴다.
// 버튼(★ 대표로 / ← → / ✕)도 그대로 둔다 — 터치나 미세 조정용.

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
  // busy: 서버 저장 중, pending: 저장 후 화면 갱신 중. 둘 중 하나면 버튼 잠금.
  const [busy, setBusy] = useState(false);
  const [pending, startRefresh] = useTransition();
  const working = busy || pending;

  // 드래그 중에는 화면에서 즉시 순서가 바뀌어 보이도록 로컬 상태로 들고 있는다.
  const [items, setItems] = useState<ContentImage[]>(images);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // 서버 데이터가 갱신되면(refresh 후) 로컬 순서도 맞춘다.
  const serverKey = images.map((image) => image.id).join("|");
  useEffect(() => {
    setItems(images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

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
      return false;
    }
    startRefresh(() => router.refresh());
    return true;
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

  function handleDragOver(overId: string) {
    if (!draggingId || draggingId === overId) {
      return;
    }
    setItems((prev) => {
      const from = prev.findIndex((image) => image.id === draggingId);
      const to = prev.findIndex((image) => image.id === overId);
      if (from === -1 || to === -1) {
        return prev;
      }
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function handleDragEnd() {
    setDraggingId(null);
    const orderedIds = items.map((image) => image.id);
    const original = images.map((image) => image.id);
    if (orderedIds.join("|") === original.join("|")) {
      return; // 순서가 안 바뀌었으면 저장하지 않는다.
    }
    const ok = await run(
      () => reorderGalleryImages({ orderedIds, ownerId, ownerType }),
      "순서를 저장하지 못했습니다."
    );
    if (!ok) {
      setItems(images); // 실패하면 원래 순서로 되돌린다.
    }
  }

  return (
    <div className="admin-image-field">
      <div className="admin-image-head">
        <span className="admin-metric-label">사진 ({items.length}장)</span>
        {items.length > 0 ? (
          <span className="admin-image-head-hint">
            썸네일을 끌어 순서를 바꾸세요. 맨 앞(대표)이 목록 카드에 쓰입니다.
          </span>
        ) : null}
      </div>

      {error ? <p className="status-message error">{error}</p> : null}
      {notice ? <p className="status-message success">{notice}</p> : null}

      {items.length === 0 ? (
        <p className="admin-image-empty">
          아직 사진이 없습니다. 사진을 올리면 공개 페이지에 나옵니다.
        </p>
      ) : (
        <ul className="admin-image-grid">
          {items.map((image, index) => (
            <li
              className={
                draggingId === image.id
                  ? "admin-image-tile dragging"
                  : "admin-image-tile"
              }
              key={image.id}
              onDragEnter={() => handleDragOver(image.id)}
              onDragOver={(event) => event.preventDefault()}
            >
              <div
                className="admin-image-thumb-wrap"
                draggable={!working}
                onDragEnd={handleDragEnd}
                onDragStart={() => setDraggingId(image.id)}
                title="끌어서 순서 변경"
              >
                {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={image.altText ?? `사진 ${index + 1}`}
                  className="admin-image-thumb"
                  draggable={false}
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
                <span className="admin-image-drag-hint" aria-hidden="true">
                  ⠿
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
                    disabled={working || index === items.length - 1}
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
