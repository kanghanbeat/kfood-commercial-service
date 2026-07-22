import { redirect } from "next/navigation";

// 통합: 제작 콘텐츠는 콘텐츠 제작 > 제작 목록 탭으로 이동. 라우트는 보존.
export default function AdminProductionsRedirect() {
  redirect("/admin/content?tab=productions");
}
