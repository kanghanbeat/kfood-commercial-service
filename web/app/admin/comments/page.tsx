import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getAdminComments,
  updateAdminCommentStatus,
  type UserPostCommentStatus
} from "@kfood/data";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Comments"
};

const commentStatuses: UserPostCommentStatus[] = [
  "published",
  "hidden",
  "removed"
];

function redirectWithError(message: string): never {
  redirect(`/admin/comments?error=${encodeURIComponent(message)}`);
}

async function updateComment(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as UserPostCommentStatus;

  if (!commentStatuses.includes(status)) {
    redirectWithError("Unsupported comment status.");
  }

  const result = await updateAdminCommentStatus(session.accessToken, {
    actorId: session.userId,
    commentId: String(formData.get("comment_id") ?? ""),
    moderationNote: String(formData.get("moderation_note") ?? ""),
    status
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/comments");
  redirect("/admin/comments?updated=1");
}

export default async function AdminCommentsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const [session, params] = await Promise.all([
    requireAdminSession(),
    searchParams
  ]);
  const comments = await getAdminComments(session.accessToken);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Comments</h1>
        <p className="detail-intro">
          Moderate user discussion attached to records. Keep helpful comments
          visible and hide or remove problematic ones.
        </p>
      </header>
      <AdminNav />
      {params?.updated ? (
        <p className="status-message success">Comment updated.</p>
      ) : null}
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <ul className="content-list">
        {comments.length === 0 ? (
          <li>
            <div className="list-item-body">
              <span className="meta-label">Queue empty</span>
              <strong>No comments yet</strong>
              <p>New comments will appear here after users write them.</p>
            </div>
          </li>
        ) : null}
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className="list-item-body">
              <span className="meta-label">
                {comment.status} · {new Date(comment.createdAt).toLocaleString("en")}
              </span>
              <strong>{comment.authorDisplayName ?? comment.authorId}</strong>
              <p>{comment.body}</p>
              <p>
                <a className="inline-link" href={`/feed/${comment.postId}`}>
                  Open parent record
                </a>
              </p>
              <form action={updateComment} className="form-panel">
                <input name="comment_id" type="hidden" value={comment.id} />
                <label>
                  Moderation status
                  <select defaultValue={comment.status} name="status">
                    {commentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Moderation note
                  <textarea
                    defaultValue={comment.moderationNote ?? ""}
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
