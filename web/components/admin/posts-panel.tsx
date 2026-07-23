import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getAdminUserPosts, updateAdminUserPostStatus, type UserPostStatus } from "@kfood/data";

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

const moderationStatuses: Array<Extract<UserPostStatus, "published" | "hidden" | "removed">> = [
  "published",
  "hidden",
  "removed"
];

const postStatusOptions = moderationStatuses.map((status) => ({
  value: status,
  label: status
}));

function redirectWithError(formData: FormData, message: string): never {
  redirect(
    withReturnQuery(
      "/admin/operations?tab=posts",
      formData,
      `error=${encodeURIComponent(message)}`
    )
  );
}

async function updatePost(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const status = String(formData.get("status") ?? "") as Extract<
    UserPostStatus,
    "published" | "hidden" | "removed"
  >;

  if (!moderationStatuses.includes(status)) {
    redirectWithError(formData, "지원하지 않는 게시물 상태입니다.");
  }

  const result = await updateAdminUserPostStatus(session.accessToken, {
    actorId: session.userId,
    moderationNote: String(formData.get("moderation_note") ?? ""),
    postId: String(formData.get("post_id") ?? ""),
    status
  });

  if (!result.ok) {
    redirectWithError(formData, result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/operations");
  redirect(withReturnQuery("/admin/operations?tab=posts", formData, "updated=1"));
}

export async function PostsPanel({
  accessToken,
  message,
  params
}: {
  accessToken: string;
  message?: { error?: string; updated?: string; created?: string };
  params?: ListParams;
}) {
  const posts = await getAdminUserPosts(accessToken);
  const list = applyListParams(posts, params, {
    search: (post) => `${post.authorDisplayName ?? post.authorId} ${post.body}`,
    status: (post) => post.status
  });
  const ret = returnQuery(params);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>게시물 관리</h2>
        <p>
          고객이 로그인 후 직접 쓰는 후기·기록(커뮤니티 피드)을 검수하는 곳입니다.
          관리자가 만드는 콘텐츠 관리와는 다릅니다. 지금은 공개 로그인 기능이 없어
          비어있고, 아래 &ldquo;관리자 게시물 작성&rdquo;으로 알파 시드 데이터만 넣을 수 있습니다.
        </p>
      </div>
      <div className="action-row">
        <Link className="button primary" href="/admin/user-posts/new" prefetch={false}>
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
      ) : (
        <AdminListToolbar
          basePath="/admin/operations"
          matched={list.matched}
          params={params}
          searchHint="작성자·본문 검색"
          statuses={postStatusOptions}
          tab="posts"
          total={list.total}
        />
      )}
      {posts.length > 0 && list.matched === 0 ? (
        <div className="admin-empty">조건에 맞는 게시물이 없습니다. 검색어나 상태 필터를 바꿔보세요.</div>
      ) : null}
      <div className="admin-form-list">
        {list.rows.map((post) => (
          <AdminItem
            key={post.id}
            meta={
              <>
                <span className="admin-badge">
                  {post.status} · {post.visibility}
                </span>{" "}
                {new Date(post.createdAt).toLocaleString("en")}
              </>
            }
            previewHref={`/feed/${post.id}`}
            title={post.authorDisplayName ?? post.authorId}
          >
          <form action={updatePost} className="form-panel">
            <input name="post_id" type="hidden" value={post.id} />
            <input name="return_query" type="hidden" value={ret} />
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
          </AdminItem>
        ))}
      </div>

      <AdminPager
        basePath="/admin/operations"
        page={list.page}
        pageCount={list.pageCount}
        params={params}
        tab="posts"
      />
    </div>
  );
}
