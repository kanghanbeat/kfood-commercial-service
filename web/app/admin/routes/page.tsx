import { redirect } from "next/navigation";

// 통합: 콘텐츠 관리 화면의 "루트" 탭으로 이동 (admin-ui-design.md §6). 라우트는 보존.
export default function AdminRoutesRedirect() {
  redirect("/admin/manage?tab=routes");
}
