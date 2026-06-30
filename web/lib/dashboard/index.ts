// K푸드 인사이트/콘텐츠 대시보드 데이터.
// 출처: 웹사이트/data/{insights,content}.json (솔의 기존 K푸드 대시보드 스냅샷).
// 현재는 정적 JSON(주 1회 갱신). 추후 Supabase 연동 시 이 모듈만 교체.
import contentJson from "./content.json";
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
