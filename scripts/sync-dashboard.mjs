// 내부대시보드(로컬 도구)의 인사이트 데이터를 어드민 웹앱으로 옮겨오는 동기화 스크립트.
//
// 어드민 인사이트 화면은 web/lib/dashboard/*.json 을 읽는다. 내부대시보드를 주 1회 갱신한 뒤
// 이 스크립트를 돌리면 최신 주차 + 지난 주차 히스토리가 어드민에 반영된다.
//
// 실행: node scripts/sync-dashboard.mjs
//   (내부대시보드 위치가 다르면) DASHBOARD_SRC=/경로/내부대시보드/data node scripts/sync-dashboard.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// 내부대시보드/data 위치. 기본은 저장소 바로 바깥의 "내부대시보드/data".
const srcDir =
  process.env.DASHBOARD_SRC ?? resolve(repoRoot, "../내부대시보드/data");
const destDir = resolve(repoRoot, "web/lib/dashboard");

if (!existsSync(srcDir)) {
  console.error(`❌ 내부대시보드 데이터 폴더를 찾을 수 없습니다: ${srcDir}`);
  console.error("   DASHBOARD_SRC 환경변수로 경로를 직접 지정하세요.");
  process.exit(1);
}

function copyJson(name) {
  const from = join(srcDir, name);
  if (!existsSync(from)) {
    console.warn(`⚠️  건너뜀(없음): ${name}`);
    return;
  }
  const text = readFileSync(from, "utf8");
  JSON.parse(text); // 유효성 확인 — 깨진 JSON을 복사하지 않도록
  writeFileSync(join(destDir, name), text);
  console.log(`✓ ${name}`);
}

// 1) 현재 주차 + 콘텐츠 + 주차 목록
copyJson("insights.json");
copyJson("content.json");
copyJson("history-index.json");

// 2) 지난 주차들을 하나의 history.json 으로 묶는다 (파일명이 매주 바뀌어도 정적 import 하나로 읽게).
const historyDir = join(srcDir, "history");
const history = {};
if (existsSync(historyDir)) {
  for (const file of readdirSync(historyDir)) {
    if (!file.endsWith(".json")) continue;
    const key = basename(file, ".json"); // "2026-W26"
    history[key] = JSON.parse(readFileSync(join(historyDir, file), "utf8"));
  }
}
writeFileSync(
  join(destDir, "history.json"),
  `${JSON.stringify(history, null, 2)}\n`
);
console.log(`✓ history.json (${Object.keys(history).length}개 주차)`);

console.log("\n완료. 변경분을 커밋·푸시하면 어드민에 반영됩니다.");
