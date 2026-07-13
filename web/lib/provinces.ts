// 시·도(17) ↔ 지역(regions, 동네·도시 단위) 매핑 — A안(스키마 무변경, 코드 매핑표).
// 지도 클릭 → /regions?province=<key> 로 이동한다 (메인개편-작업계획.md 결정 사항).
// 새 지역을 DB에 추가하면 여기에도 slug를 등록해야 지도와 연결된다.

export type ProvinceKey =
  | "Seoul"
  | "Busan"
  | "Daegu"
  | "Incheon"
  | "Gwangju"
  | "Daejeon"
  | "Ulsan"
  | "Sejongsi"
  | "Gyeonggi-do"
  | "Gangwon-do"
  | "Chungcheongbuk-do"
  | "Chungcheongnam-do"
  | "Jeollabuk-do"
  | "Jeollanam-do"
  | "Gyeongsangbuk-do"
  | "Gyeongsangnam-do"
  | "Jeju-do";

export type ProvinceInfo = {
  nameEn: string;
  nameKo: string;
  // 툴팁에 보여줄 대표 음식 (에디토리얼 선정). 콘텐츠 없는 시·도는 null.
  representativeFood: string | null;
  regionSlugs: string[];
};

export const PROVINCES: Record<ProvinceKey, ProvinceInfo> = {
  Seoul: {
    nameEn: "Seoul",
    nameKo: "서울",
    representativeFood: "Tteokbokki",
    regionSlugs: [
      "seoul",
      "myeongdong",
      "hongdae",
      "gangnam",
      "jongno",
      "gwangjang-market",
      "sindang",
      "dongdaemun",
      "jangchung",
      "mapo"
    ]
  },
  Incheon: {
    nameEn: "Incheon",
    nameKo: "인천",
    representativeFood: "Jajangmyeon",
    regionSlugs: ["incheon"]
  },
  "Gyeonggi-do": {
    nameEn: "Gyeonggi",
    nameKo: "경기",
    representativeFood: "Suwon Galbi",
    regionSlugs: [
      "suwon",
      "uijeongbu",
      "anyang",
      "icheon",
      "pocheon",
      "yangpyeong",
      "gapyeong",
      "namhansanseong",
      "paju",
      "ansan",
      "yongin",
      "gwangmyeong"
    ]
  },
  Busan: { nameEn: "Busan", nameKo: "부산", representativeFood: null, regionSlugs: [] },
  Daegu: { nameEn: "Daegu", nameKo: "대구", representativeFood: null, regionSlugs: [] },
  Gwangju: { nameEn: "Gwangju", nameKo: "광주", representativeFood: null, regionSlugs: [] },
  Daejeon: { nameEn: "Daejeon", nameKo: "대전", representativeFood: null, regionSlugs: [] },
  Ulsan: { nameEn: "Ulsan", nameKo: "울산", representativeFood: null, regionSlugs: [] },
  Sejongsi: { nameEn: "Sejong", nameKo: "세종", representativeFood: null, regionSlugs: [] },
  "Gangwon-do": { nameEn: "Gangwon", nameKo: "강원", representativeFood: null, regionSlugs: [] },
  "Chungcheongbuk-do": {
    nameEn: "Chungbuk",
    nameKo: "충북",
    representativeFood: null,
    regionSlugs: []
  },
  "Chungcheongnam-do": {
    nameEn: "Chungnam",
    nameKo: "충남",
    representativeFood: null,
    regionSlugs: []
  },
  "Jeollabuk-do": {
    nameEn: "Jeonbuk",
    nameKo: "전북",
    representativeFood: null,
    regionSlugs: []
  },
  "Jeollanam-do": {
    nameEn: "Jeonnam",
    nameKo: "전남",
    representativeFood: null,
    regionSlugs: []
  },
  "Gyeongsangbuk-do": {
    nameEn: "Gyeongbuk",
    nameKo: "경북",
    representativeFood: null,
    regionSlugs: []
  },
  "Gyeongsangnam-do": {
    nameEn: "Gyeongnam",
    nameKo: "경남",
    representativeFood: null,
    regionSlugs: []
  },
  "Jeju-do": { nameEn: "Jeju", nameKo: "제주", representativeFood: null, regionSlugs: [] }
};

export function isProvinceKey(value: string): value is ProvinceKey {
  return value in PROVINCES;
}

// ── 도 단위 권역 그룹 ─────────────────────────────────────────
// 지도는 광역시를 따로 보여주지 않고 소속 도에 합쳐 9개 권역으로 묶는다
// (서울·인천→수도권, 대전·세종→충남, 부산·울산→경남 등).
// 호버·색칠·클릭이 전부 권역 단위로 동작한다.

export type ProvinceGroupKey =
  | "gyeonggi"
  | "gangwon"
  | "chungbuk"
  | "chungnam"
  | "jeonbuk"
  | "jeonnam"
  | "gyeongbuk"
  | "gyeongnam"
  | "jeju";

export type ProvinceGroup = {
  nameEn: string;
  nameKo: string;
  representativeFood: string | null;
  memberIds: ProvinceKey[];
};

export const PROVINCE_GROUPS: Record<ProvinceGroupKey, ProvinceGroup> = {
  gyeonggi: {
    nameEn: "Seoul · Gyeonggi",
    nameKo: "수도권",
    representativeFood: "Tteokbokki",
    memberIds: ["Seoul", "Incheon", "Gyeonggi-do"]
  },
  gangwon: {
    nameEn: "Gangwon",
    nameKo: "강원",
    representativeFood: null,
    memberIds: ["Gangwon-do"]
  },
  chungbuk: {
    nameEn: "Chungbuk",
    nameKo: "충북",
    representativeFood: null,
    memberIds: ["Chungcheongbuk-do"]
  },
  chungnam: {
    nameEn: "Chungnam",
    nameKo: "충남",
    representativeFood: null,
    memberIds: ["Chungcheongnam-do", "Daejeon", "Sejongsi"]
  },
  jeonbuk: {
    nameEn: "Jeonbuk",
    nameKo: "전북",
    representativeFood: null,
    memberIds: ["Jeollabuk-do"]
  },
  jeonnam: {
    nameEn: "Jeonnam",
    nameKo: "전남",
    representativeFood: null,
    memberIds: ["Jeollanam-do", "Gwangju"]
  },
  gyeongbuk: {
    nameEn: "Gyeongbuk",
    nameKo: "경북",
    representativeFood: null,
    memberIds: ["Gyeongsangbuk-do", "Daegu"]
  },
  gyeongnam: {
    nameEn: "Gyeongnam",
    nameKo: "경남",
    representativeFood: null,
    memberIds: ["Gyeongsangnam-do", "Busan", "Ulsan"]
  },
  jeju: {
    nameEn: "Jeju",
    nameKo: "제주",
    representativeFood: null,
    memberIds: ["Jeju-do"]
  }
};

export function isProvinceGroupKey(value: string): value is ProvinceGroupKey {
  return value in PROVINCE_GROUPS;
}

export function groupRegionSlugs(key: ProvinceGroupKey): string[] {
  return PROVINCE_GROUPS[key].memberIds.flatMap(
    (member) => PROVINCES[member].regionSlugs
  );
}

export function groupOfProvince(provinceId: string): ProvinceGroupKey | null {
  for (const [key, group] of Object.entries(PROVINCE_GROUPS)) {
    if ((group.memberIds as string[]).includes(provinceId)) {
      return key as ProvinceGroupKey;
    }
  }
  return null;
}

// ── 지도 마커 좌표 ────────────────────────────────────────────
// 관광으로 많이 가는 지역을 지도 위 점(마커)으로 보여준다.
// 좌표는 위경도 → viewBox(800×607) 선형 변환으로 계산한 값.
// ⚠️ 새 지역을 DB에 추가하고 지도에 마커를 띄우려면 여기에 좌표를 등록해야
//    한다 — 발행(published)된 지역 중 좌표가 있는 것만 자동으로 그려진다.

export const REGION_MAP_POINTS: Record<string, { x: number; y: number }> = {
  seoul: { x: 259.9, y: 114.9 },
  incheon: { x: 231.2, y: 126.4 },
  suwon: { x: 263.0, y: 146.7 },
  uijeongbu: { x: 265.5, y: 96.8 },
  anyang: { x: 257.2, y: 133.0 },
  icheon: { x: 306.6, y: 145.8 },
  pocheon: { x: 282.5, y: 80.3 },
  yangpyeong: { x: 311.9, y: 122.7 },
  gapyeong: { x: 314.3, y: 87.0 },
  namhansanseong: { x: 280.4, y: 124.0 },
  paju: { x: 239.4, y: 94.5 },
  ansan: { x: 244.6, y: 140.7 },
  yongin: { x: 280.1, y: 149.1 },
  gwangmyeong: { x: 248.1, y: 124.1 }
};

export function provinceOfRegion(regionSlug: string): ProvinceKey | null {
  for (const [key, info] of Object.entries(PROVINCES)) {
    if (info.regionSlugs.includes(regionSlug)) {
      return key as ProvinceKey;
    }
  }
  return null;
}
