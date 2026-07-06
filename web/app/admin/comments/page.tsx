import { redirect } from "next/navigation";

// 통합: 운영 화면의 "댓글 관리" 탭으로 이동. 라우트는 보존.
export default function AdminCommentsRedirect() {
  redirect("/admin/operations?tab=comments");
}
