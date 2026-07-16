import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/regions", label: "Regions" },
  { href: "/admin/foods", label: "Foods" },
  { href: "/admin/places", label: "Places" },
  { href: "/admin/routes", label: "Routes" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/user-posts", label: "User Posts" },
  { href: "/admin/user-posts/new", label: "New Post" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/audit-logs", label: "Audit Logs" }
];

export function AdminNav() {
  return (
    <nav aria-label="Admin navigation" className="admin-nav">
      {adminLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
      <form action="/admin/logout" method="post">
        <button className="admin-nav-signout" type="submit">
          Sign out
        </button>
      </form>
    </nav>
  );
}
