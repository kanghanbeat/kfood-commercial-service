// K푸드 인사이트 집계기 (재현 가능).
//
// 입력: 내부대시보드/data/raw/<week>/{tiktok,instagram,reddit,twitter}.json
//   각 파일 = 정규화된 게시물 배열. 필드(있는 것만): text, hashtags[], likes, plays,
//   comments, retweets, redditScore, replies, country, lang, date, url, subreddit, title
//   (원본 수집은 세션에서 정밀 쿼리로 받아 이 형식으로 저장 — README 참고)
//
// 출력: 내부대시보드/data/insights.json (최신) + history/<week>.json + history-index.json 갱신
//   트렌드 점수·순위변동·핫푸드·외국인 궁금증·플랫폼 해시태그를 "공식"으로 계산한다.
//
// 실행: node scripts/insights/aggregate.mjs 2026-W32 --label "2026년 8월 1주차 (W32)" \
//         --range "2026-08-03 ~ 2026-08-09" --credits-used 50 --credits-remaining 4700

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
// 기본은 내부대시보드/data. 테스트 시 DASHBOARD_DATA로 임시 경로 지정 가능.
const dataDir = process.env.DASHBOARD_DATA
  ? resolve(process.env.DASHBOARD_DATA)
  : resolve(repoRoot, "../내부대시보드/data");

// --- args ---
const args = process.argv.slice(2);
const week = args[0];
if (!week || !/^\d{4}-W\d{2}$/.test(week)) {
  console.error("사용법: node scripts/insights/aggregate.mjs <YYYY-Www> [--label ..] [--range ..] [--credits-used N] [--credits-remaining N]");
  process.exit(1);
}
function arg(name, def) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const weekNum = week.split("W")[1];
const label = arg("label", `${week.slice(0, 4)} ${week.replace("-", " ")}`);
const range = arg("range", "");
const creditsUsed = Number(arg("credits-used", "50"));
const creditsRemaining = Number(arg("credits-remaining", "0"));

const { dishes, scoring, genericHashtags } = JSON.parse(
  readFileSync(resolve(__dirname, "watchlist.json"), "utf8")
);
const generic = new Set(genericHashtags);

// --- load raw ---
const rawDir = resolve(dataDir, "raw", week);
if (!existsSync(rawDir)) {
  console.error(`❌ 원본 폴더 없음: ${rawDir}\n   세션에서 정밀 쿼리로 수집해 정규화 JSON을 넣으세요(README).`);
  process.exit(1);
}
const platformFiles = readdirSync(rawDir).filter((f) => f.endsWith(".json"));
const raw = {}; // platform -> posts[]
for (const f of platformFiles) {
  const platform = f.replace(/\.json$/, "");
  raw[platform] = JSON.parse(readFileSync(resolve(rawDir, f), "utf8"));
}
const platforms = Object.keys(raw);
if (platforms.length === 0) {
  console.error("❌ 원본 파일이 없습니다.");
  process.exit(1);
}

// --- helpers ---
const platformLabel = { tiktok: "TikTok", instagram: "Instagram", reddit: "Reddit", twitter: "Twitter", youtube: "YouTube" };
function eng(p) {
  return (p.likes || 0) * scoring.like + (p.plays || 0) * scoring.play +
    (p.comments || 0) * scoring.comment + (p.retweets || 0) * scoring.retweet +
    (p.redditScore || 0) * scoring.redditScore;
}
function haystack(p) {
  return `${p.text || ""} ${(p.hashtags || []).join(" ")} ${p.title || ""}`.toLowerCase();
}
function matchesDish(p, dish) {
  const hay = haystack(p);
  if (dish.aliases.some((a) => hay.includes(a.toLowerCase()))) return true;
  const tags = (p.hashtags || []).map((t) => t.toLowerCase().replace(/^#/, ""));
  return dish.hashtags.some((h) => tags.includes(h));
}
function clean(text, n = 90) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, n);
}

// --- per-dish per-platform engagement ---
const stat = new Map(); // dishKo -> { en, platEng:{p:sum}, platCount:{p:n}, best:{p:post} }
for (const dish of dishes) stat.set(dish.ko, { en: dish.en, platEng: {}, platCount: {}, best: {} });
const platTotal = {}; // platform -> total matched engagement (정규화 분모)
for (const platform of platforms) {
  platTotal[platform] = 0;
  for (const p of raw[platform]) {
    const e = eng(p);
    for (const dish of dishes) {
      if (!matchesDish(p, dish)) continue;
      const s = stat.get(dish.ko);
      s.platEng[platform] = (s.platEng[platform] || 0) + e;
      s.platCount[platform] = (s.platCount[platform] || 0) + 1;
      platTotal[platform] += e;
      if (!s.best[platform] || e > eng(s.best[platform])) s.best[platform] = p;
    }
  }
}

// --- score: 플랫폼별 점유율 합산, 2개 플랫폼 이상만 정식 트렌드 ---
const scored = [];
for (const dish of dishes) {
  const s = stat.get(dish.ko);
  const platsUsed = Object.keys(s.platEng);
  if (platsUsed.length === 0) continue;
  let share = 0;
  for (const p of platsUsed) share += platTotal[p] ? s.platEng[p] / platTotal[p] : 0;
  scored.push({
    ko: dish.ko, en: dish.en, share,
    platforms: platsUsed.map((p) => platformLabel[p] || p),
    platCount: platsUsed.length,
    posts: Object.values(s.platCount).reduce((a, b) => a + b, 0),
    best: s.best
  });
}
// 정식 트렌드: minPlatforms 이상. 부족하면 전체로 폴백.
let trending = scored.filter((d) => d.platCount >= scoring.minPlatforms);
if (trending.length < 5) trending = scored.slice();
trending.sort((a, b) => b.share - a.share);
trending = trending.slice(0, 10);
const topShare = trending[0]?.share || 1;

// --- 이전 주 순위(변동 계산) ---
const base = JSON.parse(readFileSync(resolve(dataDir, "insights.json"), "utf8"));
const prevRank = {};
for (const f of base.trending_foods ?? []) prevRank[f.name_ko] = f.rank;

const trending_foods = trending.map((d, i) => {
  const rank = i + 1;
  const pr = prevRank[d.ko];
  let change;
  if (pr == null) change = "NEW";
  else if (pr === rank) change = "0";
  else change = (pr - rank > 0 ? "+" : "") + String(pr - rank);
  return { rank, name: d.en, name_ko: d.ko, score: Math.round((d.share / topShare) * 100), change, platforms: d.platforms };
});

// --- 핫푸드: 상위 5개, 대표 게시물 근거 ---
const hot_foods = trending.slice(0, 5).map((d) => {
  let best = null;
  for (const p of Object.values(d.best)) if (!best || eng(p) > eng(best)) best = p;
  return {
    food: d.ko, food_en: d.en, platforms: d.platforms,
    highlight: best ? clean(best.text || best.title) : "이번 주 다수 플랫폼에서 언급",
    highlight_url: best?.url || "",
    insight: `${d.platCount}개 플랫폼 언급 · 관측 게시물 ${d.posts}건`
  };
});

// --- 외국인 궁금증: 레딧 질문형, 참여순 ---
const questions = [];
for (const p of raw.reddit || []) {
  const t = p.title || p.text || "";
  const isQ = /\?/.test(t) || /^(how|what|where|which|why|is|can|should|do|does|any|looking for)/i.test(t.trim());
  if (!isQ) continue;
  let dishKo = "";
  for (const dish of dishes) if (matchesDish(p, dish)) { dishKo = dish.ko; break; }
  questions.push({
    q: clean(t, 120),
    source: p.subreddit ? `r/${p.subreddit}` : "Reddit",
    source_url: p.url || "https://www.reddit.com/r/KoreanFood/",
    replies: p.replies || p.comments || 0,
    opportunity: dishKo ? `${dishKo} 관련 입문·활용 콘텐츠` : "한식 입문 가이드 콘텐츠"
  });
}
questions.sort((a, b) => b.replies - a.replies);
const foreigner_questions = questions.slice(0, 6);

// --- 플랫폼 해시태그: 빈도 상위(제네릭 제외) ---
function topHashtags(platform, n = 5) {
  const freq = {};
  for (const p of raw[platform] || []) {
    for (const raw0 of p.hashtags || []) {
      const tag = raw0.toLowerCase().replace(/^#/, "");
      if (!tag || generic.has(tag)) continue;
      freq[tag] = (freq[tag] || 0) + 1;
    }
  }
  const urlBase = { tiktok: "https://www.tiktok.com/tag/", instagram: "https://www.instagram.com/explore/tags/", twitter: "https://twitter.com/hashtag/" }[platform];
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([tag, c]) => ({ tag: `#${tag}`, count: String(c), url: urlBase ? urlBase + tag : "" }));
}

// --- 국가별(가능하면 실데이터, 없으면 이전 유지) ---
const countryFreq = {};
for (const platform of platforms) for (const p of raw[platform]) {
  if (p.country) countryFreq[p.country] = (countryFreq[p.country] || 0) + 1;
}
const flag = { US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", AU: "🇦🇺", PH: "🇵🇭", ID: "🇮🇩", IN: "🇮🇳", BR: "🇧🇷", MX: "🇲🇽", FR: "🇫🇷", DE: "🇩🇪", JP: "🇯🇵", TH: "🇹🇭", VN: "🇻🇳", MY: "🇲🇾" };
const topCountries = Object.entries(countryFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);
if (topCountries.length >= 3) {
  base.realtime_report.geography = topCountries.map(([cc, n]) => ({
    country: cc, cities: [], content_trend: `이번 주 관측 ${n}건`, icon: flag[cc] || "🌍"
  }));
}

// --- 갱신: 동적 필드만 교체 ---
base.trending_foods = trending_foods;
base.realtime_report.date = new Date().toISOString().slice(0, 10);
base.realtime_report.subtitle = `${label} · ${platforms.map((p) => platformLabel[p] || p).join("·")} 수집`;
base.realtime_report.hot_foods = hot_foods;
base.realtime_report.foreigner_questions = foreigner_questions;

for (const platform of platforms) {
  if (!base.platforms[platform]) continue;
  base.platforms[platform].posts_analyzed = raw[platform].length;
  const th = topHashtags(platform);
  if (th.length) base.platforms[platform].top_hashtags = th;
}

// 주간 리뷰 자동 생성
const rising = trending_foods.filter((f) => f.change === "NEW" || (f.change[0] === "+")).slice(0, 3)
  .map((f) => ({ name: f.name, name_ko: f.name_ko, rank: f.rank, prev_rank: prevRank[f.name_ko] ?? null, score: f.score, change: f.change, reason: "이번 주 참여도 상승" }));
const falling = trending_foods.filter((f) => f.change[0] === "-").slice(0, 3)
  .map((f) => ({ name: f.name, name_ko: f.name_ko, rank: f.rank, prev_rank: prevRank[f.name_ko] ?? null, score: f.score, change: f.change, reason: "이번 주 참여도 하락" }));
const top3 = trending_foods.slice(0, 3).map((f) => f.name_ko).join(" · ");
base.weekly_review = {
  compared_label: base.meta.week || "이전 관측",
  headline: `${trending_foods[0]?.name_ko || ""} 강세 — ${top3}`,
  summary: `이번 ${week} 수집 기준, ${platforms.length}개 플랫폼(${platforms.map((p) => platformLabel[p] || p).join("·")}) 참여도 점유율로 계산한 상위 트렌드는 ${top3}. 레딧 r/KoreanFood 중심으로 입문자의 실전 질문이 많아 초보 가이드 콘텐츠 기회가 크다.`,
  rising, falling
};

const totalPosts = platforms.reduce((a, p) => a + raw[p].length, 0);
base.meta.updated = new Date().toISOString().slice(0, 10);
base.meta.week = `${week.slice(0, 4)} W${weekNum}`;
base.meta.total_posts_analyzed = totalPosts;
base.meta.credits_used = creditsUsed;
if (creditsRemaining) base.meta.credits_remaining = creditsRemaining;
base.meta.collection_method = `Xpoz MCP (${platforms.map((p) => platformLabel[p] || p).join(" · ")})`;
base.meta.collection_date = new Date().toISOString().slice(0, 10);
base.meta.analyst = "K-Food Dashboard (Claude 집계)";

// --- write ---
writeFileSync(resolve(dataDir, "insights.json"), JSON.stringify(base, null, 2) + "\n");
writeFileSync(resolve(dataDir, `history/${week}.json`), JSON.stringify(base, null, 2) + "\n");
const idxPath = resolve(dataDir, "history-index.json");
const idx = JSON.parse(readFileSync(idxPath, "utf8"));
const month = `${week.slice(0, 4)}-${label.match(/(\d+)월/) ? String(label.match(/(\d+)월/)[1]).padStart(2, "0") : "01"}`;
const entry = { key: week, label, date_range: range, month, file: `data/history/${week}.json`, top_food: trending_foods[0]?.name_ko || "", total_posts: totalPosts };
idx.weeks = idx.weeks.filter((w) => w.key !== week);
idx.weeks.unshift(entry);
if (!idx.months.some((m) => m.key === month)) idx.months.unshift({ key: month, label: label.replace(/\s*\d+주차.*/, "").trim() || month, weeks: [week] });
else { const m = idx.months.find((m) => m.key === month); if (!m.weeks.includes(week)) m.weeks.unshift(week); }
writeFileSync(idxPath, JSON.stringify(idx, null, 2) + "\n");

console.log(`✓ ${week} 집계 완료 (게시물 ${totalPosts}건, 플랫폼 ${platforms.join("·")})`);
console.log("  트렌드:", trending_foods.map((f) => `${f.rank}.${f.name_ko}(${f.score})`).join("  "));
console.log(`  궁금증 ${foreigner_questions.length}건 · 핫푸드 ${hot_foods.length}건`);
console.log("  다음: node scripts/sync-dashboard.mjs → 커밋·푸시");
