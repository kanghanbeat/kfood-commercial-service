// 촬영 메모 → 다녀온 곳 목록으로 바꾸는 변환기.
// 촬영 중에 휴대폰으로 적던 메모(불릿 + 지도 링크)를 그대로 붙여넣으면
// 한 줄씩 읽어 "다녀온 곳"으로 만든다. 못 알아본 값은 비워두고 화면에서 고치면 된다.
//
// 알아듣는 형태
//   1일차 / ✔️2일차(금) 5.1      → 며칠차인지 바뀜
//   * 꽃돌게장 1번가 - 게장        → 상호 - 메뉴
//   * 저녁 : 한꾼에88             → 구분 : 상호
//   * 바다김밥 - 포장              → 상호 - 구분
//   https://naver.me/xxxx        → 바로 위 장소의 지도 링크

import type { ShootStopCategory } from "@kfood/data";

export type ParsedShootStop = {
  category: ShootStopCategory;
  dayNumber: number;
  googleUrl: string | null;
  menu: string | null;
  name: string;
  naverUrl: string | null;
  sortOrder: number;
};

// 메모에 자주 쓰는 말 → 장소 구분
const categoryKeywords: { category: ShootStopCategory; words: string[] }[] = [
  { category: "stay", words: ["숙소", "호텔", "펜션", "리조트", "게스트하우스", "민박"] },
  { category: "cafe", words: ["카페", "커피", "디저트", "베이커리", "빵집", "롤케이크"] },
  { category: "takeout", words: ["포장", "테이크아웃"] },
  { category: "sight", words: ["관광", "구경", "명소", "산책", "전망", "야경"] },
  { category: "event", words: ["축제", "퍼레이드", "행사", "공연", "불꽃"] },
  { category: "breakfast", words: ["아침", "조식", "브런치"] },
  { category: "lunch", words: ["점심"] },
  { category: "dinner", words: ["저녁", "석식"] },
  { category: "snack", words: ["간식", "야식", "야참"] },
  { category: "meal", words: ["식사"] }
];

// "카페 여수에서"처럼 상호 앞에 붙는 구분 말. 이 말과 똑같을 때만 떼어낸다.
// (퍼레이드·축제처럼 상호 일부일 수 있는 말은 넣지 않는다)
const prefixLabels = [
  "숙소",
  "호텔",
  "펜션",
  "리조트",
  "카페",
  "커피",
  "디저트",
  "포장",
  "관광",
  "산책",
  "아침",
  "조식",
  "점심",
  "저녁",
  "석식",
  "식사",
  "브런치",
  "야식",
  "간식"
];

/** 문장 안에 있는 말로 장소 구분을 짐작한다. 못 찾으면 null. */
function guessCategory(text: string): ShootStopCategory | null {
  for (const { category, words } of categoryKeywords) {
    if (words.some((word) => text.includes(word))) {
      return category;
    }
  }

  return null;
}

/** 짧은 말(구분 표시)일 때만 구분으로 인정한다. 아니면 null. */
function categoryFromLabel(text: string): ShootStopCategory | null {
  const trimmed = text.trim();

  if (!trimmed || trimmed.length > 8) {
    return null;
  }

  return guessCategory(trimmed);
}

const urlPattern = /https?:\/\/[^\s)>\]]+/g;

function isNaverUrl(url: string) {
  return url.includes("naver.");
}

function isGoogleUrl(url: string) {
  return (
    url.includes("google.") || url.includes("goo.gl") || url.includes("maps.app")
  );
}

/** 줄 앞머리의 불릿·체크 기호를 떼어낸다. */
function stripBullet(line: string) {
  return line
    .replace(/^[\s​]*(?:[-*•·▪◦o]|\d+[.)]|[✔✅☑️✔️])+[\s]*/u, "")
    .trim();
}

/** "1일차", "✔️2일차(금) 5.1" 같은 줄이면 며칠차인지 돌려준다. */
function dayNumberFromLine(line: string): number | null {
  const match = line.match(/(\d+)\s*일\s*차/);
  return match ? Number(match[1]) : null;
}

/** "1차 여수 4.3" 같은 회차 제목 줄인지. 장소가 아니라 건너뛴다. */
function isRoundHeading(line: string) {
  return /^\d+\s*차(\s|$)/.test(line);
}

/**
 * 촬영 메모를 다녀온 곳 목록으로 바꾼다.
 * 링크만 있는 줄은 바로 앞 장소에 붙는다.
 */
export function parseShootMemo(memo: string): ParsedShootStop[] {
  const stops: ParsedShootStop[] = [];
  let dayNumber = 1;
  const orderByDay = new Map<number, number>();

  for (const rawLine of memo.split(/\r?\n/)) {
    const line = stripBullet(rawLine);

    if (!line) {
      continue;
    }

    const day = dayNumberFromLine(line);

    if (day !== null) {
      dayNumber = day;
      continue;
    }

    const urls = line.match(urlPattern) ?? [];
    const text = line.replace(urlPattern, "").trim();

    // 링크만 있는 줄 → 바로 앞 장소의 지도 링크로 붙인다.
    if (!text && urls.length > 0) {
      const last = stops[stops.length - 1];

      if (last) {
        for (const url of urls) {
          if (isNaverUrl(url)) last.naverUrl = last.naverUrl ?? url;
          else if (isGoogleUrl(url)) last.googleUrl = last.googleUrl ?? url;
          else last.naverUrl = last.naverUrl ?? url;
        }
      }

      continue;
    }

    if (!text || isRoundHeading(text)) {
      continue;
    }

    // "구분 : 상호" 또는 "상호 - 메뉴" 로 나눈다.
    const split = text.match(/^(.+?)\s*[-–—:/]\s*(.+)$/);
    let name = text;
    let menu: string | null = null;
    let category: ShootStopCategory | null = null;

    if (split) {
      const [, left, right] = split;
      const leftCategory = categoryFromLabel(left);
      const rightCategory = categoryFromLabel(right);

      if (leftCategory) {
        // "저녁 : 한꾼에88"
        category = leftCategory;
        name = right.trim();
      } else if (rightCategory) {
        // "바다김밥 - 포장"
        category = rightCategory;
        name = left.trim();
      } else {
        // "꽃돌게장 1번가 - 게장"
        name = left.trim();
        menu = right.trim();
      }
    } else {
      // "카페 여수에서" 처럼 구분이 앞에 붙어 있는 경우
      const head = text.split(/\s+/)[0];

      if (prefixLabels.includes(head) && text.trim() !== head) {
        category = guessCategory(head);
        name = text.slice(head.length).trim();
      }
    }

    if (!name) {
      continue;
    }

    const order = (orderByDay.get(dayNumber) ?? 0) + 10;
    orderByDay.set(dayNumber, order);

    const stop: ParsedShootStop = {
      category: category ?? guessCategory(text) ?? "meal",
      dayNumber,
      googleUrl: null,
      menu,
      name,
      naverUrl: null,
      sortOrder: order
    };

    for (const url of urls) {
      if (isNaverUrl(url)) stop.naverUrl = stop.naverUrl ?? url;
      else if (isGoogleUrl(url)) stop.googleUrl = stop.googleUrl ?? url;
      else stop.naverUrl = stop.naverUrl ?? url;
    }

    stops.push(stop);
  }

  return stops;
}
