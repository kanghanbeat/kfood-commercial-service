import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminComments, updateAdminCommentStatus, type UserPostCommentStatus } from "@kfood/data";

import {
  AdminItem,
  AdminListToolbar,
  AdminPager,
  applyListParams,
  returnQuery,
  withReturnQuery,
  type ListParams
} from "@/components/admin/list-controls";
import { requireAdminSession } from "@/lib/admin-auth";

const commentStatuses: UserPostCommentStatus[] = ["published", "hidden", "removed"];

const commentStatusOptions = commentStatuses.map((status) => ({
  value: status,
  label: status
}));

function redirectWithError(formData: FormData, message: string): never {
  redirect(
    withReturnQuery(
      "/admin/operations?tab=comments",
      formData,
      `error=${encodeURIComponent(message)}`
    )
  );
}

async function updateComment(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as UserPostCommentStatus;

  if (!commentStatuses.includes(status)) {
    redirectWithError(formData, "지원하지 않는 댓글 상태입니다.");
  }

  const result = await updateAdminCommentStatus(session.accessToken, {
    actorId: session.userId,
    commentId: String(formData.get("comment_id") ?? ""),
    moderationNote: String(formData.get("moderation_note") ?? ""),
    status
  });

  if (!result.ok) {
    redirectWithError(formData, result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/operations");
  redirect(withReturnQuery("/admin/operations?tab=comments", formData, "updated=1"));
}

export async function CommentsPanel({
  accessToken,
  message,
  params
}: {
  accessToken: string;
  message?: { error?: string; updated?: string };
  params?: ListParams;
}) {
  const comments = await getAdminComments(accessToken);
  const list = applyListParams(comments, params, {
    search: (comment) => `${comment.authorDisplayName ?? comment.authorId} ${comment.body}`,
    status: (comment) => comment.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>댓글 관리</h2>
        <p>
          위 게시물 관리(고객 후기)에 달린 고객 댓글을 검수합니다. 도움이 되는
          댓글은 유지하고, 문제 있는 댓글은 숨기거나 삭제하세요.
        </p>
      </div>
      {message?.updated ? (
        <p className="status-message success">댓글이 업데이트되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      {comments.length === 0 ? (
        <div className="admin-empty">아직 댓글이 없습니다. 사용자가 작성하면 여기에 표시됩니다.</div>
      ) : (
        <AdminListToolbar
          basePath="/admin/operations"
          matched={list.matched}
          params={params}
          searchHint="작성자·본문 검색"
          statuses={commentStatusOptions}
          tab="comments"
          total={list.total}
        />
      )}
      {comments.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 댓글이 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}
      <div className="admin-form-list">
        {list.rows.map((comment) => (
          <AdminItem
            key={comment.id}
            meta={
              <>
                <span className="admin-badge">{comment.status}</span>{" "}
                {new Date(comment.createdAt).toLocaleString("en")}
              </>
            }
            previewHref={`/feed/${comment.postId}`}
            title={comment.authorDisplayName ?? comment.authorId}
          >
          <form action={updateComment} className="form-panel">
            <input name="comment_id" type="hidden" value={comment.id} />
            <input name="return_query" type="hidden" value={ret} />
            <p>{comment.body}</p>
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
          </AdminItem>
        ))}
      </div>

      <AdminPager
        basePath="/admin/operations"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="comments"
      />
    </div>
  );
}
