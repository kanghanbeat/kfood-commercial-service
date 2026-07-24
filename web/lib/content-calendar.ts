import type { AdminContentPlan, AdminProduction } from "@kfood/data";

// 기획 캘린더용 묶기. 기획·제작에 입력한 날짜를 하나로 모아 날짜순으로 정리한다.
// 날짜는 date 컬럼이라 "2026-07-25" 형식의 문자열로 들어온다.

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

/** "2026-07-25" → "7월 25일 (토)" */
export function formatPlanDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdayLabels[date.getDay()]})`;
}

/** ISO 주차. "2026-07-25" → "2026 W30" */
export function formatIsoWeek(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  // ISO 8601: 목요일이 속한 해·주가 그 주의 기준이 된다.
  const target = new Date(date);
  target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return `${target.getUTCFullYear()} W${String(week).padStart(2, "0")}`;
}

export type CalendarEntry = {
  id: string;
  kind: "plan" | "production";
  title: string;
  statusLabel: string;
  detail: string;
};

export type CalendarDay = {
  date: string;
  entries: CalendarEntry[];
};

/**
 * 기획·제작을 날짜별로 묶는다. 날짜가 없는 항목은 빠진다(호출한 쪽에서 따로 센다).
 */
export function buildCalendarDays(
  plans: AdminContentPlan[],
  productions: AdminProduction[],
  planStatusLabels: Record<string, string>,
  productionStatusLabels: Record<string, string>
): CalendarDay[] {
  const byDate = new Map<string, CalendarEntry[]>();

  const push = (date: string, entry: CalendarEntry) => {
    const existing = byDate.get(date);
    if (existing) {
      existing.push(entry);
    } else {
      byDate.set(date, [entry]);
    }
  };

  for (const plan of plans) {
    if (!plan.targetDate) continue;
    push(plan.targetDate, {
      id: `plan-${plan.id}`,
      kind: "plan",
      title: plan.title,
      statusLabel: planStatusLabels[plan.status] ?? plan.status,
      detail: plan.category ?? ""
    });
  }

  for (const production of productions) {
    if (!production.scheduledDate) continue;
    push(production.scheduledDate, {
      id: `production-${production.id}`,
      kind: "production",
      title: production.title,
      statusLabel: productionStatusLabels[production.status] ?? production.status,
      detail: [production.type, production.channel].filter(Boolean).join(" · ")
    });
  }

  return [...byDate.entries()]
    .map(([date, entries]) => ({ date, entries }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
