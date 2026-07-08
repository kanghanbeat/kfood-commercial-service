# 세션 히스토리 — 솔 ↔ 한빛 공용 인수인계

> 솔(Claude Code)과 한빛(Codex) 둘 다 쓰는 **공용** 히스토리 문서. 어느 쪽이 다음 작업을 이어받든 여기부터 읽는다.
> 이 파일은 저장소 안(`docs/06-team/session-handoff.md`)에 있어 PR로 공유된다 — 개인 로컬 메모가 아니다.
> 맨 아래 "세션 마무리 체크리스트"는 매 작업 세션 끝에 반드시 실행한다.

---

## 지금 상태 한 줄 요약 (2026-07-07)

**Supabase 키 연결 + 실데이터 읽기/쓰기 검증 완료. PR #1 merge conflict 해결 완료. 검색 실구현 + 카드 플레이스홀더 + 음식상세 히어로 완료(커밋 `af4e75f`). 목록 4페이지 CardPhoto + 지역·장소·루트 상세 히어로 + 모바일 nav 복구 완료(2026-07-07 세션2). Supabase 팀 초대 완료 확인(2026-07-07).** 남은 건 ① 실콘텐츠 채우기 ② 나머지 어드민↔공개 흐름 세부 검증 ③ 한빛 리뷰·승인.

### 새벽 무인 세션: 촬영 콘텐츠 연결 + 전체 코드 분석 (2026-07-08 세션4)

솔 취침 중 승인 불필요 작업만 진행:

1. **촬영 콘텐츠(productions) 공개 노출 구현 (2-3 웹 측 완료)** — `packages/data`에 `getPublishedProductionsFor(entityType, slug)` 추가, 음식·지역 상세 페이지에 "From our channels" 섹션 추가. **마이그레이션 008이 아직 DB에 미적용이라(한빛 리뷰 대기) 지금은 섹션이 조용히 숨겨지고, 008 적용 즉시 자동으로 살아난다**(테이블 없음 오류는 빈 배열 처리). 콘텐츠 없을 때 섹션 미노출 확인 완료.
2. **장소 보강 SQL 준비 (적용은 대기)** — 신규 음식 13종을 장소와 연결하는 `supabase/sql/seed-places-for-new-foods.sql` 작성(신규 area-level 장소 4곳: 홍대 닭갈비·인사동 비빔밥·동대문 감자탕·강남 디저트 + 우래옥=불고기, 광장시장=육회·순대·김밥·파전 등 place_foods 13건). **Supabase 대시보드 세션이 만료돼 적용 못 함** — 로그인 후 SQL Editor에서 이 파일 실행하면 됨(재실행 안전).
3. **전체 코드 분석 보고서** — `docs/04-quality/code-analysis-2026-07-08.md` 저장(서브에이전트 분석 + 솔 검증 노트). 핵심: `as unknown as` 캐스팅 10+곳, 단일 조회가 전체 리스트를 페치하는 getPublished* 패턴, fallback이 오류를 삼키는 문제, packages/data 3,200줄 단일 파일. 우선순위 A/B/C로 분류돼 있음. **한빛과 방향 합의 후 리팩터링 권장.**
4. **A3 즉시 적용: 데이터 오류 로깅** — `logDataError()` 추가, getPublished 4종 + 관계 조회 실패 + productions 조회에 적용. fallback으로 넘어가도 서버 로그에 원인이 남는다.

### 대시보드 로그인 후 마무리 (2026-07-08, 같은 날 낮)

로그인 후 사용자 승인 받아 순서대로 실행, 전부 완료:

1. **마이그레이션 008~011 적용 완료** — productions·production_tags·user_food_log·platform_settings 4개 테이블 전부 프로덕션 DB에 생성 확인(REST로 검증). 이제 "From our channels" 섹션이 실제로 콘텐츠를 보여줄 수 있는 상태.
2. **장소 시드 적용 완료** — 장소 30→34, place_foods 33→46건. 신규 음식 13종의 "Where to try it"이 이제 채워짐.
3. **2-2 발행상태별 노출 검증 완료** — japchae로 hidden→draft→archived→published 전 구간 테스트: 각 비공개 상태에서 공개 REST(`/rest/v1/foods?slug=eq.japchae`)가 빈 배열, 목록 페이지(49건)·상세 페이지(404) 둘 다 정상 제외 확인. published로 원복 후 REST 50건·상세 페이지 정상 노출까지 재확인. RLS + 코드 필터 이중 방어 실동작 검증 끝.

**한빛 리뷰 대기 항목 없음** — 개발 주도권이 솔로 넘어와서 위 마이그레이션·시드는 리뷰 없이 바로 적용함(위 "개발 주도권 변경" 참고).

### 음식 50종 달성 + 홈 개선 + 태그 라벨 변환 (2026-07-07 세션3)

1. **음식 콘텐츠 50종 달성** — 기존 30종에 대표 K푸드 20종 추가(비빔밥·불고기·김치찌개·삼겹살·김밥·잡채·해물파전·닭갈비·찜닭·감자탕·어묵·계란빵·순대·라면·빙수·떡갈비·육회 등). 시드 SQL은 `supabase/sql/seed-foods-31-50.sql`에 저장했고 Supabase SQL Editor로 적용 완료(`on conflict do nothing`이라 재실행 안전). region_foods 27건 연결 추가(총 69건). `/foods`에서 50종 카드 노출 실확인.
2. **태그 raw 값 표시 라벨 변환** — `packages/data`에 `humanizeTag()` 추가, mapRegion(eyebrow·bestForTags)과 mapPlace(trust/caution tags)에 적용. `capital_region`→"Capital region", `bbq`→"BBQ", `budae_jjigae`→"Budae-jjigae" 등. 특수 케이스는 `TAG_LABEL_OVERRIDES`에서 관리.
3. **홈페이지 가독성·기능 개선** — ① 히어로 아래 인기 검색 칩 5개(전부 실검색 연결, mild 11건·market 25건 확인) ② 콘텐츠 현황 스트립(50 dishes·23 regions·5 routes, 실 DB 카운트 동적 표시) ③ "What kind of eater are you?" 취향별 시작점 카드 3종(→ /search 연결) ④ 음식 카드에 매운맛 칩, 지역 카드에 intro·타겟 칩, 루트 카드에 요약 추가 ⑤ 트렌딩 음식 3→6개 ⑥ 하단 보라색 CTA 밴드(Browse all dishes / See food routes) ⑦ 홈 카드 설명 3줄 클램프로 높이 통일. 모바일(375px)에서 스탯 2열·intent 1열·가로 넘침 없음 확인.

검증: `tsc`·`eslint`·`next build` 통과 + 데스크톱/모바일 스크린샷 실확인.

### Supabase 팀 초대 완료 확인 (2026-07-07)

한빛이 `shinheesol@gmail.com`을 Supabase 팀에 초대 완료. 솔 계정으로 브라우저에서 `kfood-commercial-staging` 프로젝트 대시보드(`gpwxiakwlghjzvoxwpnw`) 접속 확인 — 이전엔 "You do not have access to this project"였는데, 이제 프로젝트 상태(Healthy)·DB 리소스·API 로그 전부 정상 노출됨. 이제 솔이 대시보드에서 직접 마이그레이션 적용·로그 확인·테이블 조회 가능.

| 영역 | 상태 |
|---|---|
| 공개 웹 (홈·음식·지역·장소·루트·상세) | ✅ v2 디자인 완성 + **실데이터 연결 확인**(지역 23개 등 실 DB 노출) / ⚠️ 콘텐츠 양은 아직 부족 |
| 마이페이지 (프로필·도감·인포그래픽·공유) | ✅ 화면·기능 완성 / ✅ Supabase 연결됨 — 실사용자 로그인 후 전체 흐름 재검증 필요 |
| 어드민 인사이트·콘텐츠 제작 | ✅ 실데이터 연결됨 (솔 대시보드 JSON) |
| 어드민 콘텐츠 관리 (지역·음식·장소·루트·촬영) | ✅ 추가/편집 폼 완성 + **실제 저장 확인**(2026-07-07, editor 계정으로 region.update 저장→감사로그 기록→검증까지 완료) |
| 어드민 운영 (신고·감사·회원·게시물·댓글·설정) | ✅ 화면 6탭 완성 + 감사 로그 실동작 확인 / ⚠️ 신고·회원은 아직 데이터 없음 |
| 커뮤니티 (피드·게시물·댓글, 한빛 제작) | ✅ 병합 완료 + 어드민 4메뉴 편입 + 공개 on/off 토글 추가 |
| 인증(로그인/세션) | ✅ 로그아웃 튕김 + 로그인 두 번 눌러야 열림 버그 수정(2026-07-07, 커밋 `2bf2c68`) |
| 검색 | ✅ 실구현 완료(2026-07-07, 커밋 `af4e75f`) — 음식·지역·장소·루트 이름·설명·태그 매칭, 홈 히어로 검색창도 실동작 / ⬜ 커뮤니티 게시물·유저 검색은 스키마 준비 후 |
| 다국어(i18n) | ⬜ 미착수 — 시점·범위는 아래 "향후 결정 사항" 참고 |

### 인증 버그 수정 상세 (2026-07-07)

한빛이 홈에서 페이지 이동 시 로그아웃/로그인 화면으로 튕긴다고 제보 → 두 개의 별도 버그로 확인·수정:

1. **로그아웃 튕김** (`web/proxy.ts`) — 세션 갱신(refresh) 요청이 일시적으로 실패하면 아직 유효한 토큰까지 지워 로그인 화면으로 보냈다. 한빛이 먼저 JWT 패딩 버그(`801dc5c`)를 고쳤고(이 브랜치에 병합됨), 솔이 추가로 "토큰이 진짜 만료(exp<=now)됐을 때만 세션 삭제"하도록 보강. 일시적 네트워크 문제면 그대로 두고 다음 요청에서 재시도.
2. **로그인 두 번 눌러야 열림** (`web/lib/sign-in-retry.ts` 신규) — 원인은 Supabase(GoTrue)가 유휴 후 첫 인증 요청에서 올바른 비밀번호에도 `invalid_credentials`(400)를 반환하는 것(디버그 로그로 확인). 같은 자격증명 즉시 재시도 시 성공. 공용 헬퍼 `signInWithPasswordResilient()`로 5xx/네트워크 오류는 2회, invalid_credentials는 1회 자동 재시도. 재시도 후에도 실패하면 진짜 틀린 비밀번호로 처리. 어드민(`/admin/login/email`)·공개(`/auth/login/email`) 양쪽 적용. 실제 로그인 한 번에 되는 것 확인함.

> 병합 메모: 한빛이 이 브랜치(`feature/design-tokens-v2`)에 직접 커밋(`801dc5c`)을 올려서 로컬에서 merge 처리함(커밋 `a42d5e0`). ✅ push 완료(2026-07-07).

### PR #1 merge conflict 해결 (2026-07-07)

한빛이 PR #1에서 "코드가 안 올라가고 md파일만 보인다"고 제보 → 확인해보니 코드(60개 파일, +7,356/−1,156)는 전부 올라가 있었고, 실제 원인은 **PR이 `main`과 merge conflict(`web/proxy.ts`) 상태라 GitHub이 diff를 온전히 못 보여준 것**. 한빛이 `main`에 직접 올린 Supabase SSR 기반 인증 재작성(`352694f` 등)과 이 브랜치의 수동 세션 갱신 로직이 같은 파일을 건드려서 충돌 발생.

해결 내용 (커밋 `8f1442a`):
- `web/proxy.ts`: main의 `@supabase/ssr` 기반 공개 세션 동기화 구조를 그대로 쓰고, 그 안에 "진짜 만료된 경우에만 세션 삭제" 로직을 다시 넣음
- `web/components/site-chrome.tsx` + `web/app/layout.tsx`: main이 `HeaderAuthLink`를 async 서버 컴포넌트로 재작성했는데, 이 브랜치의 `SiteHeader`(client component)가 그걸 직접 import하고 있어서 Next.js 빌드 실패 → `RootLayout`(서버)에서 `HeaderAuthLink`를 렌더링해 `SiteHeader`에 prop으로 내려주는 방식으로 수정
- `tsc --noEmit` · `eslint` · `next build` 전부 통과 확인 후 push. PR #1은 이제 `mergeable: MERGEABLE` 상태.

### 디자인·검색 개선 4건 (2026-07-07, 커밋 `af4e75f`)

Supabase 팀 초대 대기 중에 fallback 데이터로 검증 가능한 프론트 작업 진행:

1. **카드 빈 박스 개선** — 실제 음식 사진이 저작권 검토 대기라 카드가 전부 빈 회색 박스였음. `web/components/card-photo.tsx` 신규: 이름 기반 그라데이션(같은 이름=항상 같은 색) + 첫 글자 모노그램 + 카테고리 태그(DISH/REGION/ROUTE). 홈·검색결과·음식상세에 공통 적용. **실제 사진 확정되면 이 컴포넌트만 `<img>`로 교체하면 됨.**
2. **검색 실구현** — `/search`가 preview 문구 → 실제 `<form>`+GET(`?q=`)으로 동작. 음식·지역·장소·루트의 이름·설명·태그 대소문자 무시 매칭, 결과는 카테고리별 카드 그리드. 브라우저에서 "spicy" 8건·"Myeongdong" 7건 실확인.
3. **홈 히어로 검색창** — 가짜 `<div>` → 실제 폼으로 교체, 제출 시 `/search?q=`로 이동 실확인.
4. **음식 상세** — 상단에 이름 기반 그라데이션 히어로 배너 추가, "Where it fits" 지역 카드에 CardPhoto 썸네일 추가.

검증: `tsc --noEmit`·`eslint`·`next build` 통과, 모바일(375px) 1열 반응형 확인. `.claude/launch.json`(로컬 dev 서버 설정)도 이 커밋에 포함.

### 목록 카드·상세 히어로·모바일 nav 복구 (2026-07-07 세션2)

이전 세션의 카드/히어로 작업을 나머지 페이지로 확장:

1. **목록 페이지 4개에 CardPhoto 적용** — `/foods` `/regions` `/routes` `/places` 카드에 그라데이션 플레이스홀더 추가. `card-photo.tsx`에 `place` variant(태그 "PLACE") 신설 — 기존엔 place가 없어서 검색 페이지가 place 카드에 `variant="region"`을 임시로 쓰고 있었는데 이것도 `place`로 정리.
2. **지역·장소·루트 상세에 히어로 배너** — 음식 상세의 `resolveCardPhoto`+`food-hero-photo` 패턴 그대로 재사용(CSS는 페이지 레이아웃과 독립적이라 추가 스타일 불필요). 목록 카드와 같은 이름 해시라 카드→상세 진입 시 색이 그대로 이어짐(예: Myeongdong 카드도 상세도 같은 teal).
3. **모바일 반응형 전체 점검(375px)** — 홈·목록 4개·상세 3종·검색·피드 전부 가로 넘침(scrollWidth>innerWidth) 없음 확인. **발견한 실제 버그: 900px 이하에서 `.nav-v2-menu`가 `display:none`인데 햄버거 대체가 없어 모바일에서 페이지 이동 수단이 완전히 사라졌음** → 메뉴를 숨기지 않고 로고·로그인 아래 줄로 내려 가로 스크롤 메뉴로 유지하도록 `globals.css` 수정. 데스크톱(>900px)은 기존 한 줄 센터 정렬 그대로.

검증: `tsc --noEmit`·`eslint`·`next build` 통과, 브라우저에서 목록 4개·상세 3종 카드/히어로 렌더 + 모바일 nav 두 줄 표시 + 1280px 데스크톱 nav 원형 유지 실확인.

부수 발견(수정 안 함, 언급만): 지역 카드/상세의 eyebrow·태그가 `capital_region`, `street_food`, `area_level` 같은 DB raw 값 그대로 노출됨 — 실콘텐츠 채울 때 표시용 라벨로 변환 필요.

### Supabase 대시보드 접근 확인 (2026-07-07)

솔 계정으로 한빛 프로젝트(`gpwxiakwlghjzvoxwpnw`) 대시보드 접속 시 "You do not have access to this project" — 로그인 문제가 아니라 **팀 멤버가 아니라서 생기는 접근 거부**로 확인(솔 계정은 별개 조직 `dropthesori` 소유). 해결: 한빛이 Supabase 대시보드 → Organization Settings → Team에서 `shinheesol@gmail.com` 초대.

---

## ⚡ 개발 주도권 변경 (2026-07-08 확정)

**솔이 주도 개발하는 방식으로 전환.** 한빛 리뷰·적용 요청을 기다리지 않고 솔이 직접 진행한다(마이그레이션 적용 포함). 한빛과의 협업 방식은 추후 협업 문서를 다시 작성할 때 재정의한다. 아래 "협업 규칙"과 "한빛이 반드시 확인·실행해야 하는 것" 섹션은 그때까지 참고용으로만 유지.

**후순위로 미룬 것**: 푸드도감 50종 관련 작업(마이페이지 도감 콘텐츠·기능 확장) — 당장 중요하지 않음, 솔 지시(2026-07-08). 우선순위 재조정 시 다시 꺼낸다.

---

## 협업 규칙 (매번 지킬 것 — 솔·한빛·어떤 AI 세션이든 동일 적용)

이번 PR #1 충돌은 두 사람이 같은 인증 관련 파일(`proxy.ts`, `auth/*`)을 몇 주간 각자 브랜치에서 따로 고치다가 한 번에 합치면서 생겼다. 재발 방지용 규칙:

1. **작업 중 브랜치(`feature/design-tokens-v2`)를 자주 `main`과 합칠 것** — 며칠 이상 묵히지 말고, main에 새 커밋이 쌓이면 그때그때 받아서 합쳐둔다. 그래야 충돌이 나도 그날 분량만큼만 작아서 바로 풀 수 있다.
2. **로그인/세션 관련 파일을 고칠 땐 미리 알릴 것** — `web/proxy.ts`, `web/lib/public-auth.ts`, `web/lib/admin-auth.ts`, `web/app/auth/**`, `web/app/admin/login/**` 은 두 사람이 겹쳐서 고치는 구간이므로, 이 파일들을 건드릴 땐 세션 시작할 때 한 마디 남긴다.
3. **merge 후에는 반드시 `tsc --noEmit` + `eslint` + `next build` 세 개를 통과시키고 push** — 텍스트 충돌이 안 나도(예: 파일 하나가 다른 파일에서 완전히 다른 형태로 재작성된 경우) 빌드가 깨질 수 있으므로, merge commit이라고 검증을 생략하지 않는다.

---

## 여기까지 온 과정

1. **PM → Plan → Design** (솔이 PRD·Plan·디자인 시스템 v2 확정, Pencil로 화면 시안 7개 제작)
2. **한빛 저장소(`kanghanbeat/kfood-commercial-service`, Next.js+Supabase)를 베이스로 clone** — 이미 공개 웹 골격 + 어드민 6개 라우트 + Supabase 스키마(11개 테이블+RLS)가 있었음
3. **브랜치 `feature/design-tokens-v2`에서 솔이 디자인 v2 + 신규 기능을 계속 얹는 구조** — 코드는 전부 이 브랜치에 커밋, 아직 push 안 함
4. **2026-06-30 한빛 origin/main 병합** (커밋 `f1a26f8`) — 한빛이 그사이 만든 커뮤니티(피드·게시물·댓글·이메일인증·세션복구)를 병합. 마이그레이션 번호 충돌은 007→008로 해결. 안전장치 태그 `pre-merge-hanbeat`(병합 전 지점, 문제 시 복구용) 남겨둠
5. **2026-07-06 신규 기능 3종(도감·인포그래픽·공유URL) + 어드민 정리(커뮤니티 편입·사이트 설정) 완료**

---

## 핵심 결정 로그

- **BM**: 수익(제휴·예약) 후순위, 채널 성장 1순위. 성장 엔진은 **SEO+커뮤니티(한빛 안) + 인포그래픽·도감(솔 안) 병행** — 택1 아님 (2026-07-06 확정, `docs/기획정렬-한빛대조.md` 참고)
- **타겟**: 한국 방문 외국인. Beachhead = K-pop/K-드라마 팬덤 영어권 20-30대 첫 여행자
- **커뮤니티**: 한빛이 만든 대로 유지 + 어드민에서 카테고리 단위 공개 on/off 토글 추가(위험 시 배포 없이 즉시 내리는 안전장치)
- **productions(솔, 제작콘텐츠) vs user_posts(한빛, UGC)**: 스키마 합치지 않고 독립 유지 (소유자·검수 경로가 다름 — 관리자 작성 vs 고객 작성)
- **디자인 토큰 v2**: brand `#8500FF` · accent `#FF5E00` · 배경 항상 흰색. 폰트 Pretendard(로컬 woff2, CDN 금지)
- **크롤링/데이터 수집**: 솔 전담 (Google Places·카카오·네이버·공공데이터 LOCALDATA·TourAPI)
- **어드민 메뉴 4개**: 인사이트 · 콘텐츠 제작 · 콘텐츠 관리(지역·음식·장소·루트·촬영) · 운영(신고·감사·회원·게시물·댓글·설정)

---

## 한빛이 반드시 확인·실행해야 하는 것

1. **신규 마이그레이션 4개 리뷰 후 Supabase 적용**: `008_productions.sql` · `009_user_food_log.sql` · `010_journey_share.sql` · `011_platform_settings.sql`
2. **어드민 라우트 재구조 승인**: 기존 6개 개별 페이지(regions/foods/places/routes/reports/audit-logs) → 4메뉴로 통합, 옛 라우트는 삭제 안 하고 redirect 처리
3. ~~Supabase 연결 키(URL·anon) 전달~~ — ✅ 완료 (2026-07-07). 읽기·쓰기 둘 다 실계정(`editor` role)으로 검증함
4. **커뮤니티 유지 + on/off 토글 결정 동의 여부**
5. **productions vs user_posts 분리 유지 결정 동의 여부**
6. **진행 방식(PDCA vs Sprint) 통일 여부** — 아직 미정, 논의 필요
7. `web/components/admin-nav.tsx`(옛 커뮤니티 관리 화면 nav) — 이제 완전 미사용, 삭제 여부는 한빛 판단

---

## 남은 일 (우선순위순)

**1. 토대** — ✅ 1-1 Supabase 키 확보 완료(2026-07-07) · ✅ 1-2 실콘텐츠 1차 완료(2026-07-07 세션3: 음식 50종·지역 23개 달성. 장소 30·루트 5는 추가 여지 있음, 사진은 여전히 저작권 검토 대기)

**2. 어드민 ↔ 공개 흐름 검증** — ✅ 2-1 저장→공개 노출 확인 완료(2026-07-07, region.update 실저장 + 감사로그 기록 확인) · ⬜ 2-2 발행상태별(초안/공개/숨김/보관) on/off 노출 검증 · ⬜ 2-3 촬영 콘텐츠 태그 → 음식/지역 상세페이지 노출 연결

**3. 뼈대 채우기** — 3-1 인사이트 나머지 탭 확정 · 3-2 콘텐츠 제작 실운영 흐름 · 3-3 운영 > 회원 관리(한빛 profiles 연결)

**4. 신규 기능** — ✅ 완료 (도감 기록·인포그래픽·공유 URL, 2026-07-06)

**5. 정리·통합** — ✅ 완료 (커뮤니티 어드민 편입·공개 토글·productions/user_posts 관계 정리, 2026-07-06)

**6. 마무리·공유** — ✅ 6-1 Pretendard 폰트 완료 · ⬜ 6-2 이 PR 공유 (진행 중)

**7. 디자인·기능 다듬기 (Supabase 대기 중 진행, 솔 전담)** — ✅ 완료 (7-1 카드 플레이스홀더·검색 실구현·음식상세 히어로 `af4e75f` · 7-2 목록 4페이지 CardPhoto · 7-3 지역·장소·루트 상세 히어로 · 7-4 모바일 전체 점검 + nav 복구, 2026-07-07 세션2)

**향후 결정 사항 (시점만 정해둠)**: 다국어(i18n) 버튼 — 실콘텐츠 채운 후(1번 이후) 착수, 한국어·영어·일본어·중국어 4개 추천. 상세 근거는 이 저장소 밖 `K푸드_플랫폼/docs/기획정렬-한빛대조.md`(솔 로컬 기획 문서) 참고.

---

## 개발 환경 메모

- ⚠️ **`.env.local`이 두 곳에 있음 — 실제로 적용되는 건 `web/.env.local`**. 루트(`kfood-commercial-service/.env.local`)에 넣어도 Next.js는 안 읽는다(앱이 `web/` 워크스페이스에 있어서). 환경변수는 항상 `web/.env.local`에 넣을 것 (2026-07-07 실제로 이 문제로 헤맴)
- `web/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`·`NEXT_PUBLIC_SUPABASE_ANON_KEY`(2026-07-07 연결 완료) + `NEXT_PUBLIC_ALLOW_ALPHA_FALLBACK=true`(Supabase 실패 시 fallback 허용, gitignore됨)
- `ADMIN_PREVIEW=true`를 `web/.env.local`에 추가하면 로그인 없이 로컬에서 `/admin`·`/mypage` 열람 가능(개발용, `NODE_ENV` 가드로 프로덕션 무효). **단, 이건 진짜 로그인이 아니라 가짜 토큰이라 실제 Supabase 쓰기(저장)는 안 됨** — 저장 기능 테스트하려면 실제 admin/editor 계정으로 로그인해야 함. 확인 끝나면 반드시 제거할 것
- `npm install`은 시스템 npm 캐시 권한 문제로 `npm install --cache <임시경로>` 필요할 수 있음

---

## 다음 세션 시작 프롬프트 (복붙용)

```
kfood-commercial-service/docs/06-team/session-handoff.md 를 읽고 이어가줘.
브랜치 feature/design-tokens-v2.

지난 세션에서: 남은 일 7번(디자인 다듬기) 전부 완료 — 목록 4페이지 CardPhoto,
지역·장소·루트 상세 히어로 배너, 모바일 반응형 전체 점검 + 모바일 nav 복구.
전부 GitHub에 push 완료.

2026-07-08 세션4 완료: 마이그레이션 008~011 적용, 장소 시드 적용, 2-2 발행상태 토글 전 구간 검증, 촬영 콘텐츠 공개 노출, 데이터 오류 로깅, 전체 코드 분석 보고서. 개발 주도권 솔로 전환(한빛 리뷰 대기 없음).

이번 세션에서 이어서 할 것 (우선순위 순):
1. 어드민에서 촬영 콘텐츠 첫 건 실제 등록 → 음식/지역 상세 "From our channels" 섹션에 실데이터 노출 확인
2. 코드 분석 보고서(docs/04-quality/code-analysis-2026-07-08.md) A1·A2 착수 — as unknown as 캐스팅 정리, getPublished* 단일조회 쿼리 최적화
3. 어드민 실기능 연결 (남은 일 3: 인사이트·콘텐츠 제작 탭 읽기전용 → 실동작, 회원 관리 placeholder 구현)
4. 촬영 태그 → 장소·루트 상세 노출 (음식·지역은 완료, 2-3 나머지)

작업 전에 현재 상태·남은 일 섹션 순서대로 다시 확인해줘.
```

---

## 세션 마무리 체크리스트 (매번 이 순서로)

작업을 마칠 때마다 아래 5단계를 순서대로 실행한다 — 솔이든 한빛이든, 어떤 AI 세션이든 동일하게 적용.

1. **깃허브 다운로드** — 작업 시작 전 최신 상태 받기 (`git pull` / 다른 사람 변경사항 확인)
2. **변경 내용 확인 및 적용하기** — 받은 변경사항 검토, 로컬에 반영
3. **내용 수정** — 실제 작업 진행
4. **인수인계 파일에 업데이트한 내용 전부 저장** — 이 파일(`session-handoff.md`)에 무엇을·왜·어떻게 검증했는지 기록
5. **다음 사람이 이어받기 위한 프롬프트 작성** — 위 "다음 세션 시작 프롬프트" 갱신
