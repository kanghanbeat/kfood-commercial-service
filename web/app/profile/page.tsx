import { redirect } from "next/navigation";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Profile"
};

export default function ProfilePage() {
  redirect("/mypage");
}
