# K푸드 인사이트 주간 수집 파이프라인

내부대시보드(어드민 인사이트)의 주간 데이터를 **정밀 쿼리 + 자동 점수 계산**으로 만드는 절차.
원본 수집은 Claude 세션에서(정밀 쿼리), 점수·순위·해시태그·궁금증 계산은 `aggregate.mjs`가 한다.

## 한 주 흐름

1. **주차·날짜 확인** — ISO 주차(예: `2026-W32`)와 그 주 월~일 날짜 범위.
2. **정밀 수집(세션)** — 아래 쿼리로 Xpoz 호출 → 결과를 정규화해 `내부대시보드/data/raw/<week>/<platform>.json` 로 저장.
3. **집계** — `node scripts/insights/aggregate.mjs <week> --label "..." --range "..." --credits-used N --credits-remaining N`
4. **반영** — `node scripts/sync-dashboard.mjs` → 커밋 → 푸시 → main 머지 → 어드민 반영.

## 2단계: 정밀 쿼리 (노이즈 최소화가 핵심)

이전 시범수집의 문제(트위터 밈코인·틱톡 일반 food·오래된 글)를 막는 규칙:

- **틱톡**: 키워드 대신 **해시태그** — `getTiktokPostsByHashtags(["koreanfood","tteokbokki","buldak","kimchi","koreanstreetfood"])`
- **레딧**: **서브레딧 한정** — `getRedditPostsByKeywords(query, {subreddit:"KoreanFood", sort:"top", time:"week"})` 를 `KoreanFood` · `korea` · `InstantRamen` 각각.
- **트위터**: **제외어 + 리트윗 제외 + 이번 주 날짜** — `getTwitterPostsByKeywords('("korean food" OR tteokbokki OR bulgogi) NOT (coin OR crypto OR pump OR trump OR $)', {filterOutRetweets:true, startDate, endDate, fields:["text","hashtags","likeCount","retweetCount","replyCount","placeCountry","createdAtDate"]})`
- **인스타**: `getInstagramPostsByKeywords("korean food OR tteokbokki OR buldak")` 또는 해시태그. caption에 해시태그 포함.
- 모든 쿼리에 **startDate/endDate = 이번 주 범위**를 넣어 오래된 글 제거.

### 정규화 형식 (`raw/<week>/<platform>.json` = 배열)

있는 필드만 채우면 됨:

```json
{ "text": "", "title": "", "hashtags": ["buldak"], "likes": 0, "plays": 0,
  "comments": 0, "retweets": 0, "redditScore": 0, "replies": 0,
  "country": "US", "lang": "en", "date": "2026-08-05", "url": "", "subreddit": "KoreanFood" }
```

- 틱톡: description→text, likeCount→likes, playCount→plays, commentCount→comments
- 트위터: text, likeCount→likes, retweetCount→retweets, replyCount→comments, placeCountry→country
- 레딧: title/selftext→title/text, score→redditScore, commentsCount→comments/replies, subredditName→subreddit
- 인스타: caption→text, likeCount→likes, commentCount→comments

## 3단계: 집계기가 하는 계산 (점수 공식)

- **매칭**: 게시물이 워치리스트(`watchlist.json`) 음식의 이름/별칭/해시태그를 포함하면 그 음식으로 집계.
- **참여도** = 좋아요×1 + 조회×0.05 + 댓글×2 + 리트윗×2 + 레딧점수×1 (가중치는 watchlist.json에서 조정).
- **점수** = 플랫폼별로 그 주 전체 대비 **점유율(share)** 을 구해 합산 → 절대수치가 큰 플랫폼이 독식하지 않음.
- **정식 트렌드** = **2개 이상 플랫폼**에서 잡힌 음식만(한 플랫폼 노이즈 차단). 상위 10개, 최고=100점 정규화.
- **순위 변동(▲▼)** = 지난주 순위와 자동 비교(`NEW`/`+2`/`-1`).
- **핫푸드** = 상위 5개 + 각 음식의 최고 참여 게시물을 근거로 표시.
- **외국인 궁금증** = 레딧 질문형(‘?’ 또는 how/what/where…)에서 참여순 6개.
- **플랫폼 해시태그** = 빈도 상위(제네릭 #food·#fyp 등 제외).
- **국가별** = country 필드가 3개국 이상 있으면 실데이터로 갱신, 없으면 지난주 유지.

## 워치리스트 관리

`watchlist.json`에 음식 추가/수정. 새로 뜨는 음식은 `#koreanfood`와 함께 달린 인기 해시태그를 훑어 발견 후 추가한다(발견 패스).

## 안 하는 것

완전 무인 크론 자동화는 하지 않는다 — Xpoz(수집 도구)가 예약 클라우드 실행에선 인증이 안 붙을 수 있어서. "월요일 리마인더 + 세션 수집"이 더 안정적.
