import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getAdminUserPosts,
  updateAdminUserPostStatus,
  type UserPostStatus
} from "@kfood/data";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin User Posts"
};

const moderationStatuses: Array<Extract<UserPostStatus, "published" | "hidden" | "removed">> = [
  "published",
  "hidden",
  "removed"
];

function redirectWithError(message: string): never {
  redirect(`/admin/user-posts?error=${encodeURIComponent(message)}`);
}

async function updatePost(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as Extract<
    UserPostStatus,
    "published" | "hidden" | "removed"
  >;

  if (!moderationStatuses.includes(status)) {
    redirectWithError("Unsupported post status.");
  }

  const result = await updateAdminUserPostStatus(session.accessToken, {
    actorId: session.userId,
    moderationNote: String(formData.get("moderation_note") ?? ""),
    postId: String(formData.get("post_id") ?? ""),
    status
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/user-posts");
  redirect("/admin/user-posts?updated=1");
}

export default async function AdminUserPostsPage({
  searchParams
}: {
  searchParams?: Promise<{ created?: string; error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const posts = await getAdminUserPosts(session.accessToken);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>User posts</h1>
        <p className="detail-intro">
          Review submitted community records before they appear in public Feed.
          Every status change writes an audit log.
        </p>
      </header>
      <AdminNav />
      <div className="action-row">
        <Link className="button primary" href="/admin/user-posts/new">
          Create admin record
        </Link>
      </div>
      {params?.created ? (
        <p className="status-message success">Admin record created.</p>
      ) : null}
      {params?.updated ? (
        <p className="status-message success">User post updated.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <ul className="content-list">
        {posts.length === 0 ? (
          <li>
            <div className="list-item-body">
              <span className="meta-label">Queue empty</span>
              <strong>No user posts yet</strong>
              <p>Submitted records will appear here after users write them.</p>
            </div>
          </li>
        ) : null}
        {posts.map((post) => (
          <li key={post.id}>
            <div className="list-item-body">
              <span className="meta-label">
                {post.status} · {post.visibility} ·{" "}
                {new Date(post.createdAt).toLocaleString("en")}
              </span>
              <strong>{post.authorDisplayName ?? post.authorId}</strong>
              <p>{post.body}</p>
              <form action={updatePost} className="form-panel">
                <input name="post_id" type="hidden" value={post.id} />
                <label>
                  Moderation status
                  <select defaultValue="published" name="status">
                    {moderationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Moderation note
                  <textarea
                    defaultValue={post.moderationNote ?? ""}
                    maxLength={1000}
                    name="moderation_note"
                    placeholder="What did you verify or change?"
                  />
                </label>
                <button className="button primary" type="submit">
                  Save moderation
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
