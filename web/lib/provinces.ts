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

export function provinceOfRegion(regionSlug: string): ProvinceKey | null {
  for (const [key, info] of Object.entries(PROVINCES)) {
    if (info.regionSlugs.includes(regionSlug)) {
      return key as ProvinceKey;
    }
  }
  return null;
}
