import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminSessionCookie = "kfood_admin_session";

export async function GET() {
  const cookieStore = await cookies();

  cookieStore.delete(adminSessionCookie);
  redirect("/admin/login");
}
