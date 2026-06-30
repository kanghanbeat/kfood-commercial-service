import { redirect } from "next/navigation";

// 통합: 운영 화면의 "감사 로그" 탭으로 이동 (admin-ui-design.md §6). 라우트는 보존.
export default function AdminAuditLogsRedirect() {
  redirect("/admin/operations?tab=audit");
}
