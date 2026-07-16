import type { SupportedLanguage } from "@kfood/data";

// UI 고정 문구 4개 국어 사전. DB 콘텐츠(음식 설명 등)는 번역하지 않는다 —
// 콘텐츠 번역은 스키마·운영 결정이 필요해 별도 단계 (기획정렬 §1-1 후순위 원칙).
// 키 구조는 화면 단위 그룹. 템플릿이 필요한 문구는 함수로 둔다.

export type Dictionary = typeof en;

const en = {
  languageName: "English",
  nav: {
    food: "Food",
    community: "Community",
    myPage: "My Page",
    login: "Log in",
    mypage: "Mypage",
    switchLanguage: "Language"
  },
  footer: {
    reportIssue: "Report an issue",
    contact: "Contact",
    editorialPolicy: "Editorial Policy",
    contentPolicy: "Content Policy",
    disclosures: "Disclosures",
    mapsNotice: "Maps Notice",
    privacy: "Privacy",
    terms: "Terms"
  },
  tabs: {
    dishes: "Dishes",
    regions: "Regions",
    places: "Places",
    routes: "Routes"
  },
  common: {
    explore: "Explore",
    view: "View",
    viewAll: "View all",
    home: "Home",
    foods: "Foods",
    spicy: "Spicy"
  },
  home: {
    heroBadge: "For travelers in Korea",
    heroHeadline: "Discover Korea through its food",
    heroSubtitle:
      "Find iconic dishes, the regions they come from, and the best places to taste them.",
    searchPlaceholder: "Search foods, regions, or places...",
    searchButton: "Search",
    popularLabel: "Popular:",
    heroCta: "Start your food journey",
    exploreEyebrow: "Explore",
    exploreTitle: "Where will you eat next?",
    exploreSubtitle: "Pick a region and discover the dishes worth traveling for.",
    allRegions: "All regions",
    mapBadge: "Interactive map coming soon",
    mapCopy:
      "A clickable map of Korea is on its way. Until then, jump straight into a region:",
    mapAreas: "areas",
    mapDishes: "dishes",
    mapComingSoon: "Guide coming soon",
    mapHint: "Hover a province to see its top food areas — tap to explore.",
    eatEyebrow: "Eat",
    trendingTitle: "Trending K-Food",
    trendingSubtitle: "The most talked-about dishes travelers are loving right now",
    editorEyebrow: "Editor's picks",
    routesTitle: "Curated food routes",
    routesSubtitle:
      "Ready-made food journeys that connect the best dishes, markets, and neighborhoods.",
    viewAllRoutes: "View all routes",
    watchEyebrow: "Watch",
    channelsTitle: "From our channels",
    channelsSubtitle: "Videos and stories we film at the places on this site.",
    channelsEmpty: "Fresh videos and posts from our channels are on the way."
  },
  lists: {
    foodsEyebrow: "Foods",
    foodsTitle: "Beginner-friendly K-food",
    foodsSummary:
      "Food pages explain taste, spice level, and where each dish fits in a Seoul trip.",
    regionsEyebrow: "Regions",
    regionsTitle: "Seoul areas by food intent",
    regionsSummary:
      "Start with the neighborhood that matches the traveler, then move into foods, places, and route ideas.",
    placesEyebrow: "Places",
    placesTitle: "Editorial place directions",
    placesSummary:
      "Place pages start as curated directions and trust notes before adding live map data or reservations.",
    routesEyebrow: "Routes",
    routesTitle: "K-food route ideas",
    routesSummary:
      "Routes package region, food, and place directions into traveler-sized plans."
  },
  foodDetail: {
    eyebrow: "Food guide",
    spicyLabels: ["Not spicy", "Mild", "Medium", "Spicy", "Very spicy"],
    knowTitle: "What to know before you order",
    descriptionH: "Description",
    tasteH: "Taste",
    goodToKnowH: "Good to know",
    menuTipH: "Menu tip",
    menuTipBody:
      "On Korean menus, 매운맛 (spicy level) tells you the heat. Ask for less spicy if you want it milder.",
    whereItFits: "Where it fits",
    whereToTry: "Where to try it",
    placesEmpty: "Verified places for this dish will appear here.",
    channelsTitle: "From our channels",
    inRegionLink: (food: string, region: string) => `${food} in ${region} →`
  },
  combo: {
    title: (food: string, region: string) => `${food} in ${region}`,
    whyTitle: (food: string, region: string) => `Why ${region} for ${food}`,
    aboutArea: "About the area",
    whereToTryIn: (region: string) => `Where to try it in ${region}`,
    placesEmpty: (food: string, region: string) =>
      `Verified ${food} places in ${region} will appear here. Meanwhile, see the`,
    fullGuideLink: (food: string) => `full ${food} guide`,
    otherAreas: (food: string) => `${food} in other areas`,
    keepExploring: "Keep exploring",
    foodGuide: (food: string) => `${food} guide`,
    areaGuide: (region: string) => `${region} area guide`,
    readGuide: "Read the guide →",
    exploreArea: "Explore the area →"
  }
};

const ko: Dictionary = {
  languageName: "한국어",
  nav: {
    food: "음식",
    community: "커뮤니티",
    myPage: "마이페이지",
    login: "로그인",
    mypage: "마이페이지",
    switchLanguage: "언어"
  },
  footer: {
    reportIssue: "문제 신고",
    contact: "문의하기",
    editorialPolicy: "편집 정책",
    contentPolicy: "콘텐츠 정책",
    disclosures: "고지 사항",
    mapsNotice: "지도 안내",
    privacy: "개인정보처리방침",
    terms: "이용약관"
  },
  tabs: {
    dishes: "음식",
    regions: "지역",
    places: "장소",
    routes: "루트"
  },
  common: {
    explore: "살펴보기",
    view: "보기",
    viewAll: "전체 보기",
    home: "홈",
    foods: "음식",
    spicy: "매운맛"
  },
  home: {
    heroBadge: "한국을 여행하는 당신에게",
    heroHeadline: "음식으로 한국을 발견하세요",
    heroSubtitle: "대표 음식과 그 음식이 나고 자란 지역, 맛볼 수 있는 최고의 장소를 찾아보세요.",
    searchPlaceholder: "음식, 지역, 장소 검색...",
    searchButton: "검색",
    popularLabel: "인기 검색어:",
    heroCta: "음식 여행 시작하기",
    exploreEyebrow: "탐색",
    exploreTitle: "다음 식사는 어디에서?",
    exploreSubtitle: "지역을 고르고 여행할 가치가 있는 음식을 발견하세요.",
    allRegions: "전체 지역",
    mapBadge: "클릭형 지도 준비 중",
    mapCopy: "한국 지도를 준비하고 있어요. 그동안 지역으로 바로 이동해 보세요:",
    mapAreas: "개 지역",
    mapDishes: "개 음식",
    mapComingSoon: "가이드 준비 중",
    mapHint: "지역 위에 마우스를 올리면 주요 음식 동네가 나타나요 — 누르면 이동!",
    eatEyebrow: "먹기",
    trendingTitle: "지금 뜨는 K-푸드",
    trendingSubtitle: "여행자들이 지금 가장 많이 이야기하는 음식",
    editorEyebrow: "에디터 픽",
    routesTitle: "큐레이션 음식 루트",
    routesSubtitle: "최고의 음식·시장·동네를 잇는 준비된 음식 여정.",
    viewAllRoutes: "전체 루트 보기",
    watchEyebrow: "보기",
    channelsTitle: "우리 채널에서",
    channelsSubtitle: "이 사이트의 장소에서 직접 촬영한 영상과 이야기.",
    channelsEmpty: "채널의 새 영상과 콘텐츠를 준비하고 있어요."
  },
  lists: {
    foodsEyebrow: "음식",
    foodsTitle: "입문자도 즐기는 K-푸드",
    foodsSummary: "각 음식 페이지에서 맛, 매운 정도, 여행 중 어울리는 순간을 설명합니다.",
    regionsEyebrow: "지역",
    regionsTitle: "취향별 서울 동네",
    regionsSummary: "여행자에게 맞는 동네에서 시작해 음식, 장소, 루트로 이어가 보세요.",
    placesEyebrow: "장소",
    placesTitle: "에디터가 안내하는 장소",
    placesSummary: "장소 페이지는 큐레이션된 길 안내와 신뢰 노트에서 시작합니다.",
    routesEyebrow: "루트",
    routesTitle: "K-푸드 루트 아이디어",
    routesSummary: "지역·음식·장소를 여행자 규모의 계획으로 묶었습니다."
  },
  foodDetail: {
    eyebrow: "음식 가이드",
    spicyLabels: ["안 매움", "약간 매움", "보통", "매움", "아주 매움"],
    knowTitle: "주문 전에 알아두면 좋은 것",
    descriptionH: "소개",
    tasteH: "맛",
    goodToKnowH: "알아두기",
    menuTipH: "메뉴 팁",
    menuTipBody: "한국 메뉴판의 '매운맛' 표기가 매운 정도를 알려줍니다. 덜 맵게 먹고 싶다면 '덜 맵게'를 요청하세요.",
    whereItFits: "어울리는 지역",
    whereToTry: "맛볼 수 있는 곳",
    placesEmpty: "이 음식의 검증된 장소가 여기에 표시됩니다.",
    channelsTitle: "우리 채널에서",
    inRegionLink: (food: string, region: string) => `${region}의 ${food} →`
  },
  combo: {
    title: (food: string, region: string) => `${region}의 ${food}`,
    whyTitle: (food: string, region: string) => `${food}은(는) 왜 ${region}인가`,
    aboutArea: "지역 소개",
    whereToTryIn: (region: string) => `${region}에서 맛볼 수 있는 곳`,
    placesEmpty: (food: string, region: string) =>
      `${region}의 검증된 ${food} 장소가 여기에 표시됩니다. 그동안 이 가이드를 보세요:`,
    fullGuideLink: (food: string) => `${food} 전체 가이드`,
    otherAreas: (food: string) => `다른 지역의 ${food}`,
    keepExploring: "계속 둘러보기",
    foodGuide: (food: string) => `${food} 가이드`,
    areaGuide: (region: string) => `${region} 지역 가이드`,
    readGuide: "가이드 읽기 →",
    exploreArea: "지역 살펴보기 →"
  }
};

const ja: Dictionary = {
  languageName: "日本語",
  nav: {
    food: "フード",
    community: "コミュニティ",
    myPage: "マイページ",
    login: "ログイン",
    mypage: "マイページ",
    switchLanguage: "言語"
  },
  footer: {
    reportIssue: "問題を報告",
    contact: "お問い合わせ",
    editorialPolicy: "編集ポリシー",
    contentPolicy: "コンテンツポリシー",
    disclosures: "開示事項",
    mapsNotice: "地図に関する注意",
    privacy: "プライバシー",
    terms: "利用規約"
  },
  tabs: {
    dishes: "料理",
    regions: "エリア",
    places: "スポット",
    routes: "ルート"
  },
  common: {
    explore: "見てみる",
    view: "見る",
    viewAll: "すべて見る",
    home: "ホーム",
    foods: "フード",
    spicy: "辛さ"
  },
  home: {
    heroBadge: "韓国を旅するあなたへ",
    heroHeadline: "食で韓国を発見しよう",
    heroSubtitle: "定番料理、その料理が生まれたエリア、味わえるベストなお店を見つけましょう。",
    searchPlaceholder: "料理・エリア・スポットを検索...",
    searchButton: "検索",
    popularLabel: "人気:",
    heroCta: "フードの旅を始める",
    exploreEyebrow: "探す",
    exploreTitle: "次はどこで食べる?",
    exploreSubtitle: "エリアを選んで、旅する価値のある料理を見つけましょう。",
    allRegions: "全エリア",
    mapBadge: "クリックできる地図を準備中",
    mapCopy: "韓国マップを準備しています。それまではエリアから直接どうぞ:",
    mapAreas: "エリア",
    mapDishes: "料理",
    mapComingSoon: "ガイド準備中",
    mapHint: "地域にカーソルを合わせると人気グルメエリアが表示されます — タップで移動。",
    eatEyebrow: "食べる",
    trendingTitle: "話題のKフード",
    trendingSubtitle: "旅行者がいま最も注目している料理",
    editorEyebrow: "エディターズピック",
    routesTitle: "厳選フードルート",
    routesSubtitle: "ベストな料理・市場・街をつなぐ、すぐ使えるフードの旅程。",
    viewAllRoutes: "すべてのルートを見る",
    watchEyebrow: "見る",
    channelsTitle: "公式チャンネルから",
    channelsSubtitle: "このサイトのスポットで撮影した動画とストーリー。",
    channelsEmpty: "チャンネルの新しい動画・投稿を準備中です。"
  },
  lists: {
    foodsEyebrow: "フード",
    foodsTitle: "初心者にやさしいKフード",
    foodsSummary: "各料理ページで味、辛さ、旅のどんな場面に合うかを解説します。",
    regionsEyebrow: "エリア",
    regionsTitle: "目的別ソウルエリア",
    regionsSummary: "旅行者に合う街から始めて、料理・スポット・ルートへ進みましょう。",
    placesEyebrow: "スポット",
    placesTitle: "エディターが案内するお店",
    placesSummary: "スポットページは、厳選された道案内と信頼ノートから始まります。",
    routesEyebrow: "ルート",
    routesTitle: "Kフードルートのアイデア",
    routesSummary: "エリア・料理・スポットを旅行者サイズのプランにまとめました。"
  },
  foodDetail: {
    eyebrow: "フードガイド",
    spicyLabels: ["辛くない", "ピリ辛", "中辛", "辛口", "激辛"],
    knowTitle: "注文前に知っておきたいこと",
    descriptionH: "紹介",
    tasteH: "味",
    goodToKnowH: "豆知識",
    menuTipH: "メニューのコツ",
    menuTipBody: "韓国のメニューでは「매운맛(辛さ)」が辛さの目安です。控えめにしたい場合は「トル・メプケ(辛さ控えめ)」と伝えましょう。",
    whereItFits: "合うエリア",
    whereToTry: "味わえるお店",
    placesEmpty: "この料理の検証済みスポットがここに表示されます。",
    channelsTitle: "公式チャンネルから",
    inRegionLink: (food: string, region: string) => `${region}の${food} →`
  },
  combo: {
    title: (food: string, region: string) => `${region}の${food}`,
    whyTitle: (food: string, region: string) => `${food}になぜ${region}なのか`,
    aboutArea: "エリア紹介",
    whereToTryIn: (region: string) => `${region}で味わえるお店`,
    placesEmpty: (food: string, region: string) =>
      `${region}の検証済み${food}スポットがここに表示されます。それまではこちらをどうぞ:`,
    fullGuideLink: (food: string) => `${food}完全ガイド`,
    otherAreas: (food: string) => `他エリアの${food}`,
    keepExploring: "さらに見る",
    foodGuide: (food: string) => `${food}ガイド`,
    areaGuide: (region: string) => `${region}エリアガイド`,
    readGuide: "ガイドを読む →",
    exploreArea: "エリアを見る →"
  }
};

const zh: Dictionary = {
  languageName: "中文",
  nav: {
    food: "美食",
    community: "社区",
    myPage: "我的主页",
    login: "登录",
    mypage: "我的主页",
    switchLanguage: "语言"
  },
  footer: {
    reportIssue: "问题反馈",
    contact: "联系我们",
    editorialPolicy: "编辑政策",
    contentPolicy: "内容政策",
    disclosures: "信息披露",
    mapsNotice: "地图说明",
    privacy: "隐私政策",
    terms: "服务条款"
  },
  tabs: {
    dishes: "美食",
    regions: "地区",
    places: "店铺",
    routes: "路线"
  },
  common: {
    explore: "探索",
    view: "查看",
    viewAll: "查看全部",
    home: "首页",
    foods: "美食",
    spicy: "辣度"
  },
  home: {
    heroBadge: "写给来韩国旅行的你",
    heroHeadline: "通过美食发现韩国",
    heroSubtitle: "找到经典韩餐、它们的发源地区，以及品尝它们的最佳去处。",
    searchPlaceholder: "搜索美食、地区或店铺...",
    searchButton: "搜索",
    popularLabel: "热门:",
    heroCta: "开启美食之旅",
    exploreEyebrow: "探索",
    exploreTitle: "下一餐去哪里吃?",
    exploreSubtitle: "选择一个地区，发现值得专程前往的美食。",
    allRegions: "全部地区",
    mapBadge: "可点击地图即将上线",
    mapCopy: "韩国地图正在准备中。现在可以直接进入感兴趣的地区:",
    mapAreas: "个地区",
    mapDishes: "道美食",
    mapComingSoon: "指南即将上线",
    mapHint: "将鼠标悬停在省市上即可查看热门美食街区 — 点击进入。",
    eatEyebrow: "吃",
    trendingTitle: "热门韩国美食",
    trendingSubtitle: "旅行者们当下讨论最多的美食",
    editorEyebrow: "编辑推荐",
    routesTitle: "精选美食路线",
    routesSubtitle: "串联最佳美食、市场和街区的现成美食行程。",
    viewAllRoutes: "查看全部路线",
    watchEyebrow: "看",
    channelsTitle: "来自我们的频道",
    channelsSubtitle: "在本站店铺实地拍摄的视频与故事。",
    channelsEmpty: "频道的新视频和内容正在制作中。"
  },
  lists: {
    foodsEyebrow: "美食",
    foodsTitle: "新手友好的韩国美食",
    foodsSummary: "每个美食页面介绍味道、辣度，以及它适合旅程中的哪个时刻。",
    regionsEyebrow: "地区",
    regionsTitle: "按需求划分的首尔街区",
    regionsSummary: "从适合你的街区开始，再深入美食、店铺和路线。",
    placesEyebrow: "店铺",
    placesTitle: "编辑推荐的店铺",
    placesSummary: "店铺页面从精选的路线指引和信任笔记开始。",
    routesEyebrow: "路线",
    routesTitle: "韩国美食路线灵感",
    routesSummary: "将地区、美食和店铺打包成适合旅行者的计划。"
  },
  foodDetail: {
    eyebrow: "美食指南",
    spicyLabels: ["不辣", "微辣", "中辣", "辣", "特辣"],
    knowTitle: "点餐前须知",
    descriptionH: "介绍",
    tasteH: "味道",
    goodToKnowH: "小贴士",
    menuTipH: "菜单提示",
    menuTipBody: "韩国菜单上的「매운맛(辣度)」表示辣的程度。想吃得温和一些，可以要求「少辣」。",
    whereItFits: "适合的地区",
    whereToTry: "推荐店铺",
    placesEmpty: "这道菜经过验证的店铺将显示在这里。",
    channelsTitle: "来自我们的频道",
    inRegionLink: (food: string, region: string) => `${region}的${food} →`
  },
  combo: {
    title: (food: string, region: string) => `${region}的${food}`,
    whyTitle: (food: string, region: string) => `为什么在${region}吃${food}`,
    aboutArea: "地区介绍",
    whereToTryIn: (region: string) => `在${region}品尝的店铺`,
    placesEmpty: (food: string, region: string) =>
      `${region}经过验证的${food}店铺将显示在这里。您可以先查看:`,
    fullGuideLink: (food: string) => `${food}完整指南`,
    otherAreas: (food: string) => `其他地区的${food}`,
    keepExploring: "继续探索",
    foodGuide: (food: string) => `${food}指南`,
    areaGuide: (region: string) => `${region}地区指南`,
    readGuide: "阅读指南 →",
    exploreArea: "探索地区 →"
  }
};

export const dictionaries: Record<SupportedLanguage, Dictionary> = {
  en,
  ko,
  ja,
  zh
};
