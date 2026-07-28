// K푸드 인사이트/콘텐츠 대시보드 데이터.
// 출처: 웹사이트/data/{insights,content}.json (솔의 기존 K푸드 대시보드 스냅샷).
// 현재는 정적 JSON(주 1회 갱신). 추후 Supabase 연동 시 이 모듈만 교체.
import contentJson from "./content.json";
import historyJson from "./history.json";
import historyIndexJson from "./history-index.json";
import insightsJson from "./insights.json";

export type TrendingFood = {
  rank: number;
  name: string;
  name_ko: string;
  score: number;
  change: string;
  platforms: string[];
};

export type PlatformInfo = {
  name: string;
  icon: string;
  color: string;
  posts_analyzed: number;
  source_tool: string;
  source_url: string;
  top_hashtags: { tag: string; count: string; url: string }[];
};

export type HotFood = {
  food: string;
  food_en: string;
  platforms: string[];
  highlight: string;
  highlight_url: string;
  insight: string;
};

export type GeographyEntry = {
  country: string;
  cities: string[];
  content_trend: string;
  icon: string;
};

export type ForeignerQuestion = {
  q: string;
  source: string;
  source_url: string;
  replies: number;
  opportunity: string;
};

export type RegionalSentiment = {
  region: string;
  positive: number;
  neutral: number;
  negative: number;
  top_food: string;
};

export type WeeklyMover = {
  name: string;
  name_ko: string;
  rank: number;
  prev_rank: number;
  score: number;
  change: string;
  reason: string;
};

export type InsightsData = {
  meta: {
    updated: string;
    week: string;
    total_posts_analyzed: number;
    credits_used: number;
    credits_remaining: number;
    collection_method: string;
    collection_date: string;
    analyst: string;
  };
  trending_foods: TrendingFood[];
  platforms: Record<string, PlatformInfo>;
  realtime_report: {
    title: string;
    subtitle: string;
    date: string;
    hot_foods: HotFood[];
    geography: GeographyEntry[];
    foreigner_questions: ForeignerQuestion[];
  };
  regional_sentiment: RegionalSentiment[];
  weekly_review: {
    compared_label: string;
    headline: string;
    summary: string;
    rising: WeeklyMover[];
    falling: WeeklyMover[];
  };
};

export type ContentTopic = {
  id: number;
  title: string;
  title_ko: string;
  source_insight: string;
  source_platform: string;
  category: string;
  priority: string;
};

export type ContentData = {
  meta: { week: string; updated: string };
  stats: { total: number; done: number; in_progress: number; todo: number };
  topics: ContentTopic[];
  calendar: {
    date: string;
    day: string;
    items: { topic_id: number; channel: string; label: string }[];
  }[];
};

export const insightsData = insightsJson as unknown as InsightsData;
export const contentData = contentJson as unknown as ContentData;

// 주차 히스토리 — 내부대시보드에서 옮겨온 지난 주차 스냅샷.
export type WeekIndexEntry = {
  key: string;
  label: string;
  date_range: string;
  month: string;
  file: string;
  top_food: string;
  total_posts: number;
};

export type HistoryIndex = {
  weeks: WeekIndexEntry[];
  months: { key: string; label: string; weeks: string[] }[];
};

const historyData = historyJson as unknown as Record<string, InsightsData>;
export const historyIndex = historyIndexJson as unknown as HistoryIndex;

// 최신순 주차 목록(선택 UI용). history-index가 비면 현재 데이터 한 주만.
export const dashboardWeeks: WeekIndexEntry[] =
  historyIndex.weeks.length > 0
    ? historyIndex.weeks
    : [
        {
          key: insightsData.meta.week.replace(" ", "-"),
          label: insightsData.meta.week,
          date_range: insightsData.meta.collection_date,
          month: "",
          file: "",
          top_food: insightsData.trending_foods[0]?.name_ko ?? "",
          total_posts: insightsData.meta.total_posts_analyzed
        }
      ];

/** 주차 키로 해당 주 인사이트를 반환. 없으면 현재(최신) 데이터. */
export function getInsightsForWeek(weekKey?: string): InsightsData {
  if (weekKey && historyData[weekKey]) {
    return historyData[weekKey];
  }
  return insightsData;
}
