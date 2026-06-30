import { redirect } from "next/navigation";

// 통합: 콘텐츠 관리 화면의 "장소" 탭으로 이동 (admin-ui-design.md §6). 라우트는 보존.
// CRUD 로직은 components/admin/places-panel.tsx 로 추출되어 재사용됨.
export default function AdminPlacesRedirect() {
  redirect("/admin/manage?tab=places");
}
