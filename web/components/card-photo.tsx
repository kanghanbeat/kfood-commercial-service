// 실제 음식/지역/루트 사진은 아직 저작권 검토 대기 상태라 확정된 이미지가 없다.
// 그동안 카드가 빈 회색 박스로 보이지 않도록, 이름 기반으로 색이 정해지는
// 그라데이션 + 모노그램 플레이스홀더를 보여준다.
// 실제 사진이 확정되면 이 컴포넌트만 <img>로 교체하면 된다.

type CardPhotoVariant = "food" | "region" | "route" | "place";

type Palette = {
  gradient: string;
  glyph: string;
};

// 브랜드(#8500FF)·액센트(#FF5E00) 계열에서 서로 구분되는 팔레트.
const PALETTES: Palette[] = [
  { gradient: "linear-gradient(135deg, #8500FF 0%, #B57BFF 100%)", glyph: "rgba(255,255,255,0.9)" },
  { gradient: "linear-gradient(135deg, #FF5E00 0%, #FF9E5E 100%)", glyph: "rgba(255,255,255,0.95)" },
  { gradient: "linear-gradient(135deg, #2BB3B8 0%, #7FD9DC 100%)", glyph: "rgba(255,255,255,0.95)" },
  { gradient: "linear-gradient(135deg, #6A00CC 0%, #A24DFF 100%)", glyph: "rgba(255,255,255,0.9)" },
  { gradient: "linear-gradient(135deg, #E23A6E 0%, #FF89A8 100%)", glyph: "rgba(255,255,255,0.95)" },
  { gradient: "linear-gradient(135deg, #3D2B8C 0%, #6E5AC9 100%)", glyph: "rgba(255,255,255,0.88)" }
];

// 같은 이름이면 항상 같은 색이 나오도록 하는 안정적 해시(간단한 djb2 변형).
function hashLabel(label: string) {
  let hash = 5381;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 33 + label.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function monogram(label: string) {
  const trimmed = label.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "K";
}

// 상세 페이지 히어로 배너 등 카드 밖에서도 같은 색·글자를 쓸 수 있게 노출한다.
export function resolveCardPhoto(label: string) {
  const palette = PALETTES[hashLabel(label) % PALETTES.length];
  return { gradient: palette.gradient, glyph: palette.glyph, letter: monogram(label) };
}

const VARIANT_TAG: Record<CardPhotoVariant, string> = {
  food: "Dish",
  region: "Region",
  route: "Route",
  place: "Place"
};

export function CardPhoto({
  label,
  variant,
  tall = false,
  imageUrl
}: {
  label: string;
  variant: CardPhotoVariant;
  tall?: boolean;
  imageUrl?: string | null;
}) {
  const palette = PALETTES[hashLabel(label) % PALETTES.length];

  // 어드민에서 사진을 올렸으면 그 사진을, 없으면 기존 색 배경 자리표시를 쓴다.
  if (imageUrl) {
    return (
      <div className={`card-v2-photo${tall ? " tall" : ""} has-image`}>
        {/* 저장소 주소가 환경마다 달라 next/image 최적화를 쓰지 않는다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={label} className="card-v2-photo-img" loading="lazy" src={imageUrl} />
        <span className="card-v2-photo-tag">{VARIANT_TAG[variant]}</span>
      </div>
    );
  }

  return (
    <div
      className={`card-v2-photo${tall ? " tall" : ""}`}
      style={{ background: palette.gradient }}
      aria-hidden="true"
    >
      <span className="card-v2-photo-mono" style={{ color: palette.glyph }}>
        {monogram(label)}
      </span>
      <span className="card-v2-photo-tag">{VARIANT_TAG[variant]}</span>
    </div>
  );
}
