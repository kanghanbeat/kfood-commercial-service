import { redirect } from "next/navigation";

import { clearPublicAuthCookies } from "@/lib/public-auth";

export async function GET() {
  await clearPublicAuthCookies();
  redirect("/");
}
