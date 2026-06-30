import { redirect } from "next/navigation";

// 통합: 콘텐츠 관리 화면의 "지역" 탭으로 이동 (admin-ui-design.md §6). 라우트는 보존.
export default function AdminRegionsRedirect() {
  redirect("/admin/manage?tab=regions");
}
