import { UpdatePasswordForm } from "@/components/update-password-form";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Set password"
};

export default function UpdatePasswordPage() {
  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Account setup</p>
        <h1>Set your password.</h1>
        <p className="detail-intro">
          Use this page after accepting an invitation or opening a password
          recovery email. After saving, sign in through the admin login page.
        </p>
      </header>
      <UpdatePasswordForm />
    </main>
  );
}
