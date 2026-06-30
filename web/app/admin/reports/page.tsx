import { redirect } from "next/navigation";

// 통합: 운영 화면의 "신고 관리" 탭으로 이동 (admin-ui-design.md §6). 라우트는 보존.
// CRUD 로직은 components/admin/reports-panel.tsx 로 추출되어 재사용됨.
export default function AdminReportsRedirect() {
  redirect("/admin/operations?tab=reports");
}
