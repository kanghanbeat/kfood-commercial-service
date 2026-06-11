import { redirect } from "next/navigation";

import { clearAdminAuthCookies } from "@/lib/admin-auth";

export async function GET() {
  await clearAdminAuthCookies();
  redirect("/admin/login");
}
