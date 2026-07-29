// 구조화 데이터(JSON-LD)를 페이지에 심는다. 화면에는 안 보이고 검색엔진만 읽는다.
export function JsonLd({
  data
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // 우리가 만든 정적 객체만 넣는다(사용자 입력 아님).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
