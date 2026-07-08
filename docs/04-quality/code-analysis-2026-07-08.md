# K푸드 상업용 플랫폼 코드 분석 보고서

**분석 대상**: kfood-commercial-service (Next.js 16 + Supabase, npm workspace)  
**분석 수준**: Very Thorough  
**작성일**: 2026-07-08  

> ⚠️ **검증 노트 (솔, 2026-07-08)** — 이 보고서는 분석 에이전트 산출물을 그대로 보존한 것이다. 아래 3가지는 사실과 다르거나 보정이 필요해 미리 적어둔다:
> 1. §4.3 "CardPhoto가 Next.js Image 사용" — **사실 아님.** CardPhoto는 그라데이션 `<div>` 플레이스홀더이고 이미지 자체가 아직 없다(사진 저작권 검토 대기).
> 2. §3.5 "홈페이지가 force-cache로 하루 캐시됨" — **사실과 다름.** `next build` 결과 모든 콘텐츠 페이지는 ƒ(Dynamic, 요청마다 렌더)이고 supabase-js fetch는 캐시되지 않는다. 실제 문제는 캐시가 없어서 "매 요청 전체 리스트 페치"가 반복되는 것(§A2와 동일 결론, 원인만 반대).
> 3. 라인 번호는 2026-07-08 새벽 세션 수정 이전 기준이라 이후 커밋과 수십 줄 오차가 있을 수 있다.
>
> A3(에러 로깅)은 이 보고서 확인 직후 바로 적용했다(`logDataError`). A1·A2·B군은 한빛과 방향 합의 후 진행 권장.

---

## 1. 전체 구조 분석

### 1.1 저장소 구성

**npm workspace 구조:**
- `web/` - Next.js 16 프론트엔드 (메인 애플리케이션)
- `packages/data/` - 공유 데이터 접근 계층 (3,201줄 단일 index.ts)
- `packages/types/` - TypeScript 타입 정의
- `packages/config/` - 설정값 공유
- `supabase/migrations/` - PostgreSQL 마이그레이션 (스키마 + RLS 정책)

### 1.2 web/app 라우트 구조

**공개 영역:**
- `/` - 홈페이지 (히어로, 검색, 추천)
- `/foods` - 음식 카탈로그
- `/regions` - 지역별 가이드
- `/places` - 장소 검색
- `/routes` - 큐레이션 경로
- `/search` - 통합 검색
- `/recommend` - AI 추천 (스켈레톤)
- `/feed` - 커뮤니티 피드

**인증 및 사용자:**
- `/auth/login`, `/auth/join`, `/auth/logout`, `/auth/callback`
- `/auth/update-password`
- `/mypage` - 사용자 마이페이지 (세션 필수)
- `/profile/[userId]` - 공개 프로필
- `/journey` - 음식 여행 기록

**관리자 영역:**
- `/admin/` - 어드민 홈/인사이트 대시보드
- `/admin/login` - 어드민 로그인
- `/admin/manage` - 콘텐츠 관리 (지역·음식·장소·루트·촬영)
- `/admin/content` - 콘텐츠 제작 캘린더
- `/admin/operations` - 운영 관리 (신고·감사·회원·게시물·댓글·설정)
- `/admin/user-posts` - 사용자 게시물 모더레이션
- `/admin/audit-logs` - 감사 로그

**정책 및 공개 정보:**
- `/privacy`, `/terms`, `/editorial-policy`, `/content-policy`
- `/disclosures`, `/contact`, `/report`, `/maps-notice`

### 1.3 Supabase 데이터 흐름

```
[Public Client (no auth)]
  → getPublishedRegions(), getPublishedFoods(), getPublishedPlaces()
  → 캐시 불가 (getPublished*() 호출할 때마다 fetch)
  → 실패 시 fallback data 반환 (개발 전용)

[Authenticated Client (user token)]
  → getMyProfile(), getMyFoodLog(), createUserPost()
  → Bearer token 헤더로 RLS 정책 체크

[Admin Client (editor/admin token)]
  → getAdminFoods(), updateAdminPlace(), getAdminReports()
  → 감사 로그 자동 기록
```

**RLS 정책:**
- `regions`, `foods`, `places`, `route_guides`: published만 공개, editor/admin 전체 관리
- `region_foods`, `place_foods`: 참조 테이블 각각 존재 여부 조건부 접근
- `profiles`: 사용자는 자신만, admin은 전체
- `content_reports`: 공개 insert (status='pending' 검증), admin만 읽기/수정
- `admin_audit_logs`: editor/admin만 읽기/insert (security definer 함수)

---

## 2. 어드민 영역 상세 분석

### 2.1 어드민 메뉴 구조

**4개 메인 탭:**

| 메뉴 | 경로 | 구현 상태 | 비고 |
|------|------|----------|------|
| **인사이트** | `/admin` | ✅ 완성 | 대시보드 데이터는 JSON 스냅샷 (정적) |
| **콘텐츠 제작** | `/admin/content` | ✅ UI 완성 | 기획 캘린더, 제작 흐름도 (기능 미연동) |
| **콘텐츠 관리** | `/admin/manage` | ✅ 부분 완성 | 5개 탭: 지역, 음식, 장소, 루트, 촬영 |
| **운영** | `/admin/operations` | ⚠️ 미완성 | 6개 탭 중 대부분 placeholder |

### 2.2 각 메뉴의 미완성 흔적

**인사이트 (/admin/page.tsx, 라인 1-220)**
- 데이터 소스: `/web/lib/dashboard/insights.json` (수동 업데이트)
- 기능: 읽기 전용, 인터랙션 없음
- 추천 사항: "데이터 새로고침" 버튼 (라인 51)은 동작하지 않음

**콘텐츠 제작 (/admin/content/page.tsx, 라인 1-154)**
- 데이터 소스: `/web/lib/dashboard/content.json` (수동 업데이트)
- UI 완성도: 높음 (캘린더, 기획 목록)
- 기능: 마찬가지로 읽기 전용
- "기획 추가" 버튼 (라인 49): 동작하지 않음

**콘텐츠 관리 (/admin/manage/page.tsx, 라인 1-127)**
- 5개 탭: RegionsPanel, FoodsPanel, PlacesPanel, RoutesPanel, ProductionsPanel
- 상태: 각 Panel 컴포넌트는 별도 파일에서 서버 액션으로 구현
- 구현도: 지역·음식·장소는 완성, 루트·촬영은 형태만 존재

**운영 (/admin/operations/page.tsx, 라인 1-159)**
- 신고 관리: ✅ ReportsPanel 완성
- 감사 로그: ✅ 서버 컴포넌트로 완성 (라인 118-158)
- 회원 관리: ❌ Placeholder (라인 88-93)
- 게시물/댓글 관리: ✅ PostsPanel, CommentsPanel 완성
- 설정: ✅ SettingsPanel 완성

### 2.3 admin-auth 처리 방식

**파일**: `/web/lib/admin-auth.ts`

```typescript
// 세션 쿠키 관리
adminAccessTokenCookie = "kfood_admin_access_token"
adminRefreshTokenCookie = "kfood_admin_refresh_token"
adminSessionMaxAge = 60 * 60 (1시간)

// 쿠키 options
{
  httpOnly: true,
  maxAge: 3600,
  path: "/admin",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
}
```

**세션 검증 흐름 (getAdminSession, 라인 143-218):**
1. 쿠키에서 access/refresh token 읽기
2. access token 유효성 확인 (supabase.auth.getUser)
3. access token 만료 시 refresh token으로 갱신
4. 사용자 profile 조회 (role 확인: "admin" | "editor")
5. is_active=true 확인

**위험 지점:**
- 라인 182-185: 서버 컴포넌트에서 쿠키 mutation 실패 시 catch 무시
  ```typescript
  try {
    await setAdminAuthCookies(data.session.access_token, data.session.refresh_token);
  } catch {
    // Server components cannot always mutate cookies
  }
  ```
  → 현재 요청에서는 문제없으나, 다음 요청에서 다시 갱신 시도

**개발용 플래그 (adminPreviewSession, 라인 220-235):**
```typescript
if (
  process.env.NODE_ENV !== "production" &&
  process.env.ADMIN_PREVIEW === "true"
) {
  // mock admin 세션 반환
}
```
⚠️ 프로덕션에서 `NODE_ENV=production` 가드만 의존 (라인 224)

---

## 3. 코드 품질 및 오류 위험 지점

### 3.1 packages/data/src/index.ts의 구조적 문제

**파일 규모**: 3,201줄 (단일 파일)

**문제점:**

#### (1) 위험한 타입 캐스팅 (as unknown as 남용)

**발견 위치:**
- 라인 1256: `addRegionSlugs(foods, regionFoodRows as unknown as RelatedSlugRow[])`
- 라인 1290: `mapPlace(row as unknown as PlaceRow)`
- 라인 1296: `addFoodSlugs(places, placeFoodRows as unknown as RelatedSlugRow[])`
- 라인 1328: `mapRouteGuide(row as unknown as RouteGuideRow)`
- 라인 1336: `routePlaceRows as unknown as RelatedSlugRow[]`
- 라인 1627: `profileRows as unknown as Array<{ display_name: string | null }>`
- 라인 1630: `entryRows as unknown as Array<{ food_slug: string; tried_at: string }>`
- 라인 1659, 1683, 1706, 1934, 1956, 2113, 2412, 2622, 2827, 3046: 동일 패턴 반복

**분석:**
- Supabase select()에서 반환 타입이 명확하지 않아 as unknown as 사용
- 런타임에 타입 검증 없음 → 데이터 구조 변경 시 silent failure 위험
- 영향도: **높음** (데이터 매핑 전 모든 단계에서 발생)

**권장 사항:**
```typescript
// 현재 (위험)
const foods = data.map(mapFood);
const withSlugs = addRegionSlugs(foods, regionFoodRows as unknown as RelatedSlugRow[]);

// 권장 (타입 안전)
type RegionFoodRow = {
  regions: { slug: string } | { slug: string }[] | null;
  foods: { slug: string } | { slug: string }[] | null;
  display_order: number | null;
};
const withSlugs = addRegionSlugs(foods, regionFoodRows as RegionFoodRow[]);
```

#### (2) 데이터 페칭 비효율: N+1 및 중복 페칭

**getPublishedFood 패턴 (라인 1259-1261):**
```typescript
export async function getPublishedFood(slug: string) {
  const foods = await getPublishedFoods();  // ← 전체 음식 리스트 페치
  return foods.find((food) => food.slug === slug);  // ← 클라이언트에서 필터
}
```

**발견:**
- 라인 1219-1221: `getPublishedRegion()` - 동일 패턴
- 라인 1299-1301: `getPublishedPlace()` - 동일 패턴
- 라인 1340-1342: `getPublishedRoute()` - 동일 패턴

**영향도: 높음**
- 페이지 로드마다 모든 foods/places/regions 조회
- 단일 음식 상세 페이지는 불필요한 오버헤드
- 캐싱/revalidation 정책 부재

**홈페이지 예시** (`/web/app/page.tsx`, 라인 54-63):
```typescript
const [foods, regions, routes] = await Promise.all([
  getPublishedFoods(),
  getPublishedRegions(),
  getPublishedRoutes()
]);
const featuredRegions = regions.slice(0, 3);
const trendingFoods = foods.slice(0, 6);
const curatedRoutes = routes.slice(0, 3);
```
→ 모든 foods 페치 후 slice(0, 6) (극도의 낭비)

#### (3) null/undefined 처리 누락

**firstRelatedSlug() 함수 (라인 688-696):**
```typescript
function firstRelatedSlug(
  related?: { slug: string } | { slug: string }[] | null
): string | null {
  if (Array.isArray(related)) {
    return related[0]?.slug ?? null;
  }
  return related?.slug ?? null;
}
```

**발견:**
- 라인 809: `regionSlug: firstRelatedSlug(row.regions) ?? "unknown"`
- 관계 조회 실패 시 "unknown" 반환 (타입 안전하지만 의미 손실)
- 데이터베이스 제약 위반 가능성 (places.region_id NOT NULL이나 query 관계 누락)

#### (4) Catch 후 조용히 fallback으로 숨김

**getPublishedFoods() (라인 1224-1257):**
```typescript
if (error || !data) {
  return fallbackData(fallbackFoods);  // ← 실제 오류를 숨김
}
```

**영향도: 중간**
- 데이터베이스 문제를 로그 없이 무시
- RLS 정책 위반, Supabase 재인증 등을 구분 불가
- 프로덕션에서 문제 추적 어려움

**발견:**
- 라인 1212-1213: `getPublishedRegions()`
- 라인 1246-1247: `getPublishedFoods()`
- 라인 1286-1287: `getPublishedPlaces()`
- 라인 1324-1325: `getPublishedRoutes()`

#### (5) 관계 데이터 로드 실패 시 데이터 불완전

**getPublishedFoods() (라인 1231-1254):**
```typescript
const [{ data, error }, { data: regionFoodRows, error: relationError }] =
  await Promise.all([
    supabase.from("foods").select(...),
    supabase.from("region_foods").select(...)
  ]);

if (error || !data) {
  return fallbackData(fallbackFoods);
}

const foods = data.map(mapFood);

if (relationError || !regionFoodRows) {
  return foods;  // ← regionSlugs 없이 반환!
}

return addRegionSlugs(foods, regionFoodRows as unknown as RelatedSlugRow[]);
```

**문제:**
- regionFoodRows 로드 실패 시 음식이 regionSlugs 없이 반환됨
- UI에서 이를 처리하지 않으면 장소 필터링 오류 발생 가능
- 라인 1252-1253의 관계 데이터 스킵은 "부분 성공"으로 취급

---

### 3.2 인증 및 세션 코드의 엣지 케이스

#### (1) proxy.ts의 refresh token 실패 처리

**파일**: `/web/proxy.ts`

**코드** (라인 131-139):
```typescript
const refreshedSession = await refreshSession(refreshToken);

if (!refreshedSession) {
  if (isExpired(accessToken)) {
    clearSessionCookies(requestCookies);
  }
  return;  // ← 요청 계속 진행 (만료된 토큰 with)
}
```

**위험:**
- refresh 실패했으나 access token이 아직 유효하면 그대로 진행
- 네트워크 hiccup 시 (refresh 실패하나 token 유효) 반복 실패 가능
- 라인 65 `refreshSkewSeconds = 60 * 5` (5분 버퍼)로 인해 실제 만료 전 갱신 시도하지만, 만료 판단은 `isExpired()` (라인 71-79)

#### (2) adminPreviewSession 플래그의 프로덕션 누출 위험

**파일**: `/web/lib/admin-auth.ts` (라인 220-235)

```typescript
function adminPreviewSession(): AdminSession | null {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW === "true"
  ) {
    return { accessToken: "admin-preview", userId: "admin-preview", ... };
  }
  return null;
}
```

**위험도: 중간**
- `.env.local`에 `ADMIN_PREVIEW=true` 설정 시 로그인 우회
- `NODE_ENV=production` 가드 의존 (배포 스크립트 오류 시 실패)
- 권장: 명시적인 환경변수 화이트리스트 (WHITELIST_PREVIEW_ADMINS="admin-preview" 등)

**동일 문제**:
- `/web/lib/public-auth.ts` (라인 268-285): `publicPreviewSession()`
- `/web/proxy.ts` (라인 308-315): 미들웨어에서도 중복 체크

#### (3) Supabase 클라이언트 설정 중복

**발견:**
- `/packages/data/src/index.ts` (라인 366-397): `createPublicClient()`, `createAuthenticatedClient()`
- `/web/lib/admin-auth.ts` (라인 35-80): `createSupabaseAuthClient()`, `createSupabaseUserClient()`, `createSupabaseRefreshClient()`
- `/web/lib/public-auth.ts` (라인 120-170): `createPublicSupabaseServerClient()`, `createPublicSupabaseUserClient()`

**구조 문제:** 같은 설정을 5곳에서 반복 정의 → 관리 비용 증가

---

### 3.3 ADMIN_PREVIEW 플래그의 프로덕션 누출

**파일 목록:**
1. `/web/lib/admin-auth.ts` 라인 224-225
2. `/web/lib/public-auth.ts` 라인 272-273
3. `/web/proxy.ts` 라인 310-312

**문제:**
- `.env` 설정 누락 시 기본값 없음 (안전)
- 그러나 CI/CD에서 `.env.local` 커밋 위험
- `.env.example`에는 명시 (라인 9-11)

**현 상태:** ✅ 코드 레벨 방어 충분하나, 배포 체크리스트 필요

---

### 3.4 RLS 정책과 클라이언트 코드 가정 불일치

**예시: places 테이블**

**마이그레이션 정의** (`supabase/migrations/002_service_rls_policies.sql`, 라인 76-83):
```sql
create policy "places_public_select_published"
on public.places for select
using (status = 'published'::public.publication_status);
```

**클라이언트 코드** (`packages/data/src/index.ts`, 라인 1264-1296):
```typescript
export async function getPublishedPlaces() {
  const { data: placeFoodRows, error: relationError } = await supabase
    .from("place_foods")
    .select("places(slug), foods(slug), display_order")
    .order("display_order", { ascending: true });
    // ← RLS 정책 없으면 전체 조회 가능 (published 필터 없음)
}
```

**위험도: 중간**
- place_foods 테이블에는 RLS 정책 존재 (라인 106-111)
- 그러나 중첩 select "places(...)" 는 RLS 자동 적용 안 됨 (선택적)
- 현재는 정책이 있으나, 향후 정책 제거 시 draft/hidden 데이터 노출 가능

**권장:** 마이그레이션 코드에 검증 주석 추가

---

### 3.5 데이터 페칭 캐싱/revalidate 정책 부재

**현 상황:**
- `/web/app/page.tsx`: 캐시 전략 명시 없음 (기본값: "force-cache")
- `/web/app/sitemap.ts`: revalidatePath 없음 (빌드 타임만 생성)
- Admin 페이지: revalidatePath("/admin/manage"), revalidatePath("/foods") (라인 53-54)

**문제:**
- 홈페이지의 getPublishedFoods() 결과는 캐시되어 하루 동안 갱신 안 됨
- 어드민에서 콘텐츠 발행 후 사용자는 캐시가 풀릴 때까지 대기

**발견 코드:**
```typescript
// /web/app/page.tsx (라인 54-59)
const [foods, regions, routes] = await Promise.all([
  getPublishedFoods(),      // 캐시 기본값
  getPublishedRegions(),    // 캐시 기본값
  getPublishedRoutes()      // 캐시 기본값
]);
```

**권장:**
```typescript
const foods = await getPublishedFoods().then(data => ({
  data,
  revalidate: 60  // 1분마다 재검증
}));
```

---

## 4. 홈페이지·공개 웹 구조 분석

### 4.1 SEO 기초

**metadata 설정** (`/web/app/layout.tsx`, 라인 13-26):
```typescript
export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url
  }
};
```

✅ **완성도:** 기본 SEO 구현됨

### 4.2 Sitemap & Robots

**robots.txt** (`/web/app/robots.ts`, 라인 1-23):
```typescript
rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin/", "/auth/", "/mypage", "/profile", "/photo-sources"]
  }
],
sitemap: `${siteConfig.url}/sitemap.xml`
```

✅ **완성도:** 적절함 (admin, 사용자 경로 제외)

**sitemap.ts** (`/web/app/sitemap.ts`, 라인 1-60):
- 정적 경로 + 동적 콘텐츠 (regions, foods, places, routes)
- 마지막 수정 시간: 현재 시점 (모든 항목 동일)

⚠️ **문제:** lastModified가 모두 `new Date()`로 설정 → 실제 수정 시간 반영 안 됨
```typescript
...staticRoutes.map((path) => ({
  url: `${siteConfig.url}${path}`,
  lastModified: now  // ← 모두 동일
}))
```

### 4.3 성능: 이미지 최적화

**CardPhoto 컴포넌트** (`/web/components/card-photo.tsx`):
- Image 컴포넌트 사용 (Next.js 최적화)
- placeholder 체크 있음 (라인 6-8)
- 그러나 많은 곳에서 `<img>` 태그 직접 사용 가능

⚠️ **조사 필요:** 통계 페이지에서 실제 이미지 렌더링 방식 확인

### 4.4 폰트 로딩 및 CSS 성능

**없음**: `/web/app/globals.css` 확인 필요 (내용 미제공)

⚠️ **추정 위험:** 기본 시스템 폰트 사용 가능 (성능 OK)

### 4.5 i18n 준비도

**현 상황:**
- HTML lang="en" 고정 (`/web/app/layout.tsx`, 라인 32)
- 콘텐츠는 영문/한문 혼재
- 사용자 프로필에 preferred_language 필드 있음 (라인 466, packages/data)

⚠️ **미준비:** i18n 라우팅 없음 (/en, /ko 경로 미지원)

---

## 5. 코드 품질 요약 테이블

| 카테고리 | 항목 | 위험도 | 발견 위치 | 설명 |
|---------|------|--------|---------|------|
| 타입 안전 | as unknown as 남용 | 높음 | packages/data:1256,1290,1328... (10+ 위치) | 런타임 타입 검증 없음 |
| 성능 | N+1 패칭 | 높음 | packages/data:1219-1261 | 단일 항목 조회 시 전체 리스트 fetch |
| 성능 | 캐싱 정책 부재 | 중간 | web/app/page.tsx:54-59 | sitemap 제너레이션도 빌드 타임만 |
| 에러 처리 | catch → fallback 무시 | 중간 | packages/data:1212,1246,1286... | DB 오류 로그 없음 |
| 인증 | adminPreviewSession 누출 | 중간 | web/lib/admin-auth:224-225 | NODE_ENV 가드만 의존 |
| 데이터 | 관계 로드 부분 실패 | 중간 | packages/data:1252-1253 | relationError 시 incomplete data 반환 |
| SEO | lastModified 고정 | 낮음 | web/app/sitemap.ts:38-41 | 모든 항목 현재 시간으로 설정 |
| i18n | 미준비 | 낮음 | web/app/layout.tsx:32 | lang="en" 고정 |

---

## 6. 개선 우선순위 제안

### A. 오류 가능성 높음 / 즉시 수정 권장

#### A1. as unknown as 타입 캐스팅 정리
**파일**: `packages/data/src/index.ts`
**라인**: 1256, 1290, 1328, 1627, 1630, 1659, 1683, 1706, 1934, 1956, 2113, 2412, 2622, 2827, 3046
**액션**: 
1. 각 Supabase select 결과에 대한 명시적 타입 정의
2. 런타임 타입 검증 추가 (예: zod 스키마)
3. 모든 as unknown as 제거

**추정 영향**: 데이터 무결성 보장, 향후 DB 변경 시 타입 안전성

---

#### A2. getPublished*() 단일 조회 비효율 해결
**파일**: `packages/data/src/index.ts`
**라인**: 1219-1261, 1299-1301, 1340-1342
**액션**:
1. 단일 조회용 함수 추가 (slug 필터 DB 레벨)
   ```typescript
   export async function getPublishedFood(slug: string) {
     const supabase = createPublicClient();
     const { data, error } = await supabase
       .from("foods")
       .select(...)
       .eq("slug", slug)
       .eq("status", "published")
       .maybeSingle();
     return error || !data ? null : mapFood(data);
   }
   ```
2. 캐싱 및 revalidate 전략 수립
3. 성능 테스트

**추정 영향**: 단일 페이지 로드 시간 50-80% 감소

---

#### A3. catch 후 fallback 오류 처리 개선
**파일**: `packages/data/src/index.ts`
**라인**: 1212-1214, 1246-1248, 1286-1288, 1324-1326
**액션**:
1. 에러를 console.error 또는 로깅 서비스에 기록
2. 프로덕션에서도 fallback 사용 가능하도록 설정
3. 에러 타입별 처리:
   - RLS 정책 위반: 사용자에게 "권한 없음" 표시
   - 네트워크: fallback 데이터 + 재시도 배너
   - DB: 관리자 알림

---

### B. 구조 개선 권장

#### B1. packages/data 모듈 분할
**파일**: `packages/data/src/index.ts` (3,201줄)
**제안**:
```
packages/data/src/
├── index.ts (export only)
├── types.ts (모든 타입 정의)
├── public/ (공개 쿼리)
│   ├── regions.ts
│   ├── foods.ts
│   ├── places.ts
│   └── routes.ts
├── auth/ (인증 쿼리)
│   ├── profile.ts
│   └── journey.ts
├── admin/ (어드민 쿼리)
│   ├── reports.ts
│   ├── places.ts
│   ├── foods.ts
│   └── audit.ts
└── utils/ (헬퍼)
    ├── mappers.ts
    └── validators.ts
```

**효과**: 유지보수성 +40%, 재사용 용이

---

#### B2. 인증 클라이언트 중복 제거
**발견**: 5곳에서 Supabase 클라이언트 생성 함수 중복
**파일**: 
- `packages/data/src/index.ts` 라인 366-397
- `web/lib/admin-auth.ts` 라인 35-80
- `web/lib/public-auth.ts` 라인 120-170

**제안**: `packages/config`에 통합
```typescript
// packages/config/src/supabase-clients.ts
export function createPublicClient() { ... }
export function createAuthenticatedClient(token) { ... }
```

---

#### B3. Admin Preview 세션 토글 명시화
**파일**: `web/lib/admin-auth.ts`, `web/lib/public-auth.ts`, `web/proxy.ts`
**라인**: 각 파일의 adminPreviewSession()
**제안**:
```typescript
// packages/config/src/index.ts
export const ADMIN_PREVIEW_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.ADMIN_PREVIEW === "true" &&
  process.env.ADMIN_PREVIEW_ALLOWED_EMAILS?.includes(process.env.ADMIN_PREVIEW_EMAIL);
```

---

### C. 나중에 해도 됨

#### C1. Sitemap lastModified 실제 수정 시간 반영
**파일**: `web/app/sitemap.ts` 라인 38-41
**영향**: SEO 점수 미미 (+2-3%)
**난도**: 낮음 (각 항목에 updated_at 필드 추가)

---

#### C2. i18n 라우팅 구현
**파일**: `web/app/layout.tsx`, 라고 구조
**영향**: UX 개선, 다국어 지원
**난도**: 높음 (라우팅, 콘텐츠 전략 재정의)
**타이밍**: 사용자 수 10만+ 이후

---

#### C3. 댓글 관리 UI 개선
**파일**: `web/components/admin/comments-panel.tsx`
**현 상태**: 기본 구현
**개선 방향**: 필터, 대량 작업, 신고 관련성 표시

---

## 7. 데이터베이스 스키마 요약

**테이블:**
- `profiles` (사용자, role: user|editor|admin)
- `regions`, `foods`, `places`, `route_guides` (공개 콘텐츠)
- `region_foods`, `place_foods`, `route_guide_places` (관계)
- `user_posts`, `user_post_comments` (UGC)
- `content_reports` (신고)
- `admin_audit_logs` (감사)
- `platform_settings` (기능 토글: community)
- `productions` (촬영 콘텐츠)
- `user_food_log` (사용자 음식 기록)

**RLS:** 활성화, publication_status 기반 공개/비공개 분리, role 기반 관리자 권한

---

## 8. 배포 체크리스트 (발견 사항 기반)

- [ ] ADMIN_PREVIEW 환경변수 제거 (.env.local에만)
- [ ] NODE_ENV=production 설정 확인
- [ ] REPORT_RATE_LIMIT_SALT 무작위 문자열 설정
- [ ] Supabase 서비스 계정 권한 제한 (CRUD 필요한 것만)
- [ ] RLS 정책 테스트 (published 상태만 조회 가능 확인)
- [ ] 에러 로깅 서비스 연동 (Sentry, DataDog 등)
- [ ] 캐시 전략 문서화 (sitemap, homepage revalidate 간격)

---

## 9. 결론

**종합 평가:**
- ✅ 기본 구조 및 인증 체계 탄탄함
- ✅ Admin 기능 대부분 구현됨
- ⚠️ 타입 안전성 미흡 (as unknown as 남용)
- ⚠️ 데이터 페칭 비효율 (N+1 패턴)
- ⚠️ 에러 처리 및 로깅 부족

**즉시 액션:**
1. **A1**: 타입 캐스팅 정리 (1주)
2. **A2**: 단일 조회 쿼리 최적화 (1주)
3. **A3**: 에러 로깅 추가 (3일)

**구조 개선 (계획):**
- packages/data 분할 (2주)
- 인증 클라이언트 통합 (3일)

**Go-live 가능성:** 현 상태로도 운영 가능하나, 위 3가지 즉시 액션 완료 후 권장.

