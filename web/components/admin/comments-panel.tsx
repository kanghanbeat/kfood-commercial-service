import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminComments, updateAdminCommentStatus, type UserPostCommentStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const commentStatuses: UserPostCommentStatus[] = ["published", "hidden", "removed"];

function redirectWithError(message: string): never {
  redirect(`/admin/operations?tab=comments&error=${encodeURIComponent(message)}`);
}

async function updateComment(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as UserPostCommentStatus;

  if (!commentStatuses.includes(status)) {
    redirectWithError("지원하지 않는 댓글 상태입니다.");
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
  revalidatePath("/admin/operations");
  redirect("/admin/operations?tab=comments&updated=1");
}

export async function CommentsPanel({
  accessToken,
  message
}: {
  accessToken: string;
  message?: { error?: string; updated?: string };
}) {
  const comments = await getAdminComments(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>댓글 관리</h2>
        <p>게시물에 달린 댓글을 검토합니다. 도움이 되는 댓글은 유지하고, 문제 있는 댓글은 숨기거나 삭제하세요.</p>
      </div>
      {message?.updated ? (
        <p className="status-message success">댓글이 업데이트되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      {comments.length === 0 ? (
        <div className="admin-empty">아직 댓글이 없습니다. 사용자가 작성하면 여기에 표시됩니다.</div>
      ) : null}
      <div className="admin-form-list">
        {comments.map((comment) => (
          <form action={updateComment} className="form-panel" key={comment.id}>
            <input name="comment_id" type="hidden" value={comment.id} />
            <div className="admin-panel-head">
              <strong>{comment.authorDisplayName ?? comment.authorId}</strong>
              <p>
                <span className="admin-badge">{comment.status}</span>{" "}
                {new Date(comment.createdAt).toLocaleString("en")}
              </p>
            </div>
            <p>{comment.body}</p>
            <p>
              <a className="inline-link" href={`/feed/${comment.postId}`}>
                원 게시물 열기
              </a>
            </p>
            <label>
              모더레이션 상태
              <select defaultValue={comment.status} name="status">
                {commentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              모더레이션 메모
              <textarea
                defaultValue={comment.moderationNote ?? ""}
                maxLength={1000}
                name="moderation_note"
                placeholder="무엇을 확인하거나 변경했나요?"
              />
            </label>
            <button className="admin-btn primary" type="submit">
              댓글 저장
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
