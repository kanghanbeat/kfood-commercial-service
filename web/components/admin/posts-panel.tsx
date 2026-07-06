import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdminUserPosts, updateAdminUserPostStatus, type UserPostStatus } from "@kfood/data";

import { requireAdminSession } from "@/lib/admin-auth";

const moderationStatuses: Array<Extract<UserPostStatus, "published" | "hidden" | "removed">> = [
  "published",
  "hidden",
  "removed"
];

function redirectWithError(message: string): never {
  redirect(`/admin/operations?tab=posts&error=${encodeURIComponent(message)}`);
}

async function updatePost(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as Extract<
    UserPostStatus,
    "published" | "hidden" | "removed"
  >;

  if (!moderationStatuses.includes(status)) {
    redirectWithError("지원하지 않는 게시물 상태입니다.");
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
  revalidatePath("/admin/operations");
  redirect("/admin/operations?tab=posts&updated=1");
}

export async function PostsPanel({
  accessToken,
  message
}: {
  accessToken: string;
  message?: { error?: string; updated?: string; created?: string };
}) {
  const posts = await getAdminUserPosts(accessToken);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>게시물 관리</h2>
        <p>공개 피드에 노출되기 전 커뮤니티 게시물을 검토합니다.</p>
      </div>
      <div className="action-row">
        <Link className="button primary" href="/admin/user-posts/new">
          관리자 게시물 작성
        </Link>
      </div>
      {message?.created ? (
        <p className="status-message success">관리자 게시물이 생성되었습니다.</p>
      ) : null}
      {message?.updated ? (
        <p className="status-message success">게시물이 업데이트되었습니다.</p>
      ) : null}
      {message?.error ? (
        <p className="status-message error">{message.error}</p>
      ) : null}
      {posts.length === 0 ? (
        <div className="admin-empty">
          아직 게시물이 없습니다. 사용자가 작성하면 여기에 표시됩니다.
        </div>
      ) : null}
      <div className="admin-form-list">
        {posts.map((post) => (
          <form action={updatePost} className="form-panel" key={post.id}>
            <input name="post_id" type="hidden" value={post.id} />
            <div className="admin-panel-head">
              <strong>{post.authorDisplayName ?? post.authorId}</strong>
              <p>
                <span className="admin-badge">
                  {post.status} · {post.visibility}
                </span>{" "}
                {new Date(post.createdAt).toLocaleString("en")}
              </p>
            </div>
            <p>{post.body}</p>
            <label>
              모더레이션 상태
              <select defaultValue="published" name="status">
                {moderationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              모더레이션 메모
              <textarea
                defaultValue={post.moderationNote ?? ""}
                maxLength={1000}
                name="moderation_note"
                placeholder="무엇을 확인하거나 변경했나요?"
              />
            </label>
            <button className="admin-btn primary" type="submit">
              게시물 저장
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
